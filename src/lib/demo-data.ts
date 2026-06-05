// ============================================================================
// Kings Pharmacy — Demo Seed Data
// Single source of truth for the demo environment. Deterministic so SSR == CSR.
// ============================================================================
import type { Product, Stock } from "./store";

// ── Deterministic RNG (mulberry32) ──────────────────────────────────────────
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
const between = (r: () => number, a: number, b: number) => Math.floor(r() * (b - a + 1)) + a;

// ── Unsplash image helper ───────────────────────────────────────────────────
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&q=85&auto=format&fit=crop`;

// Category palette/emoji used for fallback when an external image fails
const CAT_META: Record<string, { emoji: string; color: string }> = {
  "Prescription":    { emoji: "💊", color: "#E0EBFF" },
  "OTC":             { emoji: "💊", color: "#E8F1FF" },
  "Vitamins":        { emoji: "🍊", color: "#FFF1DB" },
  "Devices":         { emoji: "🩺", color: "#E6F4FF" },
  "First Aid":       { emoji: "🩹", color: "#FDECEA" },
  "Baby Care":       { emoji: "🍼", color: "#FFE6EE" },
  "Skincare":        { emoji: "🧴", color: "#EAF6FF" },
  "Personal Care":   { emoji: "🧴", color: "#EAF6FF" },
  "Health Foods":    { emoji: "🥤", color: "#FFF6E0" },
  "Cosmetics":       { emoji: "💄", color: "#FFE6EE" },
};

type Seed = {
  name: string; brand: string; category: string;
  price: number; stock: Stock; stockCount?: number;
  description: string; image: string; dosage?: string;
};

// Mapped status: rx-required→rx, in-stock→in, low-stock→low, out-of-stock→out
const SEED: Seed[] = [
  // ── Prescription Medicines ────────────────────────────────────────────────
  { name: "Amoxicillin 500mg Capsules", brand: "Sandoz", category: "Prescription", price: 4.50, stock: "rx", description: "Broad-spectrum antibiotic capsules for bacterial infections. 21 capsules per pack.", image: u("1559757148-5c350d0d3c56"), dosage: "Take as prescribed by physician" },
  { name: "Metformin 500mg Tablets", brand: "Glucophage", category: "Prescription", price: 6.20, stock: "rx", description: "Oral diabetes medication for type 2 diabetes management. 60 tablets per pack.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Amlodipine 5mg Tablets", brand: "Norvasc", category: "Prescription", price: 8.00, stock: "rx", description: "Calcium channel blocker for hypertension and angina. 30 tablets per pack.", image: u("1550572017-edd951b55104") },
  { name: "Atorvastatin 20mg Tablets", brand: "Lipitor", category: "Prescription", price: 9.50, stock: "rx", description: "Statin medication for high cholesterol management. 30 tablets per pack.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Ciprofloxacin 500mg Tablets", brand: "Ciprobay", category: "Prescription", price: 7.80, stock: "rx", description: "Broad-spectrum antibiotic for urinary tract and respiratory infections. 10 tablets.", image: u("1559757148-5c350d0d3c56") },
  { name: "Omeprazole 20mg Capsules", brand: "Losec", category: "Prescription", price: 5.50, stock: "rx", description: "Proton pump inhibitor for acid reflux and stomach ulcers. 28 capsules per pack.", image: u("1550572017-edd951b55104") },
  { name: "Lisinopril 10mg Tablets", brand: "Zestril", category: "Prescription", price: 7.00, stock: "rx", description: "ACE inhibitor for high blood pressure and heart failure. 30 tablets per pack.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Salbutamol Inhaler 100mcg", brand: "Ventolin", category: "Prescription", price: 12.00, stock: "rx", description: "Reliever inhaler for asthma and bronchospasm. 200 doses per inhaler.", image: u("1576671081837-49000212a370") },

  // ── OTC Medicines ─────────────────────────────────────────────────────────
  { name: "Paracetamol 500mg Tablets", brand: "Disprin", category: "OTC", price: 1.20, stock: "in", stockCount: 200, description: "Fast-acting pain and fever relief tablets. 24 tablets per pack.", image: u("1584308666744-24d5c474f2ae"), dosage: "1-2 tablets every 4-6 hours, max 8/day" },
  { name: "Ibuprofen 400mg Tablets", brand: "Brufen", category: "OTC", price: 2.10, stock: "in", stockCount: 150, description: "Anti-inflammatory pain relief for headaches, muscle pain, and fever. 24 tablets.", image: u("1550572017-edd951b55104") },
  { name: "Aspirin 300mg Tablets", brand: "Disprin", category: "OTC", price: 1.50, stock: "in", stockCount: 180, description: "Pain relief and fever reducer. Also used for heart health. 32 tablets per pack.", image: u("1559757148-5c350d0d3c56") },
  { name: "Loratadine 10mg Antihistamine", brand: "Clarityne", category: "OTC", price: 3.20, stock: "in", stockCount: 90, description: "Non-drowsy antihistamine for hay fever and allergy relief. 30 tablets per pack.", image: u("1550572017-edd951b55104") },
  { name: "Buscopan Antispasmodic Tablets", brand: "Buscopan", category: "OTC", price: 4.00, stock: "in", stockCount: 75, description: "Relieves stomach cramps, bloating, and IBS pain. 20 tablets per pack.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Strepsils Throat Lozenges", brand: "Strepsils", category: "OTC", price: 2.80, stock: "in", stockCount: 120, description: "Soothing antibacterial lozenges for sore throat relief. 24 lozenges per pack.", image: u("1559757175-0eb30cd8c063") },
  { name: "Rennies Antacid Tablets", brand: "Rennies", category: "OTC", price: 2.50, stock: "in", stockCount: 100, description: "Fast-acting antacid for heartburn and indigestion relief. 24 tablets per pack.", image: u("1550572017-edd951b55104") },
  { name: "Immodium Anti-Diarrhoeal", brand: "Immodium", category: "OTC", price: 3.50, stock: "in", stockCount: 85, description: "Fast relief from diarrhoea. 6 capsules per pack.", image: u("1559757148-5c350d0d3c56") },
  { name: "Cough Syrup 200ml", brand: "Benylin", category: "OTC", price: 5.20, stock: "in", stockCount: 60, description: "Thick, soothing syrup for dry and chesty coughs. 200ml bottle.", image: u("1587854692152-cbe660dbde88") },
  { name: "Rehydration Sachets (ORS)", brand: "Rehidrat", category: "OTC", price: 1.80, stock: "in", stockCount: 200, description: "Oral rehydration salts for dehydration from diarrhoea or vomiting. Pack of 10.", image: u("1559757148-5c350d0d3c56") },

  // ── Vitamins & Supplements ────────────────────────────────────────────────
  { name: "Vitamin C 1000mg Effervescent", brand: "Redoxon", category: "Vitamins", price: 3.80, stock: "in", stockCount: 130, description: "Immune-boosting effervescent Vitamin C tablets. Orange flavour. 10 tablets.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Vitamin D3 1000IU Capsules", brand: "Solgar", category: "Vitamins", price: 7.50, stock: "in", stockCount: 80, description: "Supports bone health, immune function, and mood. 90 softgel capsules.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Omega-3 Fish Oil Capsules", brand: "Seven Seas", category: "Vitamins", price: 8.90, stock: "in", stockCount: 70, description: "High-strength fish oil for heart and brain health. 60 capsules per pack.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Multivitamin Complete Tablets", brand: "Centrum", category: "Vitamins", price: 9.20, stock: "in", stockCount: 95, description: "Complete daily multivitamin with 23 essential nutrients. 30 tablets per pack.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Zinc 20mg Tablets", brand: "Solgar", category: "Vitamins", price: 4.50, stock: "in", stockCount: 110, description: "Supports immune defence, skin health, and wound healing. 50 tablets per pack.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Iron + Folic Acid Tablets", brand: "Feroglobin", category: "Vitamins", price: 6.00, stock: "in", stockCount: 75, description: "Iron supplement for anaemia prevention and energy. 30 tablets per pack.", image: u("1550572017-edd951b55104") },
  { name: "Calcium + Vitamin D Tablets", brand: "Caltrate", category: "Vitamins", price: 7.00, stock: "in", stockCount: 65, description: "Combined calcium and Vitamin D for strong bones and teeth. 60 tablets per pack.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Probiotics 10 Billion CFU", brand: "Reuteri", category: "Vitamins", price: 11.50, stock: "low", stockCount: 18, description: "Live cultures for gut health and digestive balance. 30 capsules per pack.", image: u("1616671276441-2f2c277b8bf6") },

  // ── Medical Devices ───────────────────────────────────────────────────────
  { name: "Digital Blood Pressure Monitor", brand: "Omron", category: "Devices", price: 45.00, stock: "in", stockCount: 25, description: "Automatic upper arm blood pressure monitor with large digital display. Omron HEM-7120.", image: u("1614935151651-0bea6508db6b") },
  { name: "Digital Thermometer", brand: "Beurer", category: "Devices", price: 8.50, stock: "in", stockCount: 40, description: "Fast 10-second reading digital thermometer. Flexible tip. Memory recall function.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Blood Glucose Meter (Glucometer)", brand: "Accu-Chek", category: "Devices", price: 38.00, stock: "in", stockCount: 20, description: "Accurate blood glucose monitoring system with 10 test strips included. Accu-Chek Active.", image: u("1631549916768-4119b2e5f926") },
  { name: "Glucometer Test Strips x50", brand: "Accu-Chek", category: "Devices", price: 22.00, stock: "in", stockCount: 35, description: "Compatible test strips for Accu-Chek Active glucose meters. 50 strips per box.", image: u("1631549916768-4119b2e5f926") },
  { name: "Pulse Oximeter", brand: "Beurer", category: "Devices", price: 18.00, stock: "in", stockCount: 30, description: "Fingertip pulse oximeter for SpO2 and heart rate monitoring. Includes lanyard.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Nebuliser Machine", brand: "Omron", category: "Devices", price: 65.00, stock: "low", stockCount: 8, description: "Compressor nebuliser for asthma and respiratory medication delivery at home.", image: u("1576671081837-49000212a370") },
  { name: "Wheelchair (Standard)", brand: "Karma", category: "Devices", price: 180.00, stock: "in", stockCount: 5, description: "Lightweight foldable standard wheelchair with anti-tip wheels. Weight capacity 100kg.", image: u("1558618666-fcd25c85cd64") },
  { name: "Crutches (Adjustable Pair)", brand: "Drive Medical", category: "Devices", price: 28.00, stock: "in", stockCount: 15, description: "Height-adjustable underarm crutches. Lightweight aluminium. Sold as a pair.", image: u("1576091160550-2173dba999ef") },

  // ── First Aid & Wound Care ────────────────────────────────────────────────
  { name: "First Aid Kit (Home)", brand: "St John", category: "First Aid", price: 14.50, stock: "in", stockCount: 40, description: "Complete 42-piece home first aid kit in red hard case with white cross. Wall-mountable.", image: u("1603398938378-e54eab446dde") },
  { name: "Elastoplast Plasters Assorted x40", brand: "Elastoplast", category: "First Aid", price: 3.20, stock: "in", stockCount: 150, description: "Assorted fabric and waterproof plasters for cuts and grazes. 40 plasters per box.", image: u("1603398938378-e54eab446dde") },
  { name: "Crepe Bandage 10cm", brand: "Fissan", category: "First Aid", price: 2.50, stock: "in", stockCount: 120, description: "Conforming crepe bandage for sprains and strains support. 10cm x 4m.", image: u("1603398938378-e54eab446dde") },
  { name: "Antiseptic Wound Spray 100ml", brand: "Dettol", category: "First Aid", price: 4.80, stock: "in", stockCount: 85, description: "No-sting antiseptic spray for cleaning cuts, grazes, and minor wounds. 100ml.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Surgical Gloves (Box of 100)", brand: "Ansell", category: "First Aid", price: 12.00, stock: "in", stockCount: 50, description: "Latex-free disposable examination gloves. Powder-free. Size medium. Box of 100.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Surgical Face Masks (Box of 50)", brand: "3M", category: "First Aid", price: 8.50, stock: "in", stockCount: 200, description: "3-ply disposable surgical face masks. Fluid-resistant. Box of 50 masks.", image: u("1584308666744-24d5c474f2ae") },

  // ── Baby & Mother Care ────────────────────────────────────────────────────
  { name: "NAN Pro 1 Infant Formula 400g", brand: "Nestlé NAN", category: "Baby Care", price: 12.00, stock: "low", stockCount: 12, description: "Stage 1 infant formula for babies 0–6 months. With probiotics. 400g tin.", image: u("1619451334792-150fd785ee74") },
  { name: "Johnson's Baby Shampoo 300ml", brand: "Johnson's", category: "Baby Care", price: 4.50, stock: "in", stockCount: 80, description: "Gentle no-tears baby shampoo. Hypoallergenic and dermatologist tested. 300ml.", image: u("1608248597279-f99d160bfcbc") },
  { name: "Pampers Active Baby Diapers Size 3", brand: "Pampers", category: "Baby Care", price: 9.80, stock: "in", stockCount: 60, description: "Soft and absorbent diapers for babies 6–10kg. 30 diapers per pack.", image: u("1619451334792-150fd785ee74") },
  { name: "Infacol Colic Drops 50ml", brand: "Infacol", category: "Baby Care", price: 6.20, stock: "in", stockCount: 45, description: "Relieves infant colic, griping pain, and trapped wind. Safe from birth. 50ml.", image: u("1587854692152-cbe660dbde88") },
  { name: "Baby Thermometer (Ear)", brand: "Braun", category: "Baby Care", price: 32.00, stock: "in", stockCount: 20, description: "Braun ThermoScan ear thermometer for accurate baby temperature readings. 1-second result.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Sudocrem Nappy Rash Cream 125g", brand: "Sudocrem", category: "Baby Care", price: 5.50, stock: "in", stockCount: 90, description: "Soothing antiseptic healing cream for nappy rash, eczema, and minor burns. 125g.", image: u("1608248597279-f99d160bfcbc") },

  // ── Skincare & Personal Care ──────────────────────────────────────────────
  { name: "Nivea Body Lotion 400ml", brand: "Nivea", category: "Skincare", price: 6.50, stock: "in", stockCount: 100, description: "Deep moisture body lotion for normal to dry skin. 48-hour moisture. 400ml pump.", image: u("1608248597279-f99d160bfcbc") },
  { name: "Dettol Antiseptic Liquid 500ml", brand: "Dettol", category: "Skincare", price: 5.80, stock: "in", stockCount: 110, description: "Multi-purpose antiseptic for wounds, bathing, and household disinfection. 500ml.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Savlon Antiseptic Cream 100g", brand: "Savlon", category: "Skincare", price: 3.90, stock: "in", stockCount: 95, description: "Antiseptic cream for cuts, grazes, minor burns, and skin infections. 100g tube.", image: u("1608248597279-f99d160bfcbc") },
  { name: "Hand Sanitiser Gel 500ml", brand: "Dettol", category: "Skincare", price: 4.20, stock: "in", stockCount: 160, description: "70% alcohol hand sanitiser gel. Kills 99.9% of bacteria and viruses. 500ml pump.", image: u("1584308666744-24d5c474f2ae") },
  { name: "Sunscreen SPF50 150ml", brand: "Neutrogena", category: "Skincare", price: 9.50, stock: "in", stockCount: 55, description: "Ultra-light broad-spectrum SPF50 sunscreen. Non-greasy. Water-resistant. 150ml.", image: u("1608248597279-f99d160bfcbc") },
  { name: "Oral-B Toothbrush (Soft)", brand: "Oral-B", category: "Skincare", price: 2.80, stock: "in", stockCount: 200, description: "Soft bristle toothbrush for effective plaque removal. Ergonomic handle.", image: u("1607613009820-a29f7bb81c04") },

  // ── Health Foods & Nutrition ──────────────────────────────────────────────
  { name: "Ensure Nutrition Shake Vanilla 400g", brand: "Abbott Ensure", category: "Health Foods", price: 18.00, stock: "in", stockCount: 30, description: "Complete balanced nutrition supplement drink for adults. Vanilla flavour. 400g tin.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Glucerna Diabetic Nutrition 400g", brand: "Abbott", category: "Health Foods", price: 22.00, stock: "low", stockCount: 10, description: "Specialised nutrition shake for people with diabetes. Slow-release carbohydrates. 400g.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Medlab Protein Powder 1kg", brand: "Medlab", category: "Health Foods", price: 28.00, stock: "out", stockCount: 0, description: "High-protein whey supplement for muscle recovery and general wellness. 1kg vanilla.", image: u("1616671276441-2f2c277b8bf6") },
  { name: "Electrolyte Sports Drink Powder", brand: "Rehidrat Sport", category: "Health Foods", price: 5.50, stock: "in", stockCount: 75, description: "Electrolyte replenishment powder for dehydration and post-exercise recovery. 10 sachets.", image: u("1559757148-5c350d0d3c56") },
];

const r0 = rng(20260604);
export const PRODUCTS_ALL: Product[] = SEED.map((s, i) => {
  const meta = CAT_META[s.category] ?? { emoji: "💊", color: "#E8F1FF" };
  return {
    id: `kp-${String(i + 1).padStart(3, "0")}`,
    name: s.name,
    brand: s.brand,
    price: s.price,
    emoji: meta.emoji,
    color: meta.color,
    stock: s.stock,
    stockCount: s.stockCount,
    category: s.category,
    description: s.description,
    dosage: s.dosage,
    manufacturer: s.brand,
    expiry: `${between(r0, 1, 12).toString().padStart(2, "0")}/202${between(r0, 6, 9)}`,
  };
});

// Map id → image URL
export const PRODUCT_IMAGE: Record<string, string> = Object.fromEntries(
  SEED.map((s, i) => [`kp-${String(i + 1).padStart(3, "0")}`, s.image]),
);

// Featured = 8 products, one from each major category
const FEATURED_IDS = ["kp-009", "kp-001", "kp-019", "kp-027", "kp-035", "kp-041", "kp-047", "kp-053"];
export const FEATURED_PRODUCTS = FEATURED_IDS
  .map((id) => PRODUCTS_ALL.find((p) => p.id === id)!)
  .filter(Boolean);

// New Arrivals = last 6 by id
export const NEW_ARRIVALS = PRODUCTS_ALL.slice(-6).reverse();

// ── People ──────────────────────────────────────────────────────────────────
const FIRST = ["Tinashe","Tatenda","Tendai","Farai","Nyasha","Rumbidzai","Tanaka","Tapiwa","Chipo","Rutendo","Tariro","Kudzai","Munashe","Anesu","Panashe","Vimbai","Simbarashe","Tafara","Nokuthula","Tanyaradzwa","Blessing","Tonderai","Memory","Mercy","Privilege","Brighton","Joyce","Patience","Sharon","Lloyd","Lorraine","Tashinga","Tinotenda","Praise","Tafadzwa","Hope","Faith","John","Grace","Charity","Edmore","Edith","Knowledge","Wisdom","Comfort","Plaxedes","Pamhidzai","Munyaradzi","Tichaona","Cleopatra"];
const LAST  = ["Moyo","Ncube","Sibanda","Mhlanga","Chigwedere","Mutasa","Dube","Chikore","Mawere","Mlambo","Mpofu","Nyathi","Marowa","Chitando","Murambadoro","Madziva","Nkomo","Mhandu","Chiweshe","Mhuriro","Banda","Phiri","Tshuma","Ndlovu","Mukamuri","Magaya"];
const STREETS = ["Samora Machel Ave","Borrowdale Rd","Enterprise Rd","Glen Eagles","Avondale","Mt Pleasant Dr","Greendale Ave","Chiremba Rd","Highfield","Marlborough","Eastlea","Belvedere","Westgate","Mabelreign","Sunningdale"];

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar: string; // emoji
  rating?: number;
}

function person(r: () => number, idx: number, prefix: string, avatars: string[]): Person {
  const fn = pick(r, FIRST);
  const ln = pick(r, LAST);
  return {
    id: `${prefix}-${String(idx + 1).padStart(3, "0")}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    phone: `+263 77 ${between(r, 100, 999)} ${between(r, 1000, 9999)}`,
    address: `${between(r, 1, 240)} ${pick(r, STREETS)}, Harare`,
    avatar: pick(r, avatars),
    rating: Number((4.5 + r() * 0.5).toFixed(1)),
  };
}

const rC = rng(42);
export const CUSTOMERS: Person[] = Array.from({ length: 50 }, (_, i) =>
  person(rC, i, "cust", ["🧑🏾","👩🏾","🧑🏿","👨🏾‍🦱","👩🏿‍🦱","🧕🏾","👨🏾","👩🏾‍🦰"]),
);

const PHARM_ROLES = ["Senior Pharmacist","Dispensing Pharmacist","Rx Verification Pharmacist","Clinical Pharmacist","Compounding Pharmacist"];
const rP = rng(7);
export const PHARMACISTS = Array.from({ length: 5 }, (_, i) => ({
  ...person(rP, i, "pharm", ["👨🏾‍⚕️","👩🏾‍⚕️","👨🏿‍⚕️","👩🏿‍⚕️"]),
  role: PHARM_ROLES[i],
  shift: pick(rP, ["Mon–Fri 08:00–17:00","Tue–Sat 09:00–18:00","Mon–Sat 07:00–14:00","Wed–Sun 12:00–21:00"]),
  ordersHandled: between(rP, 420, 1280),
}));

const rA = rng(8);
export const ASSISTANTS = Array.from({ length: 5 }, (_, i) => ({
  ...person(rA, i, "asst", ["🧑🏾‍⚕️","👩🏾","👨🏾","🧑🏿"]),
  role: "Pharmacy Assistant",
  shift: pick(rA, ["Mon–Fri 08:00–17:00","Tue–Sat 09:00–18:00","Daily 14:00–22:00"]),
  ordersHandled: between(rA, 180, 640),
}));

const VEHICLES = ["Honda CG125 (Motorcycle)","Toyota Hilux (Bakkie)","Suzuki GD110 (Motorcycle)","Yamaha YBR125","Nissan NP200","Honda XR150"];
const rD = rng(11);
export const DRIVERS = Array.from({ length: 10 }, (_, i) => ({
  ...person(rD, i, "drv", ["🧑🏾‍🦱","👨🏾","👨🏿","🧑🏾"]),
  vehicle: VEHICLES[i % VEHICLES.length],
  deliveries: between(rD, 180, 920),
  onTimeRate: between(rD, 92, 99),
}));

// ── Orders (500+) ───────────────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Awaiting Review"
  | "Approved"
  | "Packed"
  | "Driver Assigned"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending","Awaiting Review","Approved","Packed","Driver Assigned","Out for Delivery","Delivered","Cancelled",
];

export interface Order {
  id: string;
  customer: Person;
  pharmacist: Person;
  driver?: Person;
  status: OrderStatus;
  items: { productId: string; qty: number; name: string; price: number }[];
  total: number;
  placedAt: string; // ISO
  payment: "EcoCash" | "Visa" | "Mastercard" | "Cash on Delivery";
}

function buildOrders(): Order[] {
  const r = rng(99);
  const distribution: [OrderStatus, number][] = [
    ["Delivered", 520],
    ["Out for Delivery", 22],
    ["Driver Assigned", 14],
    ["Packed", 18],
    ["Approved", 16],
    ["Awaiting Review", 12],
    ["Pending", 30],
    ["Cancelled", 18],
  ];
  const out: Order[] = [];
  let idx = 0;
  const now = Date.UTC(2026, 5, 4); // June 4, 2026
  for (const [status, count] of distribution) {
    for (let i = 0; i < count; i++) {
      const items = Array.from({ length: between(r, 1, 4) }, () => {
        const p = pick(r, PRODUCTS_ALL);
        const qty = between(r, 1, 3);
        return { productId: p.id, qty, name: p.name, price: p.price };
      });
      const total = items.reduce((a, c) => a + c.price * c.qty, 0);
      const cust = pick(r, CUSTOMERS);
      const pharm = pick(r, PHARMACISTS);
      const needsDriver = ["Driver Assigned","Out for Delivery","Delivered"].includes(status);
      const drv = needsDriver ? pick(r, DRIVERS) : undefined;
      const daysAgo = status === "Delivered" ? between(r, 1, 180) : between(r, 0, 2);
      const placed = new Date(now - daysAgo * 86400000 - between(r, 0, 86400) * 1000);
      out.push({
        id: `KP-2026-${String(10000 + idx++).padStart(5, "0")}`,
        customer: cust,
        pharmacist: pharm,
        driver: drv,
        status,
        items,
        total: Number(total.toFixed(2)),
        placedAt: placed.toISOString(),
        payment: pick(r, ["EcoCash","Visa","Mastercard","Cash on Delivery"] as const),
      });
    }
  }
  return out.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}
export const ORDERS = buildOrders();

export const ORDERS_BY_STATUS = ORDER_STATUSES.reduce((acc, s) => {
  acc[s] = ORDERS.filter((o) => o.status === s);
  return acc;
}, {} as Record<OrderStatus, Order[]>);

// ── Prescriptions ───────────────────────────────────────────────────────────
export type RxStatus = "Pending Review" | "Approved" | "Rejected" | "Dispensed";
export interface Prescription {
  id: string;
  customer: Person;
  medication: string;
  doctor: string;
  uploadedAt: string;
  status: RxStatus;
}
function buildRx(): Prescription[] {
  const r = rng(123);
  const dist: [RxStatus, number][] = [
    ["Dispensed", 56],
    ["Approved", 18],
    ["Pending Review", 16],
    ["Rejected", 10],
  ];
  const docs = ["Dr. T. Mhlanga","Dr. R. Chigwedere","Dr. S. Sibanda","Dr. K. Ncube","Dr. F. Moyo"];
  const meds = SEED.filter((s) => s.stock === "rx" || /250mg|500mg|mg$/i.test(s.name)).map((s) => s.name);
  const out: Prescription[] = [];
  let idx = 0;
  const now = Date.UTC(2026, 5, 4);
  for (const [status, count] of dist) {
    for (let i = 0; i < count; i++) {
      const daysAgo = status === "Dispensed" ? between(r, 1, 60) : between(r, 0, 2);
      out.push({
        id: `RX-${String(2000 + idx++).padStart(4, "0")}`,
        customer: pick(r, CUSTOMERS),
        medication: pick(r, meds),
        doctor: pick(r, docs),
        uploadedAt: new Date(now - daysAgo * 86400000).toISOString(),
        status,
      });
    }
  }
  return out;
}
export const PRESCRIPTIONS = buildRx();

// ── Reviews ─────────────────────────────────────────────────────────────────
const REVIEW_TEXTS = [
  "Very professional and delivered on time.",
  "Excellent pharmacist support and clear advice.",
  "Quick delivery and friendly driver.",
  "Smooth order, will use again.",
  "Pharmacist was patient and answered every question.",
  "Driver was polite and respectful.",
  "Arrived earlier than estimated, well packaged.",
  "Great experience from start to finish.",
  "Will recommend to family and friends.",
  "Reliable and well priced.",
  "Best pharmacy delivery service in town.",
  "Outstanding customer care.",
];
export interface Review { id: string; author: string; subjectId: string; stars: number; text: string; date: string; }
function buildReviews(prefix: string, subjects: Person[], seed: number, count: number): Review[] {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    author: pick(r, CUSTOMERS).name,
    subjectId: pick(r, subjects).id,
    stars: r() < 0.78 ? 5 : r() < 0.9 ? 4 : 3,
    text: pick(r, REVIEW_TEXTS),
    date: new Date(Date.UTC(2026, 5, 4) - between(r, 1, 180) * 86400000).toISOString(),
  }));
}
export const DRIVER_REVIEWS = buildReviews("dr-rev", DRIVERS, 31, 200);
export const PHARMACIST_REVIEWS = buildReviews("ph-rev", PHARMACISTS, 32, 200);
export const DELIVERY_REVIEWS = buildReviews("dv-rev", DRIVERS, 33, 200);

// ── Admin KPIs ──────────────────────────────────────────────────────────────
export const KPIS = {
  sales: { today: 3450, week: 21850, month: 94320, year: 1_204_780 },
  orders: { total: 8742, completed: 8210, pending: 312, cancelled: 220 },
  customers: { registered: 5432, active: 2984, newThisMonth: 412 },
  delivery: { onTimePct: 96, avgMinutes: 38, satisfaction: 4.8 },
  topProducts: [
    { name: "Panado 500mg", units: 1842 },
    { name: "Vitamin C 1000mg", units: 1456 },
    { name: "Blood Pressure Monitor", units: 612 },
    { name: "Allergex 4mg", units: 1280 },
    { name: "Baby Formula NAN Stage 1", units: 740 },
    { name: "Amoxil 250mg", units: 980 },
  ],
  revenueTrend: Array.from({ length: 12 }, (_, i) => {
    const r = rng(50 + i)();
    return { month: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i], value: Math.round(70000 + r * 40000) };
  }),
};

// ── Live tracking demo (one fake live delivery) ─────────────────────────────
export const LIVE_DELIVERY = {
  driver: DRIVERS[0],
  status: "Out for Delivery",
  distanceKm: 3,
  etaMinutes: 12,
  customer: CUSTOMERS[3],
  orderId: "KP-2026-10024",
};
