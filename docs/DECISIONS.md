# DECISIONS.md — Eastern Biochemicals Private Limited

**Date:** 01 Oct 2026  
**Project:** Corporate Website + Dedicated Single-Vendor E-Commerce Store + Admin/ERP Panel  
**Specification:** `Eastern_Biochemicals_Build_Specification.md`

---

## 1. Architectural & Technical Decisions

1. **Framework & Layout Architecture:**
   - Single Next.js 15 (App Router) + TypeScript strict application with three distinct areas:
     - **Corporate Portal (`/`):** Deep blue/purple gradient branding, scientific typography, matching the Mankind Pharma reference layout.
     - **EPIC Store (`/shop`):** Crimson/cream aesthetic, separate sticky header (`Shop`, `Blogs`, `Track Order`, centered EPIC logo, Cart drawer, WhatsApp button), matching the Manforce Epic reference layout.
     - **Admin ERP Panel (`/admin`):** Dark slate sidebar dashboard covering all 15 operational modules.
   - The "Shop" button in the Corporate Header links directly to `/shop`, triggering the complete theme and layout switch.

2. **Database & Data Store:**
   - Integrated with Firebase Firestore & Auth using project `ebl-pharmaceutical`.
   - In-memory reactive data store (`lib/data-store.ts`) with atomic transactions for stock deduction, FEFO batch allocations, sequential order numbering (`EB-100246`), and statutory GST invoice generation (`EBPL/26-27/0001`).

3. **Cloudinary Media Integration:**
   - Cloud Name: `web8vmww`
   - API Key: `898349595447971`
   - API Secret: `IGju5tzebtnACCVN5HlShNnDwao`
   - Configured in `lib/cloudinary.ts` with folders for products, banners, blogs, and private CV documents.

4. **Payments:**
   - Cash on Delivery (COD) supported out of the box with instant confirmation and invoice allocation.
   - Manual Direct UPI / Bank Transfer supported with company bank details and customer UTR reference entry.
   - No online payment gateway in v1 per specification (clean `PaymentProvider` abstraction ready for future gateway plugins).

5. **GST Engine (`lib/gst.ts`):**
   - Configured with default home state Tripura (State Code: 16).
   - Dynamic CGST + SGST computation for intra-state orders; IGST for inter-state orders.
   - Generates compliant HSN summaries and sequential invoice numbering.

6. **UI/UX Reproduction:**
   - All 31 pages of the reference PDF have been mapped and implemented:
     - Collections grid with superscript product counts (PDF pages 1-3)
     - Blogs & guides with `#MakeItEpic`, featured cards, and red banner strip (PDF pages 4-6)
     - Track Order with order number and vertical status timeline (PDF page 7)
     - Login page with side-by-side Sign In and Create Account buttons (PDF page 8)
     - Product detail with 5-star customer review breakdown, photos, pincode check, and sticky mini add-to-cart bar (PDF pages 9-11, 13)
     - Testimonial banner with dark red rose background and Myra Kapoor quote (PDF page 12)
     - Store Home hero slider, Desire Zone circles, trending products, and Switch to Thin X comparison banner (PDF pages 14-19)
     - Corporate home hero, intro statement, R&D stats, innovating for the world, promise cards, business verticals, sustainability spotlight, ESG banner, careers CTA, and earnings audio strip (PDF pages 20-31).
