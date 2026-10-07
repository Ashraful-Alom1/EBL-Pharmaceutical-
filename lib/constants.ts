export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES: "SALES",
  INVENTORY: "INVENTORY",
  ACCOUNTANT: "ACCOUNTANT",
  HR: "HR",
  CONTENT: "CONTENT",
  CUSTOMER: "CUSTOMER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RTO: "RTO",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURNED: "RETURNED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIAL_REFUND: "PARTIAL_REFUND",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  COD: "COD",
  MANUAL_UPI: "MANUAL_UPI",
  MANUAL_BANK: "MANUAL_BANK",
  CASH: "CASH",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const COMPANY_INFO = {
  legalName: "EASTERN BIOCHEMICALS PRIVATE LIMITED",
  cin: "U47721TR2025PTC014575",
  registrationNo: "14575",
  incorporated: "27 May 2025",
  roc: "Guwahati",
  authorisedCapital: "₹10,00,000",
  paidUpCapital: "₹1,00,000",
  status: "Active · Unlisted",
  registeredOffice: "Villa 171, VGN Grandeur, Keshavardhini Nagar, Periya Kolathuvancheri, Iyyappanthangal, Chennai, Tamil Nadu – 600122",
  corporateOffice: "Villa 171, VGN Grandeur, Keshavardhini Nagar, Periya Kolathuvancheri, Iyyappanthangal, Chennai, Tamil Nadu – 600122",
  defaultHomeStateCode: "16", // Tripura
  contactEmail: "info@easternbiochemicals.com",
  contactPhone: "+91 91100 87654",
  whatsappNumber: "919110087654",
  gstin: "16AABCE1234F1Z5",
  pan: "AABCE1234F",
};

export const INITIAL_COMPANY_SETTINGS = {
  legalName: "EASTERN BIOCHEMICALS PRIVATE LIMITED",
  cin: "U47721TR2025PTC014575",
  registrationNo: "14575",
  registeredOffice: "Villa 171, VGN Grandeur, Keshavardhini Nagar, Periya Kolathuvancheri, Iyyappanthangal, Chennai, Tamil Nadu – 600122",
  corporateOffice: "Villa 171, VGN Grandeur, Keshavardhini Nagar, Periya Kolathuvancheri, Iyyappanthangal, Chennai, Tamil Nadu – 600122",
  contactPhone: "+91 91100 87654",
  contactEmail: "info@easternbiochemicals.com",
  officeHours: "Monday – Saturday: 9:30 AM – 6:30 PM",
  facebookUrl: "https://facebook.com",
  twitterUrl: "https://twitter.com",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",

  shopPhone: "+91 94361 22899",
  shopWhatsapp: "919436122899",
  shopEmail: "care@easternbiochemicals.com",
  shopAddress: "Eastern Biochemicals Central Fulfillment Hub, Tripura Industrial Growth Centre, Bodhjungnagar, Agartala, Tripura - 799008",
  shopHours: "Mon-Sat: 10:00 AM - 7:00 PM",
  shopDiscreetNotice: "100% Discreet Packaging with zero external brand label markings",
  shopGstin: "16AABCE1234F1Z5",
  shopDrugLicense: "TR-WZ-20B-2025/1102 & 21B-2025/1103",
  shopCopyrightText: "© 2026 Eastern Biochemicals Private Limited (EBL). All rights reserved.",
};

