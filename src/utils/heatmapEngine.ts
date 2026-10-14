/**
 * Heatmap Engine for techgylink.com
 * Hardware-accelerated Canvas thermal rendering, coordinate processing,
 * click stream telemetry, and CSV/image export utilities.
 */

export interface HeatPoint {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  value?: number; // relative weight (0.1 - 1.0)
  element: string;
  selector: string;
  pageId: string;
  device: 'desktop' | 'tablet' | 'mobile';
  timestamp: string;
  isConversion?: boolean;
  isRageClick?: boolean;
  isDeadClick?: boolean;
}

export type HeatPalette = 'thermal' | 'infrared' | 'cool';

function fallbackLUT(palette: HeatPalette): Uint8ClampedArray {
  const arr = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r = 0, g = 0, b = 0;
    if (palette === 'infrared') {
      r = Math.round(t * 255);
      g = Math.round(Math.sin(t * Math.PI) * 128);
      b = Math.round((1 - t) * 200 + 55);
    } else if (palette === 'cool') {
      r = Math.round(t * 200);
      g = Math.round(t * 220);
      b = Math.round(255 - t * 100);
    } else {
      if (t < 0.25) {
        b = 255;
        g = Math.round((t / 0.25) * 255);
      } else if (t < 0.5) {
        g = 255;
        b = Math.round((1 - (t - 0.25) / 0.25) * 255);
      } else if (t < 0.75) {
        r = Math.round(((t - 0.5) / 0.25) * 255);
        g = 255;
      } else {
        r = 255;
        g = Math.round((1 - (t - 0.75) / 0.25) * 255);
      }
    }
    const idx = i * 4;
    arr[idx] = r;
    arr[idx + 1] = g;
    arr[idx + 2] = b;
    arr[idx + 3] = i;
  }
  return arr;
}

/**
 * Builds a 256-color RGBA gradient Lookup Table (LUT).
 */
export function createColorLUT(palette: HeatPalette = 'thermal'): Uint8ClampedArray {
  if (typeof document === 'undefined') {
    return fallbackLUT(palette);
  }

  try {
    const gradCanvas = document.createElement('canvas');
    gradCanvas.width = 1;
    gradCanvas.height = 256;
    if (typeof gradCanvas.getContext !== 'function') {
      return fallbackLUT(palette);
    }
    const ctx = gradCanvas.getContext('2d');
    if (!ctx) return fallbackLUT(palette);

  const gradient = ctx.createLinearGradient(0, 0, 0, 256);

  if (palette === 'infrared') {
    gradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.2, 'rgb(75, 0, 130)');   // Indigo
    gradient.addColorStop(0.4, 'rgb(148, 0, 211)');  // Purple
    gradient.addColorStop(0.65, 'rgb(255, 20, 147)'); // Deep Pink
    gradient.addColorStop(0.85, 'rgb(255, 140, 0)');  // Neon Orange
    gradient.addColorStop(1.0, 'rgb(255, 255, 255)'); // White Core
  } else if (palette === 'cool') {
    gradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.2, 'rgb(30, 58, 138)');   // Deep Blue
    gradient.addColorStop(0.45, 'rgb(14, 165, 233)'); // Cyan
    gradient.addColorStop(0.7, 'rgb(16, 185, 129)');  // Emerald
    gradient.addColorStop(0.9, 'rgb(234, 179, 8)');   // Gold
    gradient.addColorStop(1.0, 'rgb(249, 115, 22)');  // Warm Orange
  } else {
    // Classic Thermal (Hotjar / Clarity / Google standard)
    gradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.15, 'rgb(0, 0, 255)');     // Pure Blue
    gradient.addColorStop(0.38, 'rgb(0, 255, 255)');   // Cyan
    gradient.addColorStop(0.62, 'rgb(0, 255, 0)');     // Lime Green
    gradient.addColorStop(0.82, 'rgb(255, 255, 0)');   // Electric Yellow
    gradient.addColorStop(1.0, 'rgb(255, 0, 0)');      // Hot Red
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 256);

  const imgData = ctx.getImageData(0, 0, 1, 256);
  return imgData.data;
  } catch {
    return fallbackLUT(palette);
  }
}

/**
 * Draws thermal density onto an HTML5 canvas based on coordinate points.
 */
export function drawThermalHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatPoint[],
  radius = 38,
  maxOpacity = 0.75,
  palette: HeatPalette = 'thermal'
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || points.length === 0) {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const { width, height } = canvas;
  if (width === 0 || height === 0) return;

  // Step 1: Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Step 2: Draw radial alpha masks for all click points
  points.forEach(pt => {
    const px = (pt.x / 100) * width;
    const py = (pt.y / 100) * height;
    const intensity = pt.value ?? 0.6;

    // Create radial black-to-transparent falloff circle
    const radGrad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    radGrad.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Step 3: Colorize the alpha map using the color lookup table
  const lut = createColorLUT(palette);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      const lutIndex = alpha * 4;
      data[i] = lut[lutIndex];         // R
      data[i + 1] = lut[lutIndex + 1]; // G
      data[i + 2] = lut[lutIndex + 2]; // B
      // Scale alpha by maxOpacity so underlying website content remains readable
      data[i + 3] = Math.min(255, Math.round(alpha * maxOpacity));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generates an organic jittered cluster of points around a center coordinate.
 */
function generateCluster(
  count: number,
  centerX: number,
  centerY: number,
  spreadX: number,
  spreadY: number,
  meta: Partial<HeatPoint>
): HeatPoint[] {
  const points: HeatPoint[] = [];
  for (let i = 0; i < count; i++) {
    // Normal approximation via Box-Muller or random offsets
    const u1 = Math.random();
    const u2 = Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.cos(2.0 * Math.PI * u2);
    const offsetX = randStdNormal * (spreadX / 2.2);
    const offsetY = ((Math.random() - 0.5) * 2) * spreadY;

    const x = Math.max(2, Math.min(98, Math.round((centerX + offsetX) * 10) / 10));
    const y = Math.max(2, Math.min(98, Math.round((centerY + offsetY) * 10) / 10));

    points.push({
      id: `pt-${meta.pageId}-${Math.random().toString(36).slice(2, 9)}`,
      x,
      y,
      value: 0.45 + Math.random() * 0.4,
      element: meta.element || 'Interactive Element',
      selector: meta.selector || 'button',
      pageId: meta.pageId || 'home',
      device: meta.device || 'desktop',
      timestamp: `${Math.floor(Math.random() * 50) + 1}m ago`,
      isConversion: meta.isConversion,
      isRageClick: meta.isRageClick,
      isDeadClick: meta.isDeadClick
    });
  }
  return points;
}

/**
 * Realistic baseline click points for every page on techgylink.com.
 */
export function getBaselinePoints(pageId: string): HeatPoint[] {
  switch (pageId) {
    case 'contact':
      return [
        // Name field
        ...generateCluster(24, 30, 32, 14, 3, {
          pageId, element: 'Input: Full Name', selector: 'input[name="fullName"]', isConversion: true
        }),
        // Phone / WhatsApp input
        ...generateCluster(32, 70, 32, 14, 3, {
          pageId, element: 'Input: Phone Number', selector: 'input[name="phone"]', isConversion: true
        }),
        // Project Type Select
        ...generateCluster(28, 50, 43, 20, 3, {
          pageId, element: 'Select: Project Type', selector: 'select[name="projectType"]', isConversion: true
        }),
        // Submit Discovery Request CTA
        ...generateCluster(54, 50, 68, 12, 3, {
          pageId, element: 'Submit Discovery Request CTA', selector: 'button.btn-submit-discovery', isConversion: true
        }),
        // Direct Phone trigger
        ...generateCluster(36, 82, 88, 8, 3, {
          pageId, element: 'Office Direct Phone (+91 99898 58282)', selector: 'a[href^="tel:"]', isConversion: true
        }),
        // Dead click on non-interactive badge
        ...generateCluster(12, 50, 18, 6, 2, {
          pageId, element: 'Non-linked Privacy Badge', selector: 'span.badge-secure', isDeadClick: true
        })
      ];

    case 'property-launch':
      return [
        // Primary Launch CTA
        ...generateCluster(46, 38, 38, 12, 3, {
          pageId, element: 'Hero: "Schedule Property Launch Briefing"', selector: 'button.btn-launch-briefing', isConversion: true
        }),
        // 3D Visualizer tab
        ...generateCluster(34, 62, 38, 10, 3, {
          pageId, element: 'View 3D Interactive Walkthrough', selector: 'button.btn-view-3d-sample'
        }),
        // Feature 01: Masterplan 3D
        ...generateCluster(26, 25, 66, 12, 4, {
          pageId, element: 'Card: 3D Masterplan Interactive Map', selector: 'div.feature-masterplan'
        }),
        // Feature 02: Unit Selector
        ...generateCluster(30, 50, 66, 12, 4, {
          pageId, element: 'Card: Real-Time Inventory & Unit Selector', selector: 'div.feature-inventory', isConversion: true
        }),
        // Feature 03: Broker App
        ...generateCluster(22, 75, 66, 12, 4, {
          pageId, element: 'Card: Channel Partner Broker Portal', selector: 'div.feature-broker-app'
        }),
        // Floating WhatsApp
        ...generateCluster(30, 88, 90, 6, 3, {
          pageId, element: 'Floating WhatsApp Trigger', selector: 'a.floating-contact-btn', isConversion: true
        })
      ];

    case 'connected-ops':
      return [
        // Hero Audit CTA
        ...generateCluster(42, 40, 38, 12, 3, {
          pageId, element: 'Hero: "Request Architecture Audit"', selector: 'button.btn-request-audit', isConversion: true
        }),
        // Architecture Demo
        ...generateCluster(28, 60, 38, 10, 3, {
          pageId, element: 'Explore 7-Point Integration Blueprint', selector: 'a.btn-explore-blueprint'
        }),
        // CRM connectors
        ...generateCluster(32, 28, 68, 14, 4, {
          pageId, element: 'Workflow: Meta & Google Lead Routing', selector: 'div.flow-lead-routing', isConversion: true
        }),
        ...generateCluster(28, 72, 68, 14, 4, {
          pageId, element: 'Workflow: WhatsApp Automated Follow-ups', selector: 'div.flow-whatsapp-auto', isConversion: true
        }),
        ...generateCluster(15, 88, 8, 6, 2, {
          pageId, element: 'Nav Book a Call', selector: 'header a.nav-cta-btn', isConversion: true
        })
      ];

    case 'digital-product':
      return [
        ...generateCluster(38, 42, 38, 12, 3, {
          pageId, element: 'Hero: "Schedule Tech Review"', selector: 'button.btn-tech-review', isConversion: true
        }),
        ...generateCluster(32, 60, 38, 10, 3, {
          pageId, element: 'View Live Web Apps & Case Studies', selector: 'a.btn-view-apps'
        }),
        ...generateCluster(24, 30, 68, 12, 4, {
          pageId, element: 'Card: Next.js & React High-Performance Web', selector: 'div.card-nextjs'
        }),
        ...generateCluster(26, 70, 68, 12, 4, {
          pageId, element: 'Card: Custom CRM & Client Portals', selector: 'div.card-crm-portals', isConversion: true
        })
      ];

    case 'services':
      return [
        ...generateCluster(36, 50, 28, 14, 3, {
          pageId, element: 'Hero: "Request Services Deck"', selector: 'button.btn-download-deck', isConversion: true
        }),
        ...generateCluster(28, 22, 54, 10, 3, {
          pageId, element: 'Service 01: 3D Visualization & VR', selector: 'div.service-3d'
        }),
        ...generateCluster(32, 50, 54, 10, 3, {
          pageId, element: 'Service 02: Enterprise CRM Integration', selector: 'div.service-crm', isConversion: true
        }),
        ...generateCluster(25, 78, 54, 10, 3, {
          pageId, element: 'Service 03: Performance Growth Marketing', selector: 'div.service-marketing'
        }),
        ...generateCluster(22, 35, 76, 10, 3, {
          pageId, element: 'Service 04: Brand Identity & Systems', selector: 'div.service-branding'
        }),
        ...generateCluster(28, 65, 76, 10, 3, {
          pageId, element: 'Service 05: Mobile Apps & Portals', selector: 'div.service-apps', isConversion: true
        })
      ];

    case 'work':
      return [
        ...generateCluster(48, 28, 52, 14, 5, {
          pageId, element: 'Case Study: GLC Green Land Capital (₹180Cr Land Launch)', selector: 'a.card-case-glc', isConversion: true
        }),
        ...generateCluster(42, 72, 52, 14, 5, {
          pageId, element: 'Case Study: Reliance Builders (Luxury High-Rise)', selector: 'a.card-case-reliance', isConversion: true
        }),
        ...generateCluster(35, 50, 80, 16, 5, {
          pageId, element: 'Case Study: Vasavi Group (Omnichannel CRM Delivery)', selector: 'a.card-case-vasavi', isConversion: true
        }),
        ...generateCluster(30, 88, 90, 6, 3, {
          pageId, element: 'Floating Direct Call (+91 99898 58282)', selector: 'a.floating-contact-btn', isConversion: true
        })
      ];

    case 'home':
    default:
      return [
        // Hero: Book a Discovery Call
        ...generateCluster(52, 42, 38, 8, 3, {
          pageId: 'home', element: 'Hero "Book a Discovery Call"', selector: 'a.btn-discovery-call[href="/contact/"]', isConversion: true
        }),
        // Hero: Get your growth partner
        ...generateCluster(34, 58, 38, 8, 3, {
          pageId: 'home', element: 'Hero "Get your growth partner"', selector: 'a.btn-growth-partner[href="/contact/"]'
        }),
        // Nav Sticky Pill
        ...generateCluster(26, 88, 3, 5, 2, {
          pageId: 'home', element: 'Header "Book a Call" Pill', selector: 'header nav a.nav-cta-btn', isConversion: true
        }),
        // Solution 01: Property Launch
        ...generateCluster(28, 22, 68, 10, 4, {
          pageId: 'home', element: 'Solution: Property Launch & Sales', selector: 'div.solution-card-property'
        }),
        // Solution 02: Connected Ops
        ...generateCluster(26, 50, 68, 10, 4, {
          pageId: 'home', element: 'Solution: Connected Sales & Operations', selector: 'div.solution-card-crm', isConversion: true
        }),
        // Solution 03: Digital Experience
        ...generateCluster(22, 78, 68, 10, 4, {
          pageId: 'home', element: 'Solution: Digital Experience & Delivery', selector: 'div.solution-card-digital'
        }),
        // Floating WhatsApp
        ...generateCluster(44, 88, 90, 6, 3, {
          pageId: 'home', element: 'Floating Call / WhatsApp (+91 99898 58282)', selector: 'a.floating-contact-btn', isConversion: true
        }),
        // Rage click on anchor jump
        ...generateCluster(16, 50, 82, 8, 2, {
          pageId: 'home', element: 'Anchor Jump #why-link (Slow scroll latency)', selector: 'a[href="#why-link"]', isRageClick: true
        })
      ];
  }
}

/**
 * Exports click points to CSV formatted string.
 */
export function exportClicksToCsv(points: HeatPoint[], pagePath: string): string {
  const headers = ['Point ID', 'Page URL', 'Element Name', 'CSS Selector', 'X (%)', 'Y (%)', 'Device', 'Is Conversion Lead', 'Is Rage Click', 'Timestamp'];
  const rows = points.map(pt => [
    pt.id,
    `https://techgylink.com${pagePath}`,
    `"${pt.element.replace(/"/g, '""')}"`,
    `"${pt.selector.replace(/"/g, '""')}"`,
    pt.x.toFixed(1),
    pt.y.toFixed(1),
    pt.device,
    pt.isConversion ? 'YES' : 'NO',
    pt.isRageClick ? 'YES' : 'NO',
    pt.timestamp
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Downloads a file to the user's browser.
 */
export function triggerFileDownload(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
