const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');
const storeDir = path.join(__dirname, '..', 'public', 'images', 'store');

if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });

// 1. Generate EBL VitaPlus Women 3D scene (1200x900 full edge-to-edge coverage)
async function createVitaPlus3D() {
  const w = 1200;
  const h = 900;
  
  const finalBuf = await sharp(path.join(prodDir, 'ebl-vitaplus-women.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(prodDir, 'ebl-vitaplus-3d.jpg'), finalBuf);
  fs.writeFileSync(path.join(storeDir, 'ebl-vitaplus-3d.jpg'), finalBuf);
  console.log('Created edge-to-edge ebl-vitaplus-3d.jpg');
}

// 2. Generate EBL Pure Silk Intimate Lube 3D Scene
async function createLube3D() {
  const w = 1200;
  const h = 900;
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#ECFDF5" />
          <stop offset="45%" stop-color="#D1FAE5" />
          <stop offset="80%" stop-color="#A7F3D0" />
          <stop offset="100%" stop-color="#6EE7B7" />
        </radialGradient>
        <linearGradient id="bottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="20%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#F1F5F9" />
          <stop offset="80%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#CBD5E1" />
        </linearGradient>
        <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#047857" />
          <stop offset="50%" stop-color="#065F46" />
          <stop offset="100%" stop-color="#064E3B" />
        </linearGradient>
        <linearGradient id="silverCap" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94A3B8" />
          <stop offset="30%" stop-color="#F8FAFC" />
          <stop offset="70%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#64748B" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)" />
      
      <circle cx="220" cy="240" r="80" fill="white" opacity="0.2" filter="blur(20px)" />
      <circle cx="980" cy="320" r="100" fill="white" opacity="0.25" filter="blur(25px)" />
      
      <ellipse cx="600" cy="740" rx="240" ry="30" fill="rgba(6,78,59,0.25)" filter="blur(14px)" />
      
      <!-- Pump Nozzle -->
      <path d="M575,190 L625,190 L625,230 L575,230 Z" fill="url(#silverCap)" />
      <path d="M560,230 L640,230 L640,260 L560,260 Z" fill="url(#silverCap)" rx="4" />
      <path d="M510,190 L585,185 L585,210 L530,215 Z" fill="url(#silverCap)" rx="6" />
      
      <!-- Bottle Body -->
      <rect x="480" y="260" width="240" height="460" rx="40" fill="url(#bottleGlass)" stroke="#94A3B8" stroke-width="2" />
      <rect x="495" y="275" width="25" height="430" rx="12" fill="white" opacity="0.6" />
      
      <!-- Premium Green Label -->
      <rect x="510" y="340" width="180" height="320" rx="16" fill="url(#labelGrad)" />
      <rect x="520" y="350" width="160" height="300" rx="12" fill="none" stroke="#34D399" stroke-width="1.5" opacity="0.7" />
      
      <text x="600" y="385" text-anchor="middle" fill="#A7F3D0" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="3">EASTERN BIOCHEMICALS</text>
      <text x="600" y="420" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="900" letter-spacing="2">EBL CARE</text>
      
      <circle cx="600" cy="465" r="28" fill="rgba(255,255,255,0.12)" stroke="#34D399" stroke-width="1.5" />
      <path d="M600,450 C588,462 588,478 600,482 C612,478 612,462 600,450 Z" fill="#6EE7B7" />
      
      <text x="600" y="525" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="bold">PURE SILK</text>
      <text x="600" y="550" text-anchor="middle" fill="#A7F3D0" font-family="Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="1.5">INTIMATE LUBRICANT</text>
      <text x="600" y="580" text-anchor="middle" fill="#D1FAE5" font-family="Arial, sans-serif" font-size="11" font-weight="500">WATER BASED · HYDRATING</text>
      <text x="600" y="625" text-anchor="middle" fill="#6EE7B7" font-family="Arial, sans-serif" font-size="13" font-weight="bold">100 ml e</text>
    </svg>
  `);

  const buf = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(prodDir, 'ebl-lube-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-lube-3d.jpg'), buf);
  console.log('Created ebl-lube-3d.jpg');
}

// 3. Generate EBL Pulse Massager 3D Scene
async function createMassager3D() {
  const w = 1200;
  const h = 900;
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#2D0B2E" />
          <stop offset="50%" stop-color="#1A051B" />
          <stop offset="100%" stop-color="#0E020F" />
        </radialGradient>
        <radialGradient id="silicone" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#F472B6" />
          <stop offset="50%" stop-color="#DB2777" />
          <stop offset="100%" stop-color="#9D174D" />
        </radialGradient>
        <linearGradient id="neonRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="50%" stop-color="#C084FC" />
          <stop offset="100%" stop-color="#F43F5E" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)" />
      
      <circle cx="600" cy="430" r="260" fill="#EC4899" opacity="0.2" filter="blur(60px)" />
      <circle cx="600" cy="430" r="160" fill="#38BDF8" opacity="0.15" filter="blur(40px)" />
      
      <ellipse cx="600" cy="740" rx="280" ry="35" fill="black" opacity="0.6" filter="blur(16px)" />
      
      <!-- Standing Packaging Box (Left) -->
      <g transform="translate(300, 240) rotate(-6)">
        <rect x="0" y="0" width="260" height="440" rx="24" fill="#180824" stroke="url(#neonRing)" stroke-width="2.5" />
        <rect x="15" y="15" width="230" height="410" rx="16" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <text x="130" y="60" text-anchor="middle" fill="#C084FC" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="3">EASTERN BIOCHEMICALS</text>
        <text x="130" y="100" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="900" letter-spacing="2">EBL PULSE</text>
        <circle cx="130" cy="200" r="50" fill="none" stroke="#EC4899" stroke-width="3" stroke-dasharray="6,6" opacity="0.7" />
        <text x="130" y="290" text-anchor="middle" fill="#F472B6" font-family="Arial, sans-serif" font-size="16" font-weight="bold">VIBRATING RING</text>
        <text x="130" y="320" text-anchor="middle" fill="#94A3B8" font-family="Arial, sans-serif" font-size="12">BODY SAFE SILICONE</text>
        <text x="130" y="390" text-anchor="middle" fill="#38BDF8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">10 MODES · WATERPROOF</text>
      </g>
      
      <!-- 3D Silicone Device (Right) -->
      <g transform="translate(650, 270) rotate(8)">
        <circle cx="120" cy="180" r="110" fill="url(#silicone)" stroke="#FDA4AF" stroke-width="6" />
        <circle cx="120" cy="180" r="60" fill="#200824" stroke="#F43F5E" stroke-width="3" />
        <path d="M80,75 C95,50 145,50 160,75 C150,110 90,110 80,75 Z" fill="url(#silicone)" stroke="#FDA4AF" stroke-width="3" />
        <circle cx="120" cy="75" r="8" fill="#38BDF8" />
      </g>
    </svg>
  `);

  const buf = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(prodDir, 'ebl-massager-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-massager-3d.jpg'), buf);
  console.log('Created ebl-massager-3d.jpg');
}

// 4. Generate EBL Feather-Touch 0.03mm Ultra-Thin 3D Scene
async function createUltraThin3D() {
  const w = 1200;
  const h = 900;
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#F0FDFA" />
          <stop offset="50%" stop-color="#CCFBF1" />
          <stop offset="100%" stop-color="#99F6E4" />
        </radialGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="40%" stop-color="#F0FDFA" />
          <stop offset="70%" stop-color="#E0F2FE" />
          <stop offset="100%" stop-color="#CCFBF1" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)" />
      <circle cx="600" cy="450" r="320" fill="white" opacity="0.5" filter="blur(40px)" />
      
      <ellipse cx="600" cy="730" rx="320" ry="35" fill="rgba(13,148,136,0.22)" filter="blur(14px)" />
      
      <g transform="translate(440, 200)">
        <rect x="0" y="0" width="320" height="480" rx="28" fill="url(#boxGrad)" stroke="#5EEAD4" stroke-width="3" />
        <rect x="20" y="20" width="280" height="70" rx="16" fill="#0D9488" />
        <text x="160" y="46" text-anchor="middle" fill="#CCFBF1" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="3">EASTERN BIOCHEMICALS</text>
        <text x="160" y="72" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="900" letter-spacing="2">EBL CARE</text>
        
        <circle cx="160" cy="240" r="85" fill="white" stroke="#14B8A6" stroke-width="4" stroke-dasharray="8,6" />
        <text x="160" y="242" text-anchor="middle" fill="#0F766E" font-family="Arial, sans-serif" font-size="48" font-weight="900">0.03</text>
        <text x="160" y="270" text-anchor="middle" fill="#0D9488" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="2">MILLIMETER</text>
        
        <text x="160" y="370" text-anchor="middle" fill="#134E4A" font-family="Arial, sans-serif" font-size="20" font-weight="900" letter-spacing="1">FEATHER TOUCH</text>
        <text x="160" y="398" text-anchor="middle" fill="#0F766E" font-family="Arial, sans-serif" font-size="13" font-weight="bold">ULTRA THIN NATURAL FEEL</text>
        
        <rect x="25" y="425" width="270" height="35" rx="10" fill="#F0FDFA" stroke="#99F6E4" stroke-width="1.5" />
        <text x="160" y="447" text-anchor="middle" fill="#0F766E" font-family="Arial, sans-serif" font-size="11" font-weight="bold">HERMETIC BUTTERCUP SEAL · 10 PCS</text>
      </g>
    </svg>
  `);

  const buf = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(prodDir, 'ebl-ultrathin-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-ultrathin-3d.jpg'), buf);
  console.log('Created ebl-ultrathin-3d.jpg');
}

// 5. Generate EBL Climax Endurance & Delay 3D Scene
async function createEndurance3D() {
  const w = 1200;
  const h = 900;
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#FAF5FF" />
          <stop offset="50%" stop-color="#F3E8FF" />
          <stop offset="100%" stop-color="#E9D5FF" />
        </radialGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E1B4B" />
          <stop offset="50%" stop-color="#312E81" />
          <stop offset="100%" stop-color="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)" />
      <circle cx="600" cy="450" r="320" fill="#C084FC" opacity="0.2" filter="blur(50px)" />
      <ellipse cx="600" cy="730" rx="320" ry="35" fill="rgba(67,56,202,0.22)" filter="blur(14px)" />
      
      <g transform="translate(440, 200)">
        <rect x="0" y="0" width="320" height="480" rx="28" fill="url(#boxGrad)" stroke="#818CF8" stroke-width="3" />
        <text x="160" y="50" text-anchor="middle" fill="#A5B4FC" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="3">EASTERN BIOCHEMICALS</text>
        <text x="160" y="85" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="24" font-weight="900" letter-spacing="2">EBL ENDURANCE</text>
        
        <circle cx="160" cy="230" r="75" fill="rgba(255,255,255,0.08)" stroke="#FBBF24" stroke-width="3" />
        <path d="M160,175 L160,230 L195,230" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linecap="round" />
        <text x="160" y="325" text-anchor="middle" fill="#FCD34D" font-family="Arial, sans-serif" font-size="15" font-weight="bold" letter-spacing="2">CLIMAX DELAY</text>
        <text x="160" y="370" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="900">LONG LASTING</text>
        <text x="160" y="400" text-anchor="middle" fill="#C7D2FE" font-family="Arial, sans-serif" font-size="13">BENZOCAINE ACTIVE FORMULA</text>
        
        <rect x="25" y="425" width="270" height="35" rx="10" fill="rgba(255,255,255,0.1)" stroke="#818CF8" stroke-width="1" />
        <text x="160" y="447" text-anchor="middle" fill="#E0E7FF" font-family="Arial, sans-serif" font-size="11" font-weight="bold">DERMATOLOGICALLY TESTED · 10 PCS</text>
      </g>
    </svg>
  `);

  const buf = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(prodDir, 'ebl-endurance-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-endurance-3d.jpg'), buf);
  console.log('Created ebl-endurance-3d.jpg');
}

// 6. Generate EBL Matrix Dotted & Ribbed 3D Scene
async function createMatrix3D() {
  const w = 1200;
  const h = 900;
  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#FFFBEB" />
          <stop offset="50%" stop-color="#FEF3C7" />
          <stop offset="100%" stop-color="#FDE68A" />
        </radialGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350F" />
          <stop offset="50%" stop-color="#92400E" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)" />
      <circle cx="600" cy="450" r="320" fill="#FBBF24" opacity="0.2" filter="blur(50px)" />
      <ellipse cx="600" cy="730" rx="320" ry="35" fill="rgba(180,83,9,0.22)" filter="blur(14px)" />
      
      <g transform="translate(440, 200)">
        <rect x="0" y="0" width="320" height="480" rx="28" fill="url(#boxGrad)" stroke="#FCD34D" stroke-width="3" />
        <text x="160" y="50" text-anchor="middle" fill="#FDE68A" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="3">EASTERN BIOCHEMICALS</text>
        <text x="160" y="85" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="24" font-weight="900" letter-spacing="2">EBL MATRIX</text>
        
        <g fill="#FDE68A" transform="translate(85, 160)">
          <circle cx="15" cy="15" r="8" /><circle cx="55" cy="15" r="8" /><circle cx="95" cy="15" r="8" /><circle cx="135" cy="15" r="8" />
          <circle cx="15" cy="55" r="8" /><circle cx="55" cy="55" r="8" /><circle cx="95" cy="55" r="8" /><circle cx="135" cy="55" r="8" />
          <circle cx="15" cy="95" r="8" /><circle cx="55" cy="95" r="8" /><circle cx="95" cy="95" r="8" /><circle cx="135" cy="95" r="8" />
        </g>
        
        <text x="160" y="325" text-anchor="middle" fill="#FDE68A" font-family="Arial, sans-serif" font-size="15" font-weight="bold" letter-spacing="2">EXTRA DOTTED &amp; RIBBED</text>
        <text x="160" y="370" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="900">MAXIMUM TEXTURE</text>
        <text x="160" y="400" text-anchor="middle" fill="#FEF3C7" font-family="Arial, sans-serif" font-size="13">PYRAMID DOT MATRIX FORMULATION</text>
        
        <rect x="25" y="425" width="270" height="35" rx="10" fill="rgba(255,255,255,0.1)" stroke="#FCD34D" stroke-width="1" />
        <text x="160" y="447" text-anchor="middle" fill="#FEF3C7" font-family="Arial, sans-serif" font-size="11" font-weight="bold">CONTOURED FIT · 10 PCS</text>
      </g>
    </svg>
  `);

  const buf = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(prodDir, 'ebl-matrix-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-matrix-3d.jpg'), buf);
  console.log('Created ebl-matrix-3d.jpg');
}

// 7. Generate Master Showcase (All Formulations) 3D Scene - Full edge-to-edge coverage
async function createMasterShowcase3D() {
  const w = 1200;
  const h = 900;
  
  // Left side: EBL Raft (600x900 cover)
  const leftHalf = await sharp(path.join(prodDir, 'ebl-raft-3d.jpg'))
    .resize(600, 900, { fit: 'cover', position: 'center' })
    .toBuffer();
    
  // Right side: EBL Cilalong (600x900 cover)
  const rightHalf = await sharp(path.join(prodDir, 'ebl-cilalong-3d.jpg'))
    .resize(600, 900, { fit: 'cover', position: 'center' })
    .toBuffer();

  const dividerOverlay = Buffer.from(`
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="splitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E11D48" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#0A1B8F" stop-opacity="0.8" />
        </linearGradient>
      </defs>
      <!-- Vertical sleek divider line -->
      <line x1="600" y1="0" x2="600" y2="900" stroke="url(#splitGrad)" stroke-width="4" />
      <!-- Center Emblem Badge -->
      <g transform="translate(600, 450)">
        <circle cx="0" cy="0" r="54" fill="#0F172A" stroke="#FFFFFF" stroke-width="3" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))" />
        <text x="0" y="-8" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="11" font-weight="900" letter-spacing="2">EBL</text>
        <text x="0" y="12" text-anchor="middle" fill="#F43F5E" font-family="Arial, sans-serif" font-size="9" font-weight="bold" letter-spacing="1">CATALOG</text>
      </g>
    </svg>
  `);

  const buf = await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }
    }
  })
    .composite([
      { input: leftHalf, top: 0, left: 0 },
      { input: rightHalf, top: 0, left: 600 },
      { input: dividerOverlay, top: 0, left: 0 }
    ])
    .jpeg({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(prodDir, 'ebl-master-showcase-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-master-showcase-3d.jpg'), buf);
  console.log('Created edge-to-edge ebl-master-showcase-3d.jpg');
}

async function run() {
  await createVitaPlus3D();
  await createLube3D();
  await createMassager3D();
  await createUltraThin3D();
  await createEndurance3D();
  await createMatrix3D();
  await createMasterShowcase3D();
  console.log('ALL 3D BRANDED ASSETS GENERATED SUCCESSFULLY!');
}

run().catch(console.error);
