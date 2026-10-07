const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data-store.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add imports
if (!content.includes('import { database }')) {
  content = content.replace(
    'import { STORE_VISUALS } from "./store-visuals";',
    'import { STORE_VISUALS } from "./store-visuals";\nimport { database } from "./firebase-client";\nimport { ref, set, onValue } from "firebase/database";'
  );
}

// 2. Add listener array and notify/subscribe methods to DataStore
if (!content.includes('private listeners:')) {
  content = content.replace(
    'class DataStore {',
    `class DataStore {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private saveToFirebase() {
    if (typeof window === "undefined") return;
    set(ref(database, "storeData/products"), this.products).catch(console.error);
    set(ref(database, "storeData/reviews"), this.reviews).catch(console.error);
    set(ref(database, "storeData/orders"), this.orders).catch(console.error);
    set(ref(database, "storeData/storeVisuals"), this.storeVisuals).catch(console.error);
  }

  private initFirebaseSync() {
    if (typeof window === "undefined") return;
    try {
      onValue(ref(database, "storeData"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.products) this.products = data.products;
          if (data.reviews) this.reviews = data.reviews;
          if (data.orders) this.orders = data.orders;
          if (data.storeVisuals) this.storeVisuals = data.storeVisuals;
          this.notify();
        } else {
          // Seed initial data if Firebase is empty
          this.saveToFirebase();
        }
      });
    } catch (error) {
      console.error("Firebase sync error:", error);
    }
  }
`
  );
}

// 3. Call initFirebaseSync in constructor (need to create constructor if not exists)
if (!content.includes('constructor() {')) {
  content = content.replace(
    'private auditLogs:',
    'private auditLogs:\n\n  constructor() {\n    this.initFirebaseSync();\n  }'
  );
}

// 4. Update mutation methods to call saveToFirebase()
const mutations = [
  'this.products.unshift(newProduct);',
  'this.products[index] = { ...this.products[index], ...updates };',
  'this.products = this.products.filter((p) => p.id !== id);',
  'this.storeVisuals = visuals;',
  'this.reviews.unshift(newReview);',
  'this.reviews = this.reviews.filter((r) => r.id !== id);',
  'this.orders.unshift(newOrder);',
  'this.orders[index] = { ...this.orders[index], ...updates };',
];

mutations.forEach(mutation => {
  if (content.includes(mutation) && !content.includes(`${mutation}\n    this.saveToFirebase();`)) {
    content = content.split(mutation).join(`${mutation}\n    this.saveToFirebase();\n    this.notify();`);
  }
});

fs.writeFileSync(filePath, content);
console.log('Successfully refactored data-store.ts');
