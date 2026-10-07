import { Role, OrderStatus, PaymentStatus, PaymentMethod } from "./constants";

export type Paise = number;

export interface ProductImage {
  publicId: string;
  url: string;
  alt: string;
  sort: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brandName?: string;
  shortDesc: string;
  description: string;
  howToUse?: string;
  specs?: Record<string, string>;
  mrpPaise: Paise;
  pricePaise: Paise;
  gstRate: 0 | 5 | 12 | 18 | 28;
  hsnCode?: string;
  unit: string;
  weightG?: number;
  trackInventory: boolean;
  reorderLevel: number;
  maxLevel?: number;
  stockAvailable: number;
  isLowStock: boolean;
  requiresPrescription: boolean;
  ageRestricted18Plus: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  images: ProductImage[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  searchKeywords: string[];
  ratingAvg: number;
  ratingCount: number;
  seoTitle?: string;
  seoDesc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: { publicId: string; url: string };
  productCount: number;
  sort: number;
  isActive: boolean;
  description?: string;
}

export interface OrderItem {
  productId: string;
  nameSnapshot: string;
  skuSnapshot: string;
  hsn?: string;
  qty: number;
  unitPricePaise: Paise;
  mrpPaise: Paise;
  gstRate: number;
  taxableValue: Paise;
  cgst: Paise;
  sgst: Paise;
  igst: Paise;
  lineTotal: Paise;
  image?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  placeOfSupplyStateCode: string;
  items: OrderItem[];
  subtotal: Paise;
  discountTotal: Paise;
  shippingFee: Paise;
  taxTotal: Paise;
  grandTotal: Paise;
  couponCode?: string;
  statusHistory: {
    status: OrderStatus;
    note: string;
    by: string;
    at: string;
  }[];
  shipment?: {
    courier?: string;
    awb?: string;
    trackingUrl?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  invoiceId?: string;
  invoiceNo?: string;
  paymentProof?: {
    utr: string;
    screenshotUrl?: string;
  };
  placedAt: string;
  dateKey: string; // YYYY-MM-DD
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verifiedBuyer: boolean;
  createdAt: string;
  photos?: { publicId: string; url: string }[];
}

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  role?: string;
  department: string;
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  experienceRange: string;
  salaryRange?: string;
  educationalCriteria?: string;
  lastDateToApply?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: "OPEN" | "HIDDEN" | "CLOSED";
  postedAt: string;
  openingsCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  published?: boolean;
}

export interface InventoryBatch {
  id: string;
  productId: string;
  productName: string;
  batchNo: string;
  expiryDate: string;
  qtyOnHand: number;
  costPaise: Paise;
}

export interface Wholesaler {
  id: string;
  name: string;
  dlNumber: string; // Drug License Number (20B / 21B)
  gstin: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  creditDays: number;
  status: "ACTIVE" | "INACTIVE";
  channelType?: "Wholesalers" | "Hospitals" | "Retail Pharmacies" | "Physicians" | "Clinics" | "Direct";
  notes?: string;
  createdAt: string;
}

export interface WholesaleOrderItem {
  productId: string;
  productName: string;
  sku: string;
  hsnCode: string;
  batchNo: string;
  expiryDate: string;
  qty: number;
  mrpPaise: Paise;
  unitCostPaise: Paise; // Manufacturing cost
  wholesalePricePaise: Paise; // Discounted wholesale selling price
  gstRate: number;
  taxableAmountPaise: Paise;
  cgstPaise: Paise;
  sgstPaise: Paise;
  igstPaise: Paise;
  totalPaise: Paise;
  profitPaise: Paise; // (wholesalePricePaise - unitCostPaise) * qty
}

export interface WholesaleOrder {
  id: string;
  invoiceNo: string;
  wholesalerId: string;
  wholesalerName: string;
  wholesalerDlNumber: string;
  wholesalerGstin: string;
  wholesalerAddress: string;
  wholesalerState?: string;
  orderDate: string;
  dueDate: string;
  status: "CONFIRMED" | "DISPATCHED" | "DELIVERED" | "PAID" | "CANCELLED";
  paymentStatus: "PENDING" | "PARTIAL" | "PAID";
  items: WholesaleOrderItem[];
  subtotalPaise: Paise;
  taxTotalPaise: Paise;
  grandTotalPaise: Paise;
  totalCostPaise: Paise;
  totalProfitPaise: Paise; // Automated profit calculation
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amountPaise: Paise;
  paidOn: string;
  vendor: string;
  paymentMethod: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  education?: string;
  experienceYears: string;
  currentLocation?: string;
  coverNote?: string;
  resumeFileName?: string;
  status: "NEW" | "SCREENING" | "INTERVIEW" | "ACCEPTED" | "OFFERED" | "HIRED" | "REJECTED";
  appliedAt: string;
  notes?: string;
  hrContacted?: boolean;
  hrContactedAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST";
  notes: string;
  createdAt: string;
}

export interface CompanySettings {
  // Corporate Profile & Footer
  legalName: string;
  cin: string;
  registrationNo: string;
  registeredOffice: string;
  corporateOffice: string;
  contactPhone: string;
  contactEmail: string;
  officeHours: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;

  // Dedicated Shop Section Footer & Details
  shopPhone: string;
  shopWhatsapp: string;
  shopEmail: string;
  shopAddress: string;
  shopHours: string;
  shopDiscreetNotice: string;
  shopGstin: string;
  shopDrugLicense: string;
  shopCopyrightText: string;
}

