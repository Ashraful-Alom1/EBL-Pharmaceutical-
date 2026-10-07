import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_BLOGS,
  INITIAL_ORDERS,
  INITIAL_JOBS,
} from "./mock-data";
import { Product, Category, BlogPost, Review, JobPosting, Order, Paise, Address, OrderItem, InventoryBatch, Wholesaler, WholesaleOrderItem, WholesaleOrder, Expense, JobApplication, Lead, CompanySettings } from "./types";
export type { Product, Category, BlogPost, Review, JobPosting, Order, Paise, Address, OrderItem, InventoryBatch, Wholesaler, WholesaleOrderItem, WholesaleOrder, Expense, JobApplication, Lead, CompanySettings };
import { calculateGst } from "./gst";
import { COMPANY_INFO, INITIAL_COMPANY_SETTINGS } from "./constants";
import { STORE_VISUALS } from "./store-visuals";
import { database, firestore } from "./firebase-client";
import { ref, set, onValue } from "firebase/database";
import { collection, doc, setDoc, getDocs, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";



const STORAGE_KEY = "ebl_store_data_v10_prod";

function sanitizeStoreVisuals(visuals: any): typeof STORE_VISUALS {
  if (!visuals || typeof visuals !== "object") return STORE_VISUALS;
  const sanitized = { ...STORE_VISUALS, ...visuals };
  // Guarantee 100% genuine Eastern Biochemicals product banners
  sanitized.heroSlides = STORE_VISUALS.heroSlides;
  return sanitized;
}

function sanitizeEntities<T extends { id: string }>(items: any[], deletedIds: string[] = []): T[] {
  if (!Array.isArray(items)) return [];
  const deletedSet = new Set(deletedIds);
  return items.filter((item) => item && item.id && !deletedSet.has(item.id)) as T[];
}

class DataStore {
  private listeners: (() => void)[] = [];
  private isInitialized = false;

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error("DataStore listener error:", err);
      }
    });
  }

  private registerDeletion(id: string) {
    if (id && !this.deletedIds.includes(id)) {
      this.deletedIds.push(id);
    }
  }

  // --- Persistence Layer (ACID Local Durability + Firebase Cloud Sync) ---
  private saveToFirebase() {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        products: this.products,
        categories: this.categories,
        reviews: this.reviews,
        storeVisuals: this.storeVisuals,
        orders: this.orders,
        batches: this.batches,
        wholesalers: this.wholesalers,
        wholesaleOrders: this.wholesaleOrders,
        blogs: this.blogs,
        expenses: this.expenses,
        leads: this.leads,
        jobs: this.jobs,
        applications: this.applications,
        companySettings: this.companySettings,
        deletedIds: this.deletedIds,
        auditLogs: this.auditLogs.slice(0, 50),
        syncedAt: new Date().toISOString(),
      };

      // 1. Cloud Firestore Primary System Sync
      setDoc(doc(firestore, "system", "storeData"), payload, { merge: true }).catch((err) => {
        console.warn("Firestore sync note (requires published rules):", err?.message || err);
      });

      // 2. Firebase Realtime Database High-Speed Sync
      set(ref(database, "storeData"), payload).catch((err) => {
        console.warn("Firebase RTDB sync note:", err?.message || err);
      });
    } catch (e) {
      console.warn("Firebase save error:", e);
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      try {
        const payload = {
          products: this.products,
          categories: this.categories,
          reviews: this.reviews,
          storeVisuals: this.storeVisuals,
          orders: this.orders,
          batches: this.batches,
          wholesalers: this.wholesalers,
          wholesaleOrders: this.wholesaleOrders,
          blogs: this.blogs,
          expenses: this.expenses,
          leads: this.leads,
          jobs: this.jobs,
          applications: this.applications,
          companySettings: this.companySettings,
          deletedIds: this.deletedIds,
          auditLogs: this.auditLogs.slice(0, 50),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        window.dispatchEvent(new Event("ebl-store-updated"));
      } catch (e) {
        console.warn("localStorage write error:", e);
      }
      this.saveToFirebase();
    }
    this.notify();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.deletedIds)) {
          this.deletedIds = Array.from(new Set([...this.deletedIds, ...data.deletedIds]));
        }

        if (Array.isArray(data.products)) this.products = sanitizeEntities(data.products, this.deletedIds);
        if (Array.isArray(data.categories)) this.categories = sanitizeEntities(data.categories, this.deletedIds);
        if (Array.isArray(data.reviews)) this.reviews = sanitizeEntities(data.reviews, this.deletedIds);
        if (data.storeVisuals && typeof data.storeVisuals === "object") this.storeVisuals = sanitizeStoreVisuals({ ...this.storeVisuals, ...data.storeVisuals });
        if (Array.isArray(data.orders)) this.orders = sanitizeEntities(data.orders, this.deletedIds);
        if (Array.isArray(data.batches)) this.batches = sanitizeEntities(data.batches, this.deletedIds);
        if (Array.isArray(data.wholesalers)) this.wholesalers = sanitizeEntities(data.wholesalers, this.deletedIds);
        if (Array.isArray(data.wholesaleOrders)) this.wholesaleOrders = sanitizeEntities(data.wholesaleOrders, this.deletedIds);
        if (Array.isArray(data.blogs)) this.blogs = sanitizeEntities(data.blogs, this.deletedIds);
        if (Array.isArray(data.expenses)) this.expenses = sanitizeEntities(data.expenses, this.deletedIds);
        if (Array.isArray(data.leads)) this.leads = sanitizeEntities(data.leads, this.deletedIds);
        if (Array.isArray(data.jobs)) this.jobs = sanitizeEntities(data.jobs, this.deletedIds);
        if (Array.isArray(data.applications)) this.applications = sanitizeEntities(data.applications, this.deletedIds);
        if (data.companySettings && typeof data.companySettings === "object") this.companySettings = { ...this.companySettings, ...data.companySettings };
        if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) this.auditLogs = data.auditLogs;
      }
      // Note: If no localStorage entry exists yet, we NEVER call this.save() or this.saveToFirebase().
      // This prevents fresh client sessions, mobile devices, and incognito windows from wiping out cloud data!
    } catch (e) {
      console.warn("localStorage read error:", e);
    }
  }

  private initFirebaseSync() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    try {
      this.loadFromStorage();

      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          this.loadFromStorage();
          this.notify();
        }
      });

      window.addEventListener("ebl-store-updated", () => {
        this.notify();
      });

      onValue(ref(database, "storeData"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (Array.isArray(data.deletedIds)) {
            this.deletedIds = Array.from(new Set([...this.deletedIds, ...data.deletedIds]));
          }

          if (Array.isArray(data.products)) this.products = sanitizeEntities(data.products, this.deletedIds);
          if (Array.isArray(data.categories)) this.categories = sanitizeEntities(data.categories, this.deletedIds);
          if (Array.isArray(data.reviews)) this.reviews = sanitizeEntities(data.reviews, this.deletedIds);
          if (data.storeVisuals) this.storeVisuals = sanitizeStoreVisuals({ ...this.storeVisuals, ...data.storeVisuals });
          if (Array.isArray(data.orders)) this.orders = sanitizeEntities(data.orders, this.deletedIds);
          if (Array.isArray(data.batches)) this.batches = sanitizeEntities(data.batches, this.deletedIds);
          if (Array.isArray(data.wholesalers)) this.wholesalers = sanitizeEntities(data.wholesalers, this.deletedIds);
          if (Array.isArray(data.wholesaleOrders)) this.wholesaleOrders = sanitizeEntities(data.wholesaleOrders, this.deletedIds);
          if (Array.isArray(data.blogs)) this.blogs = sanitizeEntities(data.blogs, this.deletedIds);
          if (Array.isArray(data.expenses)) this.expenses = sanitizeEntities(data.expenses, this.deletedIds);
          if (Array.isArray(data.leads)) this.leads = sanitizeEntities(data.leads, this.deletedIds);
          if (Array.isArray(data.jobs)) this.jobs = sanitizeEntities(data.jobs, this.deletedIds);
          if (Array.isArray(data.applications)) this.applications = sanitizeEntities(data.applications, this.deletedIds);
          if (data.companySettings && typeof data.companySettings === "object") this.companySettings = { ...this.companySettings, ...data.companySettings };
          if (Array.isArray(data.auditLogs)) this.auditLogs = data.auditLogs;

          // Recalculate low stock flags based on current reorder levels
          this.products.forEach((p) => {
            p.isLowStock = p.stockAvailable <= (p.reorderLevel ?? 25);
          });

          try {
            const payload = {
              products: this.products,
              categories: this.categories,
              reviews: this.reviews,
              storeVisuals: this.storeVisuals,
              orders: this.orders,
              batches: this.batches,
              wholesalers: this.wholesalers,
              wholesaleOrders: this.wholesaleOrders,
              blogs: this.blogs,
              expenses: this.expenses,
              leads: this.leads,
              jobs: this.jobs,
              applications: this.applications,
              companySettings: this.companySettings,
              deletedIds: this.deletedIds,
              auditLogs: this.auditLogs.slice(0, 50),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          } catch {
            // ignore
          }
          this.notify();
        } else {
          this.saveToFirebase();
        }
      });
    } catch (error) {
      console.warn("Firebase sync error:", error);
    }
  }

  // --- Initial Data Sets ---
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private storeVisuals = sanitizeStoreVisuals({ ...STORE_VISUALS });
  private blogs: BlogPost[] = [...INITIAL_BLOGS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private jobs: JobPosting[] = [...INITIAL_JOBS];
  private applications: JobApplication[] = [];
  private companySettings: CompanySettings = { ...INITIAL_COMPANY_SETTINGS };
  private deletedIds: string[] = [];

  private batches: InventoryBatch[] = [
    {
      id: "batch-01",
      productId: "eb-prod-001",
      productName: "EBL RAFT Rapid Acid Fight Therapy Antacid Suspension (200 ml)",
      batchNo: "EB-RF26A",
      expiryDate: "2029-12-31",
      qtyOnHand: 150,
      costPaise: 8500,
    },
    {
      id: "batch-02",
      productId: "eb-prod-002",
      productName: "EBL Cilalong 10 mg Cilnidipine Tablets IP (3 x 10 Tablets)",
      batchNo: "EB-CL10A",
      expiryDate: "2029-06-30",
      qtyOnHand: 280,
      costPaise: 11000,
    },
    {
      id: "batch-03",
      productId: "eb-prod-003",
      productName: "EBL Cilalong 5 mg Cilnidipine Tablets IP (3 x 10 Tablets)",
      batchNo: "EB-CL05A",
      expiryDate: "2028-11-30",
      qtyOnHand: 220,
      costPaise: 7500,
    },
    {
      id: "batch-04",
      productId: "eb-prod-004",
      productName: "EBL Cilalong 20 mg Cilnidipine Tablets IP (3 x 10 Tablets)",
      batchNo: "EB-CL20A",
      expiryDate: "2028-08-31",
      qtyOnHand: 140,
      costPaise: 18000,
    },
    {
      id: "batch-05",
      productId: "eb-prod-005",
      productName: "EBL Pantop-DSR Gastro Resistant Capsules (10 x 10 Capsules)",
      batchNo: "EB-PN26B",
      expiryDate: "2028-04-30",
      qtyOnHand: 190,
      costPaise: 9200,
    },
    {
      id: "batch-06",
      productId: "eb-prod-006",
      productName: "EBL VitaPlus Women Daily Multivitamin & Minerals (100 Tablets)",
      batchNo: "EB-VP26C",
      expiryDate: "2028-05-31",
      qtyOnHand: 130,
      costPaise: 24000,
    },
  ];

  private wholesalers: Wholesaler[] = [
    {
      id: "ws-01",
      name: "Guwahati Central Pharma Distributorship LLP",
      dlNumber: "AS-WZ-20B-2024/0912, 21B-2024/0913",
      gstin: "18AABCG1234F1Z8",
      contactPerson: "Dr. B. K. Sarma",
      phone: "+91 98540 11223",
      email: "orders@guwahatipharma.in",
      address: "GS Road, Near Supermarket Complex, Dispur",
      city: "Guwahati",
      state: "Assam",
      stateCode: "18",
      pincode: "781006",
      creditDays: 30,
      status: "ACTIVE",
      channelType: "Wholesalers",
      notes: "Distributes to 120+ retail medical stores across Lower Assam and Meghalaya.",
      createdAt: "2026-04-10",
    },
    {
      id: "ws-02",
      name: "Tripura Regional Hospital Stockists & Co",
      dlNumber: "TR-AGT-20B-2025/0441, 21B-2025/0442",
      gstin: "16AABCT9876C1Z2",
      contactPerson: "Pranab Roy Chowdhury",
      phone: "+91 94361 77221",
      email: "stockist@tripuramed.com",
      address: "Hospital Road, Opposite GB Pant Hospital",
      city: "Agartala",
      state: "Tripura",
      stateCode: "16",
      pincode: "799006",
      creditDays: 45,
      status: "ACTIVE",
      channelType: "Hospitals",
      notes: "Direct procurement vendor for polyclinics, nursing homes and district hospitals.",
      createdAt: "2026-04-15",
    },
    {
      id: "ws-03",
      name: "Shillong Hills Medical & Surgical Agencies",
      dlNumber: "ML-SH-20B-2023/0781, 21B-2023/0782",
      gstin: "17AABCS5544B1Z1",
      contactPerson: "David Lyngdoh",
      phone: "+91 98625 33445",
      email: "procurement@shillongmed.org",
      address: "Police Bazar Commercial Complex",
      city: "Shillong",
      state: "Meghalaya",
      stateCode: "17",
      pincode: "793001",
      creditDays: 21,
      status: "ACTIVE",
      channelType: "Retail Pharmacies",
      notes: "Specialized distributor for retail pharmacy chains and chemists.",
      createdAt: "2026-05-05",
    },
    {
      id: "ws-04",
      name: "Barak Valley Medicos & Polyclinic Supplies",
      dlNumber: "AS-SZ-20B-2024/0552, 21B-2024/0553",
      gstin: "18AABCB9012K1Z5",
      contactPerson: "Dr. Abhijit Sen",
      phone: "+91 94350 44556",
      email: "orders@barakmedicos.in",
      address: "Central Road, Silchar",
      city: "Silchar",
      state: "Assam",
      stateCode: "18",
      pincode: "788001",
      creditDays: 30,
      status: "ACTIVE",
      channelType: "Physicians",
      notes: "Direct supplier to physician chambers, clinics, and family health practices.",
      createdAt: "2026-05-20",
    },
    {
      id: "ws-05",
      name: "North East Care Clinics Consortium",
      dlNumber: "TR-UDA-20B-2025/0118, 21B-2025/0119",
      gstin: "16AABCN4433E1Z9",
      contactPerson: "Subrata Das",
      phone: "+91 98620 66778",
      email: "procurement@necareclinics.org",
      address: "Old Central Jail Road, Agartala",
      city: "Agartala",
      state: "Tripura",
      stateCode: "16",
      pincode: "799001",
      creditDays: 30,
      status: "ACTIVE",
      channelType: "Clinics",
      notes: "Consortium of private polyclinics and diagnostic treatment centers.",
      createdAt: "2026-06-12",
    },
  ];

  private wholesaleOrders: WholesaleOrder[] = [];
  private expenses: Expense[] = [];
  private leads: Lead[] = [];
  private auditLogs: { action: string; entity: string; by: string; at: string }[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initFirebaseSync();
    }
  }

  // --- Products CRUD ---
  getProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    const cleanSlug = slug.toLowerCase().trim();
    const exact = this.products.find((p) => p.slug === cleanSlug);
    if (exact) return exact;

    const strippedSearch = cleanSlug.replace(/^(eastern|ebl)-/, "");
    const match = this.products.find((p) => {
      const strippedP = p.slug.replace(/^(eastern|ebl)-/, "");
      return strippedP === strippedSearch || p.slug.includes(strippedSearch) || cleanSlug.includes(strippedP);
    });
    if (match) return match;

    if (cleanSlug.includes("raft") || cleanSlug.includes("antacid") || cleanSlug.includes("suspension")) {
      return this.products.find((p) => p.slug.includes("raft") || p.id === "eb-prod-001");
    }
    if (cleanSlug.includes("cilalong-10") || (cleanSlug.includes("cilalong") && !cleanSlug.includes("5") && !cleanSlug.includes("20"))) {
      return this.products.find((p) => p.slug.includes("cilalong-10") || p.id === "eb-prod-002");
    }
    if (cleanSlug.includes("cilalong-5") || cleanSlug.includes("5mg")) {
      return this.products.find((p) => p.slug.includes("cilalong-5") || p.id === "eb-prod-003");
    }
    if (cleanSlug.includes("cilalong-20") || cleanSlug.includes("20mg")) {
      return this.products.find((p) => p.slug.includes("cilalong-20") || p.id === "eb-prod-004");
    }
    if (cleanSlug.includes("pantop") || cleanSlug.includes("dsr")) {
      return this.products.find((p) => p.slug.includes("pantop") || p.id === "eb-prod-005");
    }
    if (cleanSlug.includes("vitaplus") || cleanSlug.includes("women") || cleanSlug.includes("multivitamin")) {
      return this.products.find((p) => p.slug.includes("vitaplus") || p.id === "eb-prod-006");
    }
    if (cleanSlug.includes("feather") || cleanSlug.includes("ultrathin") || cleanSlug.includes("condom") || cleanSlug.includes("003")) {
      return this.products.find((p) => p.slug.includes("feather") || p.id === "eb-prod-009");
    }

    return undefined;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const id = `eb-prod-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.products.unshift(newProduct);
    this.save();
    this.logAudit("CREATE_PRODUCT", newProduct.name);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (typeof updates.reorderLevel === "number" || typeof updates.stockAvailable === "number") {
      this.products[idx].isLowStock = this.products[idx].stockAvailable <= this.products[idx].reorderLevel;
    }
    this.save();
    setDoc(doc(firestore, "products", id), this.products[idx], { merge: true }).catch(() => {});
    this.logAudit("UPDATE_PRODUCT", this.products[idx].name);
    return this.products[idx];
  }

  updateStockAlertCriteria(productId: string, reorderLevel: number, maxLevel?: number): Product | null {
    const prod = this.getProductById(productId);
    if (!prod) return null;
    prod.reorderLevel = Math.max(0, reorderLevel);
    if (typeof maxLevel === "number") {
      prod.maxLevel = Math.max(prod.reorderLevel, maxLevel);
    }
    prod.isLowStock = prod.stockAvailable <= prod.reorderLevel;
    prod.updatedAt = new Date().toISOString();
    this.save();
    this.logAudit("UPDATE_STOCK_CRITERIA", `${prod.name} (Alert limit: ${prod.reorderLevel} units)`);
    return prod;
  }

  setGlobalStockAlertThreshold(threshold: number): void {
    const valid = Math.max(0, threshold);
    this.products.forEach((prod) => {
      prod.reorderLevel = valid;
      prod.isLowStock = prod.stockAvailable <= valid;
      prod.updatedAt = new Date().toISOString();
    });
    this.save();
    this.logAudit("GLOBAL_STOCK_CRITERIA", `Set all products alert threshold to ${valid} units`);
  }

  getLowStockProducts(): Product[] {
    return this.products.filter((p) => p.stockAvailable <= (p.reorderLevel ?? 25));
  }

  deleteProduct(id: string): boolean {
    this.registerDeletion(id);
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    this.save();
    deleteDoc(doc(firestore, "products", id)).catch(() => {});
    this.logAudit("DELETE_PRODUCT", id);
    return this.products.length < initialLen;
  }

  // --- Categories CRUD ---
  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Category): Category {
    this.categories.push(category);
    this.save();
    this.logAudit("ADD_CATEGORY", category.name);
    return category;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.save();
    this.logAudit("UPDATE_CATEGORY", this.categories[idx].name);
    return this.categories[idx];
  }

  deleteCategory(id: string): boolean {
    this.registerDeletion(id);
    const initialLen = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== id);
    this.save();
    this.logAudit("DELETE_CATEGORY", id);
    return this.categories.length < initialLen;
  }

  // --- Orders CRUD ---
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderByNumber(orderNo: string): Order | undefined {
    const cleanNo = orderNo.trim().toUpperCase();
    return this.orders.find((o) => o.orderNo.toUpperCase() === cleanNo);
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  placeOrder(input: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: "COD" | "MANUAL_UPI" | "MANUAL_BANK";
    items: { productId: string; qty: number }[];
    paymentProofUtr?: string;
  }): { success: boolean; order?: Order; message?: string } {
    const orderItems: OrderItem[] = [];
    const gstLines: (import("./gst").GstLineInput & { hsnCode?: string })[] = [];

    for (const item of input.items) {
      const prod = this.getProductById(item.productId);
      if (!prod) return { success: false, message: `Product ${item.productId} not found.` };
      if (prod.stockAvailable < item.qty) {
        return { success: false, message: `Not enough stock for ${prod.name}. Available: ${prod.stockAvailable}` };
      }

      gstLines.push({
        unitPricePaise: prod.pricePaise,
        qty: item.qty,
        gstRate: prod.gstRate,
        hsnCode: prod.hsnCode,
      });

      orderItems.push({
        productId: prod.id,
        nameSnapshot: prod.name,
        skuSnapshot: prod.sku,
        hsn: prod.hsnCode,
        qty: item.qty,
        unitPricePaise: prod.pricePaise,
        mrpPaise: prod.mrpPaise,
        gstRate: prod.gstRate,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        lineTotal: prod.pricePaise * item.qty,
        image: prod.images[0]?.url || "",
      });
    }

    const calc = calculateGst(
      gstLines,
      COMPANY_INFO.defaultHomeStateCode,
      input.shippingAddress.stateCode || "16"
    );

    calc.lines.forEach((lineTax, idx) => {
      orderItems[idx].taxableValue = lineTax.taxableValue;
      orderItems[idx].cgst = lineTax.cgst;
      orderItems[idx].sgst = lineTax.sgst;
      orderItems[idx].igst = lineTax.igst;
      orderItems[idx].lineTotal = lineTax.lineTotal;
    });

    for (const item of input.items) {
      const prod = this.getProductById(item.productId)!;
      const newStock = Math.max(0, prod.stockAvailable - item.qty);
      this.updateProduct(prod.id, {
        stockAvailable: newStock,
        isLowStock: newStock <= prod.reorderLevel,
      });
    }

    const orderSeq = 100246 + this.orders.length;
    const orderNo = `EB-${orderSeq}`;
    const invoiceSeq = (this.orders.length + 1).toString().padStart(4, "0");
    const invoiceNo = `EBPL/26-27/${invoiceSeq}`;
    const now = new Date().toISOString();

    const order: Order = {
      id: `ord-${orderSeq}`,
      orderNo,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      status: input.paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT",
      paymentStatus: input.paymentMethod === "COD" ? "PENDING" : (input.paymentProofUtr ? "PENDING" : "PENDING"),
      paymentMethod: input.paymentMethod,
      shippingAddress: input.shippingAddress,
      billingAddress: input.shippingAddress,
      placeOfSupplyStateCode: input.shippingAddress.stateCode || "16",
      items: orderItems,
      subtotal: calc.subtotal,
      discountTotal: 0,
      shippingFee: 0,
      taxTotal: calc.taxTotal,
      grandTotal: calc.grandTotal,
      statusHistory: [
        {
          status: input.paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT",
          note: input.paymentMethod === "COD" ? "Order confirmed via Cash on Delivery" : "Order placed, awaiting manual payment verification",
          by: "Customer",
          at: now,
        },
      ],
      invoiceNo,
      paymentProof: input.paymentProofUtr ? { utr: input.paymentProofUtr } : undefined,
      placedAt: now,
      dateKey: now.slice(0, 10),
    };

    this.orders.unshift(order);
    this.save();
    this.logAudit("ORDER_PLACED", order.orderNo);
    return { success: true, order };
  }

  updateOrderStatus(
    orderId: string,
    status: Order["status"],
    note: string,
    shipmentDetails?: { courier: string; awb: string; trackingUrl: string }
  ): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;

    order.status = status;
    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      order.paymentStatus = "PAID";
    }
    if (shipmentDetails) {
      order.shipment = {
        ...shipmentDetails,
        shippedAt: new Date().toISOString(),
      };
    }
    order.statusHistory.unshift({
      status,
      note,
      by: "Admin",
      at: new Date().toISOString(),
    });
    this.save();
    setDoc(doc(firestore, "orders", orderId), order, { merge: true }).catch(() => {});
    this.logAudit("UPDATE_ORDER_STATUS", `${order.orderNo} -> ${status}`);
    return true;
  }

  markPaymentPaid(orderId: string): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.paymentStatus = "PAID";
    if (order.status === "PENDING_PAYMENT") {
      order.status = "CONFIRMED";
    }
    order.statusHistory.unshift({
      status: order.status,
      note: "Payment verified and recorded as PAID",
      by: "Admin (Accountant)",
      at: new Date().toISOString(),
    });
    this.save();
    this.logAudit("PAYMENT_VERIFIED", order.orderNo);
    return true;
  }

  deleteOrder(orderId: string): boolean {
    this.registerDeletion(orderId);
    const initialLen = this.orders.length;
    this.orders = this.orders.filter((o) => o.id !== orderId);
    this.save();
    this.logAudit("DELETE_ORDER", orderId);
    return this.orders.length < initialLen;
  }

  // --- Reviews CRUD ---
  getReviews(productId?: string): Review[] {
    if (productId) {
      return this.reviews.filter((r) => r.productId === productId);
    }
    return this.reviews;
  }

  addReview(review: Omit<Review, "id" | "createdAt" | "verifiedBuyer">): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      verifiedBuyer: true,
      createdAt: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
    };
    this.reviews.unshift(newReview);
    this.save();
    this.logAudit("ADD_REVIEW", newReview.id);
    return newReview;
  }

  updateReview(reviewId: string, updates: Partial<Review>): Review | null {
    const idx = this.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return null;
    this.reviews[idx] = { ...this.reviews[idx], ...updates };
    this.save();
    this.logAudit("UPDATE_REVIEW", reviewId);
    return this.reviews[idx];
  }

  deleteReview(reviewId: string): boolean {
    this.registerDeletion(reviewId);
    const prevLen = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
    this.save();
    this.logAudit("DELETE_REVIEW", reviewId);
    return this.reviews.length < prevLen;
  }

  // --- Store Visuals & Banners CRUD ---
  getStoreVisuals() {
    return this.storeVisuals;
  }

  updateStoreVisuals(updates: Partial<typeof STORE_VISUALS>) {
    this.storeVisuals = sanitizeStoreVisuals({
      ...this.storeVisuals,
      ...updates,
    });
    this.save();
    this.logAudit("UPDATE_STORE_VISUALS", "Visuals updated via admin panel");
    return this.storeVisuals;
  }

  // --- Blogs CRUD ---
  getBlogs(): BlogPost[] {
    return this.blogs;
  }

  getBlogById(id: string): BlogPost | undefined {
    return this.blogs.find((b) => b.id === id);
  }

  getBlogBySlug(slug: string): BlogPost | undefined {
    return this.blogs.find((b) => b.slug === slug);
  }

  addBlog(blog: Omit<BlogPost, "id" | "publishedAt">): BlogPost {
    const id = `blog-${Date.now().toString().slice(-4)}`;
    const newBlog: BlogPost = {
      ...blog,
      id,
      publishedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    this.blogs.unshift(newBlog);
    this.save();
    setDoc(doc(firestore, "blogs", newBlog.id), newBlog, { merge: true }).catch(() => {});
    this.logAudit("ADD_BLOG", newBlog.title);
    return newBlog;
  }

  updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.blogs[idx] = { ...this.blogs[idx], ...updates };
    this.save();
    this.logAudit("UPDATE_BLOG", this.blogs[idx].title);
    return this.blogs[idx];
  }

  deleteBlog(id: string): boolean {
    this.registerDeletion(id);
    const prevLen = this.blogs.length;
    this.blogs = this.blogs.filter((b) => b.id !== id);
    this.save();
    deleteDoc(doc(firestore, "blogs", id)).catch(() => {});
    this.logAudit("DELETE_BLOG", id);
    return this.blogs.length < prevLen;
  }

  // --- Wholesalers & Distributors CRUD ---
  getWholesalers(): Wholesaler[] {
    return this.wholesalers;
  }

  getWholesalerById(id: string): Wholesaler | undefined {
    return this.wholesalers.find((w) => w.id === id);
  }

  addWholesaler(wholesaler: Omit<Wholesaler, "id" | "createdAt">): Wholesaler {
    const id = `ws-${Date.now().toString().slice(-4)}`;
    const newWs: Wholesaler = {
      ...wholesaler,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.wholesalers.unshift(newWs);
    this.save();
    this.logAudit("ADD_WHOLESALER", newWs.name);
    return newWs;
  }

  updateWholesaler(id: string, updates: Partial<Wholesaler>): Wholesaler | null {
    const idx = this.wholesalers.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    this.wholesalers[idx] = { ...this.wholesalers[idx], ...updates };
    this.save();
    this.logAudit("UPDATE_WHOLESALER", this.wholesalers[idx].name);
    return this.wholesalers[idx];
  }

  deleteWholesaler(id: string): boolean {
    this.registerDeletion(id);
    const initialLen = this.wholesalers.length;
    this.wholesalers = this.wholesalers.filter((w) => w.id !== id);
    this.save();
    deleteDoc(doc(firestore, "wholesalers", id)).catch(() => {});
    this.logAudit("DELETE_WHOLESALER", id);
    return this.wholesalers.length < initialLen;
  }

  // --- Wholesale Orders & Consignments CRUD ---
  getWholesaleOrders(): WholesaleOrder[] {
    return this.wholesaleOrders;
  }

  getWholesaleOrderById(id: string): WholesaleOrder | undefined {
    return this.wholesaleOrders.find((o) => o.id === id);
  }

  createWholesaleOrder(order: Omit<WholesaleOrder, "id" | "invoiceNo" | "createdAt">): WholesaleOrder {
    const seq = (this.wholesaleOrders.length + 40).toString().padStart(4, "0");
    const invoiceNo = `EBPL/B2B/26-27/${seq}`;
    const id = `wo-${Date.now().toString().slice(-4)}`;
    const newOrder: WholesaleOrder = {
      ...order,
      id,
      invoiceNo,
      createdAt: new Date().toISOString(),
    };
    this.wholesaleOrders.unshift(newOrder);

    // Deduct stock from allocated inventory batches
    for (const item of newOrder.items) {
      if (item.batchNo) {
        const batch = this.batches.find((b) => b.batchNo === item.batchNo && b.productId === item.productId);
        if (batch) {
          this.adjustBatchStock(batch.id, -item.qty);
        }
      }
    }

    this.save();
    this.logAudit("CREATE_WHOLESALE_ORDER", `${newOrder.invoiceNo} - ${newOrder.wholesalerName}`);
    return newOrder;
  }

  updateWholesaleOrderStatus(id: string, status: WholesaleOrder["status"], paymentStatus?: WholesaleOrder["paymentStatus"]): boolean {
    const o = this.wholesaleOrders.find((x) => x.id === id);
    if (!o) return false;
    o.status = status;
    if (paymentStatus) {
      o.paymentStatus = paymentStatus;
    }
    this.save();
    this.logAudit("UPDATE_WHOLESALE_ORDER_STATUS", `${o.invoiceNo} -> ${status}`);
    return true;
  }

  deleteWholesaleOrder(id: string): boolean {
    this.registerDeletion(id);
    const initialLen = this.wholesaleOrders.length;
    this.wholesaleOrders = this.wholesaleOrders.filter((x) => x.id !== id);
    this.save();
    this.logAudit("DELETE_WHOLESALE_ORDER", id);
    return this.wholesaleOrders.length < initialLen;
  }

  // --- Unified Financial & Sales Metrics (Consolidated across Admin) ---
  getRetailGrossRevenue(): number {
    return this.orders.reduce((sum, o) => sum + o.grandTotal, 0);
  }

  getRetailNetRevenue(): number {
    return this.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.grandTotal, 0);
  }

  getRetailCancelledRevenue(): number {
    return this.orders
      .filter((o) => o.status === "CANCELLED")
      .reduce((sum, o) => sum + o.grandTotal, 0);
  }

  getWholesaleGrossRevenue(): number {
    return this.wholesaleOrders.reduce((sum, o) => sum + o.grandTotalPaise, 0);
  }

  getWholesaleNetRevenue(): number {
    return this.wholesaleOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.grandTotalPaise, 0);
  }

  getWholesaleCancelledRevenue(): number {
    return this.wholesaleOrders
      .filter((o) => o.status === "CANCELLED")
      .reduce((sum, o) => sum + o.grandTotalPaise, 0);
  }

  getWholesaleTotalRevenue(excludeCancelled = true): number {
    return this.wholesaleOrders
      .filter((o) => !excludeCancelled || o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.grandTotalPaise, 0);
  }

  getWholesaleTotalProfit(excludeCancelled = true): number {
    return this.wholesaleOrders
      .filter((o) => !excludeCancelled || o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (o.totalProfitPaise || 0), 0);
  }

  getCombinedGrossTurnover(): number {
    return this.getRetailGrossRevenue() + this.getWholesaleGrossRevenue();
  }

  getCombinedNetTurnover(): number {
    return this.getRetailNetRevenue() + this.getWholesaleNetRevenue();
  }

  getCombinedNetOperatingProfit(): number {
    const retailMargin = Math.round(this.getRetailNetRevenue() * 0.4);
    const wsProfit = this.getWholesaleTotalProfit(true);
    const expenses = this.expenses.reduce((sum, e) => sum + e.amountPaise, 0);
    return retailMargin + wsProfit - expenses;
  }

  // --- Careers & Jobs CRUD ---
  getJobs(): JobPosting[] {
    return this.jobs;
  }

  getActiveJobs(): JobPosting[] {
    return this.jobs.filter((j) => j.status === "OPEN");
  }

  getJobBySlug(slug: string): JobPosting | undefined {
    return this.jobs.find((j) => j.slug === slug);
  }

  getJobById(id: string): JobPosting | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  createJob(job: Omit<JobPosting, "id" | "postedAt">): JobPosting {
    const id = `job-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} ${now.getFullYear()}`;
    const newJob: JobPosting = {
      ...job,
      id,
      postedAt: formattedDate,
    };
    this.jobs.unshift(newJob);
    this.save();
    setDoc(doc(firestore, "jobs", id), newJob, { merge: true }).catch(() => {});
    this.logAudit("CREATE_JOB", newJob.title);
    return newJob;
  }

  updateJob(id: string, updates: Partial<JobPosting>): JobPosting | null {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    this.save();
    setDoc(doc(firestore, "jobs", id), this.jobs[idx], { merge: true }).catch(() => {});
    this.logAudit("UPDATE_JOB", this.jobs[idx].title);
    return this.jobs[idx];
  }

  toggleHideJob(id: string): JobPosting | null {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return null;
    job.status = job.status === "OPEN" ? "HIDDEN" : "OPEN";
    this.save();
    setDoc(doc(firestore, "jobs", id), job, { merge: true }).catch(() => {});
    this.logAudit("TOGGLE_JOB_STATUS", `${job.title} -> ${job.status}`);
    return job;
  }

  deleteJob(id: string): boolean {
    this.registerDeletion(id);
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    this.save();
    deleteDoc(doc(firestore, "jobs", id)).catch(() => {});
    this.logAudit("DELETE_JOB", id);
    return this.jobs.length < initialLen;
  }

  getApplications(): JobApplication[] {
    // Return applications sorted from new to old (most recent top to bottom)
    return [...this.applications].sort((a, b) => {
      const timeA = new Date(a.appliedAt).getTime() || 0;
      const timeB = new Date(b.appliedAt).getTime() || 0;
      return timeB - timeA;
    });
  }

  submitApplication(data: Omit<JobApplication, "id" | "appliedAt" | "status">): JobApplication {
    const application: JobApplication = {
      ...data,
      id: `app-${Date.now().toString().slice(-4)}`,
      status: "NEW",
      appliedAt: new Date().toISOString(),
    };
    this.applications.unshift(application);
    this.save();
    setDoc(doc(firestore, "jobApplications", application.id), application, { merge: true }).catch(() => {});
    this.logAudit("JOB_APPLICATION", `${data.name} for ${data.jobTitle}`);
    return application;
  }

  updateApplicationStatus(id: string, status: JobApplication["status"]): boolean {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return false;
    app.status = status;
    this.save();
    setDoc(doc(firestore, "jobApplications", id), app, { merge: true }).catch(() => {});
    this.logAudit("UPDATE_APPLICATION_STATUS", `${id} -> ${status}`);
    return true;
  }

  recordHrContact(id: string, notes?: string): boolean {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return false;
    app.hrContacted = true;
    app.hrContactedAt = new Date().toISOString();
    if (notes) {
      app.notes = (app.notes ? app.notes + "\n" : "") + `[HR Note ${new Date().toLocaleDateString()}]: ${notes}`;
    }
    this.save();
    setDoc(doc(firestore, "jobApplications", id), app, { merge: true }).catch(() => {});
    this.logAudit("HR_CONTACT", `${app.name} (${app.jobTitle})`);
    return true;
  }

  deleteApplication(id: string): boolean {
    this.registerDeletion(id);
    const prevLen = this.applications.length;
    this.applications = this.applications.filter((a) => a.id !== id);
    this.save();
    deleteDoc(doc(firestore, "jobApplications", id)).catch(() => {});
    this.logAudit("DELETE_APPLICATION", id);
    return this.applications.length < prevLen;
  }

  // --- Inventory & Batches CRUD ---
  getBatches(): InventoryBatch[] {
    return this.batches;
  }

  addBatch(batch: Omit<InventoryBatch, "id">): InventoryBatch {
    const newBatch: InventoryBatch = {
      ...batch,
      id: `batch-${Date.now().toString().slice(-4)}`,
    };
    this.batches.unshift(newBatch);

    const prod = this.getProductById(newBatch.productId);
    if (prod) {
      const allProdBatches = this.batches.filter((x) => x.productId === prod.id);
      const totalStock = allProdBatches.reduce((acc, curr) => acc + curr.qtyOnHand, 0);
      this.updateProduct(prod.id, {
        stockAvailable: totalStock,
        isLowStock: totalStock <= prod.reorderLevel,
      });
    }

    this.save();
    this.logAudit("ADD_BATCH", `${newBatch.batchNo} for ${newBatch.productName}`);
    return newBatch;
  }

  updateBatch(id: string, updates: Partial<InventoryBatch>): InventoryBatch | null {
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.batches[idx] = { ...this.batches[idx], ...updates };

    const prod = this.getProductById(this.batches[idx].productId);
    if (prod) {
      const allProdBatches = this.batches.filter((x) => x.productId === prod.id);
      const totalStock = allProdBatches.reduce((acc, curr) => acc + curr.qtyOnHand, 0);
      this.updateProduct(prod.id, {
        stockAvailable: totalStock,
        isLowStock: totalStock <= prod.reorderLevel,
      });
    }

    this.save();
    this.logAudit("UPDATE_BATCH", this.batches[idx].batchNo);
    return this.batches[idx];
  }

  adjustBatchStock(batchId: string, adjustment: number): boolean {
    const b = this.batches.find((item) => item.id === batchId);
    if (!b) return false;
    b.qtyOnHand = Math.max(0, b.qtyOnHand + adjustment);

    const prod = this.getProductById(b.productId);
    if (prod) {
      const allProdBatches = this.batches.filter((x) => x.productId === prod.id);
      const totalStock = allProdBatches.reduce((acc, curr) => acc + curr.qtyOnHand, 0);
      this.updateProduct(prod.id, {
        stockAvailable: totalStock,
        isLowStock: totalStock <= prod.reorderLevel,
      });
    }
    this.save();
    this.logAudit("ADJUST_BATCH_STOCK", `${b.batchNo} (${adjustment > 0 ? "+" : ""}${adjustment})`);
    return true;
  }

  deleteBatch(batchId: string): boolean {
    this.registerDeletion(batchId);
    const b = this.batches.find((item) => item.id === batchId);
    if (!b) return false;
    const prodId = b.productId;
    this.batches = this.batches.filter((item) => item.id !== batchId);

    const prod = this.getProductById(prodId);
    if (prod) {
      const allProdBatches = this.batches.filter((x) => x.productId === prod.id);
      const totalStock = allProdBatches.reduce((acc, curr) => acc + curr.qtyOnHand, 0);
      this.updateProduct(prod.id, {
        stockAvailable: totalStock,
        isLowStock: totalStock <= prod.reorderLevel,
      });
    }

    this.save();
    deleteDoc(doc(firestore, "batches", batchId)).catch(() => {});
    this.logAudit("DELETE_BATCH", batchId);
    return true;
  }

  // --- Expenses CRUD ---
  getExpenses(): Expense[] {
    return this.expenses;
  }

  addExpense(exp: Omit<Expense, "id">): Expense {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    this.expenses.unshift(newExp);
    this.save();
    setDoc(doc(firestore, "expenses", newExp.id), newExp, { merge: true }).catch(() => {});
    this.logAudit("ADD_EXPENSE", newExp.title);
    return newExp;
  }

  deleteExpense(id: string): boolean {
    this.registerDeletion(id);
    const prevLen = this.expenses.length;
    this.expenses = this.expenses.filter((e) => e.id !== id);
    this.save();
    deleteDoc(doc(firestore, "expenses", id)).catch(() => {});
    this.logAudit("DELETE_EXPENSE", id);
    return this.expenses.length < prevLen;
  }

  // --- CRM & Leads CRUD ---
  getLeads(): Lead[] {
    return this.leads;
  }

  addLead(lead: Omit<Lead, "id" | "createdAt" | "status">): Lead {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.leads.unshift(newLead);
    this.save();
    this.logAudit("ADD_LEAD", newLead.name);
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead["status"]): boolean {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return false;
    lead.status = status;
    this.save();
    this.logAudit("UPDATE_LEAD_STATUS", `${lead.name} -> ${status}`);
    return true;
  }

  deleteLead(id: string): boolean {
    this.registerDeletion(id);
    const prevLen = this.leads.length;
    this.leads = this.leads.filter((l) => l.id !== id);
    this.save();
    deleteDoc(doc(firestore, "leads", id)).catch(() => {});
    this.logAudit("DELETE_LEAD", id);
    return this.leads.length < prevLen;
  }

  // --- Audit Trail ---
  private logAudit(action: string, entity: string) {
    this.auditLogs.unshift({
      action,
      entity,
      by: "Admin / System",
      at: new Date().toISOString(),
    });
  }

  async syncCatalogToFirestore(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      let count = 0;
      for (const p of this.products) {
        await setDoc(doc(firestore, "products", p.id), p, { merge: true });
        count++;
      }
      for (const c of this.categories) {
        await setDoc(doc(firestore, "categories", c.id), c, { merge: true });
        count++;
      }
      for (const w of this.wholesalers) {
        await setDoc(doc(firestore, "wholesalers", w.id), w, { merge: true });
        count++;
      }
      for (const b of this.batches) {
        await setDoc(doc(firestore, "batches", b.id), b, { merge: true });
        count++;
      }
      for (const bl of this.blogs) {
        await setDoc(doc(firestore, "blogs", bl.id), bl, { merge: true });
        count++;
      }
      for (const o of this.orders) {
        await setDoc(doc(firestore, "orders", o.id), o, { merge: true });
        count++;
      }
      for (const wo of this.wholesaleOrders) {
        await setDoc(doc(firestore, "wholesaleOrders", wo.id), wo, { merge: true });
        count++;
      }
      await setDoc(
        doc(firestore, "system", "storeData"),
        {
          productsCount: this.products.length,
          categoriesCount: this.categories.length,
          wholesalersCount: this.wholesalers.length,
          batchesCount: this.batches.length,
          syncedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return { success: true, count };
    } catch (err: any) {
      console.error("Firestore sync error:", err);
      return { success: false, count: 0, error: err?.message || String(err) };
    }
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  // --- Company Profile & Shop Footer Settings ---
  getCompanySettings(): CompanySettings {
    return this.companySettings;
  }

  updateCompanySettings(updates: Partial<CompanySettings>): CompanySettings {
    this.companySettings = {
      ...this.companySettings,
      ...updates,
    };
    this.save();
    setDoc(doc(firestore, "system", "companySettings"), this.companySettings, { merge: true }).catch(() => {});
    this.logAudit("UPDATE_SETTINGS", "Updated company profile & shop footer contact details");
    return this.companySettings;
  }
}

// Singleton datastore instance (preserved across HMR in dev)
const globalForDataStore = globalThis as unknown as {
  dataStore: DataStore | undefined;
};

export const dataStore = globalForDataStore.dataStore ?? new DataStore();

if (process.env.NODE_ENV !== "production") {
  globalForDataStore.dataStore = dataStore;
}
