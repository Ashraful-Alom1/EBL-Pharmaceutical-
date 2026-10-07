const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function renderUltraThin3D() {
  const w = 1200;
  const h = 900;

  // Render a photorealistic 3D scene:
  // - Studio lighting on luxury marble/silk studio countertop
  // - True 3D perspective box: Front face, Side face, and Top face with realistic lighting gradients
  // - EBL CARE logo with medical cross
  // - Gold foil "FEATHER-TOUCH" and bold metallic "0.03mm ULTRA-THIN"
  // - Realistic 3D Buttercup pod beside the box with curved metallic hermetic peel-tab
  // - Contact shadows and ambient floor occlusion
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Studio Background Gradient with Soft Radial Key Light -->
      <radialGradient id="studioLighting" cx="45%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="35%" stop-color="#F1F5F9" />
        <stop offset="70%" stop-color="#E2E8F0" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </radialGradient>

      <!-- Soft Countertop Horizon Gradient -->
      <linearGradient id="countertop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.4" />
        <stop offset="25%" stop-color="#F8FAFC" />
        <stop offset="75%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#E2E8F0" />
      </linearGradient>

      <!-- 3D Box Front Face: Deep Luxury Midnight Emerald/Teal with Soft Specular Shading -->
      <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F2E2B" />
        <stop offset="40%" stop-color="#0A2220" />
        <stop offset="80%" stop-color="#061816" />
        <stop offset="100%" stop-color="#030F0E" />
      </linearGradient>

      <!-- 3D Box Right Side Face (In Shadow) -->
      <linearGradient id="boxSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#041211" />
        <stop offset="50%" stop-color="#030E0D" />
        <stop offset="100%" stop-color="#010706" />
      </linearGradient>

      <!-- 3D Box Top Face (Catches Top Key Light) -->
      <linearGradient id="boxTop" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#14423E" />
        <stop offset="50%" stop-color="#1A534E" />
        <stop offset="100%" stop-color="#246E67" />
      </linearGradient>

      <!-- Metallic Gold Foil Gradient -->
      <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCEBA6" />
        <stop offset="25%" stop-color="#E5C07B" />
        <stop offset="50%" stop-color="#FDF4D1" />
        <stop offset="75%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#997A15" />
      </linearGradient>

      <!-- Teal Metallic Sheen -->
      <linearGradient id="tealSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#14B8A6" />
        <stop offset="50%" stop-color="#5EEAD4" />
        <stop offset="100%" stop-color="#0D9488" />
      </linearGradient>

      <!-- Buttercup Pod Metallic Platinum Foil Lid -->
      <linearGradient id="podLid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="20%" stop-color="#F1F5F9" />
        <stop offset="45%" stop-color="#E2E8F0" />
        <stop offset="70%" stop-color="#CBD5E1" />
        <stop offset="100%" stop-color="#94A3B8" />
      </linearGradient>

      <!-- Buttercup Plastic Cup Side (Golden Teal) -->
      <linearGradient id="podCup" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0D9488" />
        <stop offset="40%" stop-color="#14B8A6" />
        <stop offset="70%" stop-color="#2DD4BF" />
        <stop offset="100%" stop-color="#0F766E" />
      </linearGradient>

      <!-- Soft Shadow Filters -->
      <filter id="shadowBlurLarge" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
      <filter id="shadowBlurMedium" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="glowFoil" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Studio Wall Background -->
    <rect width="${w}" height="${h}" fill="url(#studioLighting)" />

    <!-- Studio Table/Countertop Horizon -->
    <rect y="480" width="${w}" height="420" fill="url(#countertop)" />
    <line x1="0" y1="480" x2="${w}" y2="480" stroke="#CBD5E1" stroke-width="1.5" stroke-opacity="0.6" />

    <!-- Soft Depth Ambient Bokeh Circle -->
    <circle cx="260" cy="280" r="200" fill="#E2E8F0" opacity="0.4" filter="url(#shadowBlurLarge)" />
    <circle cx="940" cy="240" r="180" fill="#E2E8F0" opacity="0.3" filter="url(#shadowBlurLarge)" />

    <!-- ========================================== -->
    <!-- 3D FLOOR SHADOWS (Ambient Occlusion) -->
    <!-- ========================================== -->
    <ellipse cx="510" cy="800" rx="360" ry="42" fill="#0F172A" opacity="0.25" filter="url(#shadowBlurLarge)" />
    <polygon points="250,780 720,780 800,810 200,810" fill="#0F172A" opacity="0.35" filter="url(#shadowBlurMedium)" />
    <ellipse cx="880" cy="790" rx="180" ry="30" fill="#0F172A" opacity="0.3" filter="url(#shadowBlurMedium)" />

    <!-- ========================================== -->
    <!-- 3D STANDING BOX (Perspective 3/4 View - Large) -->
    <!-- ========================================== -->
    <!--
      Front Face: 
      Top-Left: (260, 200), Top-Right: (610, 160)
      Bottom-Right: (610, 770), Bottom-Left: (260, 810)
    -->

    <!-- Top Face -->
    <polygon points="260,200 370,110 720,80 610,160" fill="url(#boxTop)" stroke="#2DD4BF" stroke-width="0.8" stroke-opacity="0.4" />
    <g transform="translate(485, 125) rotate(-14) skewX(-45) scale(1, 0.55)">
      <text x="0" y="0" text-anchor="middle" fill="#5EEAD4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" letter-spacing="5" opacity="0.8">EBL CARE</text>
    </g>

    <!-- Right Side Face -->
    <polygon points="610,160 720,80 720,690 610,770" fill="url(#boxSide)" stroke="#134E4A" stroke-width="0.5" />
    <g transform="translate(665, 420) skewY(-35) scale(0.75, 1.2)">
      <text x="0" y="-80" text-anchor="middle" fill="#5EEAD4" font-family="'Segoe UI', sans-serif" font-weight="bold" font-size="13" letter-spacing="2">0.03 mm</text>
      <text x="0" y="-50" text-anchor="middle" fill="#94A3B8" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11">ELECTRONICALLY</text>
      <text x="0" y="-32" text-anchor="middle" fill="#94A3B8" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11">TESTED 100%</text>
      <rect x="-40" y="15" width="80" height="100" fill="#020908" rx="4" stroke="#134E4A" stroke-width="1" />
      <line x1="-30" y1="25" x2="-30" y2="95" stroke="#94A3B8" stroke-width="2.5" />
      <line x1="-22" y1="25" x2="-22" y2="95" stroke="#94A3B8" stroke-width="1.5" />
      <line x1="-15" y1="25" x2="-15" y2="95" stroke="#94A3B8" stroke-width="3" />
      <line x1="-5" y1="25" x2="-5" y2="95" stroke="#94A3B8" stroke-width="1" />
      <line x1="5" y1="25" x2="5" y2="95" stroke="#94A3B8" stroke-width="2.5" />
      <line x1="15" y1="25" x2="15" y2="95" stroke="#94A3B8" stroke-width="3.5" />
      <line x1="25" y1="25" x2="25" y2="95" stroke="#94A3B8" stroke-width="2" />
      <line x1="32" y1="25" x2="32" y2="95" stroke="#94A3B8" stroke-width="2.5" />
    </g>

    <!-- Front Face -->
    <polygon points="260,200 610,160 610,770 260,810" fill="url(#boxFront)" stroke="#2DD4BF" stroke-width="1.2" stroke-opacity="0.6" />
    <path d="M 261,201 L 609,161 L 609,167 L 261,207 Z" fill="#FFFFFF" opacity="0.3" />
    <path d="M 261,201 L 267,202 L 267,808 L 261,809 Z" fill="#5EEAD4" opacity="0.4" />

    <!-- FRONT FACE CONTENT -->
    <g transform="translate(435, 485) skewY(-6.3)">
      <!-- Company Header Tag -->
      <rect x="-145" y="-250" width="290" height="34" rx="17" fill="#042F2C" stroke="#14B8A6" stroke-width="1.2" />
      <!-- Medical Cross Emblem -->
      <path d="M -115,-238 h 7 v -7 h 5 v 7 h 7 v 5 h -7 v 7 h -5 v -7 h -7 Z" fill="#2DD4BF" />
      <text x="6" y="-227" text-anchor="middle" fill="#E2E8F0" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" letter-spacing="3">EASTERN BIOCHEMICALS</text>

      <!-- Brand Name -->
      <text x="0" y="-170" text-anchor="middle" fill="#FFFFFF" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="36" letter-spacing="5">EBL CARE</text>

      <!-- Metallic Gold Feather Icon -->
      <path d="M -20,-140 C -32,-105 -12,-90 0,-70 C 12,-90 32,-105 20,-140 C 6,-120 0,-115 -20,-140 Z" fill="url(#goldFoil)" filter="url(#glowFoil)" />

      <!-- Center Metallic Badge for 0.03mm -->
      <ellipse cx="0" cy="-5" rx="110" ry="70" fill="#041F1D" stroke="url(#goldFoil)" stroke-width="3" />
      <ellipse cx="0" cy="-5" rx="100" ry="62" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-dasharray="6,5" />

      <text x="0" y="10" text-anchor="middle" fill="url(#goldFoil)" font-family="'Arial Black', Gadget, sans-serif" font-weight="900" font-size="56" letter-spacing="-1">0.03</text>
      <text x="0" y="40" text-anchor="middle" fill="#5EEAD4" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="15" letter-spacing="5">MILLIMETER</text>

      <!-- Product Title -->
      <text x="0" y="115" text-anchor="middle" fill="#FFFFFF" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" letter-spacing="3">FEATHER-TOUCH</text>
      <text x="0" y="142" text-anchor="middle" fill="url(#goldFoil)" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="15" letter-spacing="4">ULTRA-THIN LUXURY</text>

      <!-- Feature Pill: Hermetic Buttercup 10-Pack -->
      <rect x="-145" y="180" width="290" height="42" rx="12" fill="#08332F" stroke="#2DD4BF" stroke-width="1.5" />
      <text x="0" y="206" text-anchor="middle" fill="#CCFBF1" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" letter-spacing="2">HERMETIC BUTTERCUP · 10 PCS</text>
      <text x="0" y="244" text-anchor="middle" fill="#94A3B8" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" letter-spacing="1.5">PREMIUM NATURAL RUBBER LATEX</text>
    </g>

    <!-- ========================================== -->
    <!-- 3D BUTTERCUP POD (Round Hermetic Blister) -->
    <!-- ========================================== -->
    <g transform="translate(860, 640)">
      <!-- Pod Cup Base (Depth/Cylinder) -->
      <ellipse cx="20" cy="90" rx="120" ry="50" fill="url(#podCup)" stroke="#0F766E" stroke-width="2.5" />
      <path d="M -100,65 C -100,105 140,105 140,65 L 140,90 C 140,130 -100,130 -100,90 Z" fill="#0D9488" opacity="0.9" />

      <!-- Pod Rim Layer -->
      <ellipse cx="20" cy="65" rx="122" ry="52" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2.5" />

      <!-- Pod Metallic Foil Lid (Tilted 3D view) -->
      <ellipse cx="20" cy="62" rx="116" ry="49" fill="url(#podLid)" stroke="#94A3B8" stroke-width="2" />

      <!-- Curved Peel-Tab on the right -->
      <path d="M 120,50 C 170,35 185,70 145,90 C 132,82 126,70 120,50 Z" fill="url(#podLid)" stroke="#94A3B8" stroke-width="2" />
      <path d="M 128,56 C 152,50 162,65 142,75" fill="none" stroke="#64748B" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Pod Lid Branding Graphic -->
      <ellipse cx="20" cy="62" rx="95" ry="39" fill="none" stroke="#0D9488" stroke-width="2.5" stroke-dasharray="8,5" />
      <text x="20" y="55" text-anchor="middle" fill="#0F766E" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="18" letter-spacing="3">EBL CARE</text>
      <text x="20" y="75" text-anchor="middle" fill="#134E4A" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" letter-spacing="-0.5">0.03 mm</text>
      <text x="20" y="90" text-anchor="middle" fill="#0D9488" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="10" letter-spacing="2">FEATHER-TOUCH</text>
    </g>

    <!-- Glass Studio Lighting Reflection across the countertop -->
    <polygon points="200,890 550,750 640,750 310,890" fill="#FFFFFF" opacity="0.08" />
  </svg>
  `;

  const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');
  const storeDir = path.join(__dirname, '..', 'public', 'images', 'store');

  const buf = await sharp(Buffer.from(svg))
    .jpeg({ quality: 96 })
    .toBuffer();

  fs.writeFileSync(path.join(prodDir, 'ebl-ultrathin-3d.jpg'), buf);
  fs.writeFileSync(path.join(storeDir, 'ebl-ultrathin-3d.jpg'), buf);
  console.log('Successfully generated high-resolution 3D ebl-ultrathin-3d.jpg!');
}

renderUltraThin3D().catch(console.error);
