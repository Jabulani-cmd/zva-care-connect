// ============================================================================
// Kings Pharmacy — Demo Seed Data
// Single source of truth for the demo environment. Deterministic so SSR == CSR.
// ============================================================================
import type { Product, Stock } from "./store";
import prodParacetamol from "@/assets/prod-paracetamol.jpg";
import prodAmoxicillin from "@/assets/prod-amoxicillin.jpg";
import prodVitC from "@/assets/prod-vitc.jpg";
import prodFormula from "@/assets/prod-formula.jpg";
import prodBP from "@/assets/prod-bp.jpg";
import prodIbuprofen from "@/assets/prod-ibuprofen.jpg";
import prodLotion from "@/assets/prod-lotion.jpg";
import prodGlucose from "@/assets/prod-glucose.jpg";
import catPainRelief from "@/assets/cat-painrelief.jpg";
import catAntibiotic from "@/assets/cat-antibiotic.jpg";
import catSyrup from "@/assets/cat-syrup.jpg";
import catThermometer from "@/assets/cat-thermometer.jpg";
import catNebuliser from "@/assets/cat-nebuliser.jpg";
import catWheelchair from "@/assets/cat-wheelchair.jpg";
import catNappies from "@/assets/cat-nappies.jpg";
import catWipes from "@/assets/cat-wipes.jpg";
import catVitD from "@/assets/cat-vitd.jpg";
import catMultivit from "@/assets/cat-multivit.jpg";
import catToothpaste from "@/assets/cat-toothpaste.jpg";
import catSanitizer from "@/assets/cat-sanitizer.jpg";
import catMasks from "@/assets/cat-masks.jpg";
import catSoap from "@/assets/cat-soap.jpg";
import catFirstAid from "@/assets/cat-firstaid.jpg";
import catOximeter from "@/assets/cat-oximeter.jpg";
import catPregTest from "@/assets/cat-pregtest.jpg";
import catPads from "@/assets/cat-pads.jpg";
import catEyeDrops from "@/assets/cat-eyedrops.jpg";
import catNasalSpray from "@/assets/cat-nasalspray.jpg";
import catSunglasses from "@/assets/cat-sunglasses.jpg";
import catSunscreen from "@/assets/cat-sunscreen.jpg";
import catEarDrops from "@/assets/cat-eardrops.jpg";
import catShampoo from "@/assets/cat-shampoo.jpg";

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

// ── Product catalogue (110+) ────────────────────────────────────────────────
type Img = string;
const ICON: Record<string, { img: Img; emoji: string; color: string }> = {
  painTablet: { img: catPainRelief, emoji: "💊", color: "#E8F1FF" },
  antibiotic: { img: catAntibiotic, emoji: "💊", color: "#FFE6E6" },
  syrup:      { img: catSyrup,      emoji: "🧴", color: "#FFE9E9" },
  thermometer:{ img: catThermometer,emoji: "🌡️", color: "#EAF6FF" },
  nebuliser:  { img: catNebuliser,  emoji: "💨", color: "#EAF6FF" },
  wheelchair: { img: catWheelchair, emoji: "♿", color: "#F0F2F5" },
  nappies:    { img: catNappies,    emoji: "🍼", color: "#FFE6EE" },
  wipes:      { img: catWipes,      emoji: "🧻", color: "#FFEEF4" },
  vitd:       { img: catVitD,       emoji: "🧈", color: "#FFF1DB" },
  multivit:   { img: catMultivit,   emoji: "🌈", color: "#FFF6E0" },
  toothpaste: { img: catToothpaste, emoji: "🪥", color: "#EAF6FF" },
  sanitizer:  { img: catSanitizer,  emoji: "🧴", color: "#EAF6FF" },
  masks:      { img: catMasks,      emoji: "😷", color: "#EAF6FF" },
  soap:       { img: catSoap,       emoji: "🧼", color: "#EAF6FF" },
  firstaid:   { img: catFirstAid,   emoji: "🩹", color: "#FDECEA" },
  oximeter:   { img: catOximeter,   emoji: "🫁", color: "#E6F4FF" },
  pregtest:   { img: catPregTest,   emoji: "🧪", color: "#FFE6EE" },
  pads:       { img: catPads,       emoji: "🌸", color: "#FFE6EE" },
  eyedrops:   { img: catEyeDrops,   emoji: "👁️", color: "#E6F4FF" },
  nasalspray: { img: catNasalSpray, emoji: "👃", color: "#E6F4FF" },
  sunglasses: { img: catSunglasses, emoji: "🕶️", color: "#F0F2F5" },
  sunscreen:  { img: catSunscreen,  emoji: "☀️", color: "#FFF1DB" },
  eardrops:   { img: catEarDrops,   emoji: "👂", color: "#FFE9E9" },
  shampoo:    { img: catShampoo,    emoji: "🧴", color: "#EAF6FF" },
  paracetamol:{ img: prodParacetamol, emoji: "💊", color: "#E8F1FF" },
  amoxicillin:{ img: prodAmoxicillin, emoji: "💊", color: "#E0EBFF" },
  vitc:       { img: prodVitC,        emoji: "🍊", color: "#FFF1DB" },
  formula:    { img: prodFormula,     emoji: "🍼", color: "#FFE6EE" },
  bp:         { img: prodBP,          emoji: "🩺", color: "#E6F4FF" },
  ibuprofen:  { img: prodIbuprofen,   emoji: "💊", color: "#FFE6E6" },
  lotion:     { img: prodLotion,      emoji: "🧴", color: "#EAF6FF" },
  glucose:    { img: prodGlucose,     emoji: "🩸", color: "#FFE9E9" },
};

type Seed = {
  name: string; brand: string; category: string; iconKey: keyof typeof ICON;
  price: number; stock?: Stock; dosage?: string; description?: string;
};

const SEED: Seed[] = [
  // — Pain & Fever (OTC) —
  { name: "Panado 500mg", brand: "Adcock Ingram", category: "OTC", iconKey: "paracetamol", price: 1.20, dosage: "1-2 tablets every 4-6 hours" },
  { name: "Disprin Original 300mg", brand: "Disprin", category: "OTC", iconKey: "painTablet", price: 1.40 },
  { name: "Myprodol Capsules", brand: "Adcock Ingram", category: "OTC", iconKey: "painTablet", price: 3.20 },
  { name: "Voltaren 50mg", brand: "GSK", category: "OTC", iconKey: "painTablet", price: 4.80 },
  { name: "Brufen 400mg (Ibuprofen)", brand: "Abbott", category: "OTC", iconKey: "ibuprofen", price: 2.10 },
  { name: "Calpol Infant Suspension", brand: "GSK", category: "Baby Care", iconKey: "syrup", price: 3.50 },
  { name: "Grandpa Headache Powders", brand: "GSK", category: "OTC", iconKey: "painTablet", price: 1.80 },
  { name: "Nurofen 200mg", brand: "Reckitt", category: "OTC", iconKey: "ibuprofen", price: 2.90 },
  { name: "Stilpane Tablets", brand: "Aspen", category: "Prescription", iconKey: "painTablet", price: 5.20, stock: "rx" },
  { name: "Tramacet 37.5mg", brand: "Janssen", category: "Prescription", iconKey: "painTablet", price: 8.60, stock: "rx" },

  // — Antibiotics (Rx) —
  { name: "Amoxil 250mg", brand: "GSK", category: "Prescription", iconKey: "amoxicillin", price: 4.50, stock: "rx" },
  { name: "Augmentin 625mg", brand: "GSK", category: "Prescription", iconKey: "antibiotic", price: 12.40, stock: "rx" },
  { name: "Zithromax 500mg", brand: "Pfizer", category: "Prescription", iconKey: "antibiotic", price: 14.80, stock: "rx" },
  { name: "Ciprobay 500mg", brand: "Bayer", category: "Prescription", iconKey: "antibiotic", price: 9.60, stock: "rx" },
  { name: "Flagyl 400mg", brand: "Sanofi", category: "Prescription", iconKey: "antibiotic", price: 5.20, stock: "rx" },
  { name: "Doxycycline 100mg", brand: "Pfizer", category: "Prescription", iconKey: "antibiotic", price: 6.10, stock: "rx" },
  { name: "Erythromycin 250mg", brand: "Abbott", category: "Prescription", iconKey: "antibiotic", price: 7.40, stock: "rx" },

  // — Allergy & Cold —
  { name: "Allergex 4mg", brand: "Adcock Ingram", category: "OTC", iconKey: "painTablet", price: 1.90 },
  { name: "Sinutab Original", brand: "GSK", category: "OTC", iconKey: "painTablet", price: 4.30 },
  { name: "Demazin Cold Syrup", brand: "Merck", category: "OTC", iconKey: "syrup", price: 3.80 },
  { name: "Aerius 5mg", brand: "Merck", category: "OTC", iconKey: "painTablet", price: 6.20 },
  { name: "Otrivin Nasal Spray", brand: "GSK", category: "OTC", iconKey: "nasalspray", price: 4.10 },
  { name: "Vicks VapoRub 50g", brand: "P&G", category: "OTC", iconKey: "lotion", price: 3.40 },
  { name: "Strepsils Honey & Lemon", brand: "Reckitt", category: "OTC", iconKey: "painTablet", price: 2.20 },
  { name: "Benylin Cough Syrup", brand: "J&J", category: "OTC", iconKey: "syrup", price: 4.50 },

  // — Chronic / Cardio (Rx) —
  { name: "Metformin 500mg", brand: "Cipla", category: "Prescription", iconKey: "painTablet", price: 3.20, stock: "rx" },
  { name: "Glucophage XR 750mg", brand: "Merck", category: "Prescription", iconKey: "painTablet", price: 6.80, stock: "rx" },
  { name: "Atenolol 50mg", brand: "AstraZeneca", category: "Prescription", iconKey: "painTablet", price: 2.40, stock: "rx" },
  { name: "Amlodipine 10mg", brand: "Pfizer", category: "Prescription", iconKey: "painTablet", price: 3.10, stock: "rx" },
  { name: "Losartan 50mg", brand: "Merck", category: "Prescription", iconKey: "painTablet", price: 4.20, stock: "rx" },
  { name: "Aspirin Cardio 100mg", brand: "Bayer", category: "OTC", iconKey: "painTablet", price: 2.80 },
  { name: "Simvastatin 20mg", brand: "Cipla", category: "Prescription", iconKey: "painTablet", price: 4.60, stock: "rx" },
  { name: "Lipitor 20mg", brand: "Pfizer", category: "Prescription", iconKey: "painTablet", price: 12.80, stock: "rx" },
  { name: "Plavix 75mg", brand: "Sanofi", category: "Prescription", iconKey: "painTablet", price: 18.40, stock: "rx" },
  { name: "Warfarin 5mg", brand: "BMS", category: "Prescription", iconKey: "painTablet", price: 4.90, stock: "rx" },

  // — Diabetes —
  { name: "Diabetic Test Strips (50ct)", brand: "Accu-Chek", category: "Devices", iconKey: "glucose", price: 18.00, stock: "rx" },
  { name: "Glucometer Accu-Chek Active", brand: "Roche", category: "Devices", iconKey: "glucose", price: 38.00 },
  { name: "Lancets (100ct)", brand: "Accu-Chek", category: "Devices", iconKey: "glucose", price: 7.20 },
  { name: "Insulin Syringes 1ml", brand: "BD", category: "Devices", iconKey: "glucose", price: 5.40 },

  // — Medical Equipment —
  { name: "Omron Blood Pressure Monitor", brand: "Omron", category: "Devices", iconKey: "bp", price: 45.00 },
  { name: "Wrist BP Monitor", brand: "Omron", category: "Devices", iconKey: "bp", price: 28.50 },
  { name: "Digital Infrared Thermometer", brand: "Beurer", category: "Devices", iconKey: "thermometer", price: 22.00 },
  { name: "Oral Digital Thermometer", brand: "Microlife", category: "Devices", iconKey: "thermometer", price: 6.50 },
  { name: "Portable Nebuliser", brand: "Omron", category: "Devices", iconKey: "nebuliser", price: 64.00 },
  { name: "Nebuliser Masks (Pediatric)", brand: "Omron", category: "Devices", iconKey: "nebuliser", price: 8.40 },
  { name: "Foldable Wheelchair", brand: "Drive Medical", category: "Devices", iconKey: "wheelchair", price: 180.00, stock: "branch" },
  { name: "Walking Frame (Adjustable)", brand: "Drive Medical", category: "Devices", iconKey: "wheelchair", price: 62.00, stock: "branch" },
  { name: "Oxygen Concentrator 5L", brand: "Philips", category: "Devices", iconKey: "nebuliser", price: 620.00, stock: "branch" },
  { name: "Pulse Oximeter", brand: "Beurer", category: "Devices", iconKey: "oximeter", price: 19.00 },
  { name: "First Aid Kit (Family)", brand: "Elastoplast", category: "OTC", iconKey: "firstaid", price: 14.50 },

  // — Baby Care —
  { name: "NAN Optipro Stage 1 Formula", brand: "Nestlé", category: "Baby Care", iconKey: "formula", price: 14.20, stock: "low" },
  { name: "S-26 Gold Stage 2", brand: "Wyeth", category: "Baby Care", iconKey: "formula", price: 16.80 },
  { name: "Cerelac Wheat 6m+", brand: "Nestlé", category: "Baby Care", iconKey: "formula", price: 6.40 },
  { name: "Pampers Premium Care (Size 3)", brand: "P&G", category: "Baby Care", iconKey: "nappies", price: 12.50 },
  { name: "Huggies Gold Nappies (Size 4)", brand: "Huggies", category: "Baby Care", iconKey: "nappies", price: 13.80 },
  { name: "Pampers Sensitive Wipes (80ct)", brand: "P&G", category: "Baby Care", iconKey: "wipes", price: 3.60 },
  { name: "Baby Lotion 400ml", brand: "Johnson's", category: "Baby Care", iconKey: "lotion", price: 5.20 },
  { name: "Baby Powder 200g", brand: "Johnson's", category: "Baby Care", iconKey: "lotion", price: 3.80 },
  { name: "Baby Shampoo No-More-Tears", brand: "Johnson's", category: "Baby Care", iconKey: "lotion", price: 4.40 },
  { name: "Gripe Water 150ml", brand: "Woodwards", category: "Baby Care", iconKey: "syrup", price: 4.10 },

  // — Vitamins & Supplements —
  { name: "Redoxon Vitamin C 1000mg", brand: "Bayer", category: "Vitamins", iconKey: "vitc", price: 3.80 },
  { name: "Vitamin D3 1000IU", brand: "Solgar", category: "Vitamins", iconKey: "vitd", price: 8.20 },
  { name: "Centrum Adults Multivitamin", brand: "Pfizer", category: "Vitamins", iconKey: "multivit", price: 14.80 },
  { name: "Berocca Performance", brand: "Bayer", category: "Vitamins", iconKey: "multivit", price: 9.40 },
  { name: "Zinc Supplement 50mg", brand: "Solgar", category: "Vitamins", iconKey: "vitd", price: 6.80 },
  { name: "Fish Oil Omega-3 1000mg", brand: "Solgar", category: "Vitamins", iconKey: "vitd", price: 12.40 },
  { name: "Iron Tablets 65mg", brand: "Cipla", category: "Vitamins", iconKey: "multivit", price: 4.20 },
  { name: "Calcium + D3", brand: "Caltrate", category: "Vitamins", iconKey: "multivit", price: 7.60 },
  { name: "Magnesium 400mg", brand: "Solgar", category: "Vitamins", iconKey: "multivit", price: 8.80 },
  { name: "Vitamin B Complex", brand: "Bayer", category: "Vitamins", iconKey: "multivit", price: 6.20 },
  { name: "Probiotic 20 Billion", brand: "Bioplus", category: "Vitamins", iconKey: "multivit", price: 11.40 },
  { name: "Glucosamine 1500mg", brand: "Solgar", category: "Vitamins", iconKey: "multivit", price: 14.20 },

  // — Personal Care —
  { name: "Colgate Total Toothpaste 100ml", brand: "Colgate", category: "Personal Care", iconKey: "toothpaste", price: 2.60 },
  { name: "Sensodyne Repair & Protect", brand: "GSK", category: "Personal Care", iconKey: "toothpaste", price: 4.80 },
  { name: "Listerine Cool Mint 500ml", brand: "J&J", category: "Personal Care", iconKey: "sanitizer", price: 5.40 },
  { name: "Dettol Antibacterial Soap 100g", brand: "Reckitt", category: "Personal Care", iconKey: "soap", price: 1.60 },
  { name: "Dove Beauty Cream Bar", brand: "Unilever", category: "Personal Care", iconKey: "soap", price: 1.80 },
  { name: "Nivea Body Lotion 400ml", brand: "Nivea", category: "Personal Care", iconKey: "lotion", price: 6.50 },
  { name: "Vaseline Petroleum Jelly 250ml", brand: "Unilever", category: "Personal Care", iconKey: "lotion", price: 3.20 },
  { name: "Sanitiser Gel 500ml", brand: "Dettol", category: "Personal Care", iconKey: "sanitizer", price: 4.40 },
  { name: "Surgical Face Masks (50ct)", brand: "3M", category: "Personal Care", iconKey: "masks", price: 8.00 },
  { name: "N95 Respirator (10ct)", brand: "3M", category: "Personal Care", iconKey: "masks", price: 12.40 },
  { name: "Sunscreen SPF 50+", brand: "Eucerin", category: "Personal Care", iconKey: "sunscreen", price: 14.80 },
  { name: "Hair Shampoo 400ml", brand: "Head & Shoulders", category: "Personal Care", iconKey: "shampoo", price: 5.60 },

  // — Wound Care & First Aid —
  { name: "Betadine Solution 125ml", brand: "Mundipharma", category: "OTC", iconKey: "syrup", price: 4.80 },
  { name: "Hydrogen Peroxide 100ml", brand: "Generic", category: "OTC", iconKey: "syrup", price: 1.40 },
  { name: "Elastoplast Plasters (40ct)", brand: "Elastoplast", category: "OTC", iconKey: "lotion", price: 3.20 },
  { name: "Gauze Bandage 5cm x 5m", brand: "Elastoplast", category: "OTC", iconKey: "lotion", price: 2.40 },
  { name: "Antiseptic Cream 30g", brand: "Savlon", category: "OTC", iconKey: "lotion", price: 3.60 },
  { name: "Cotton Wool 100g", brand: "Generic", category: "OTC", iconKey: "lotion", price: 2.00 },

  // — Eye, ENT, Skin (Rx) —
  { name: "Maxitrol Eye Drops", brand: "Alcon", category: "Prescription", iconKey: "eyedrops", price: 8.20, stock: "rx" },
  { name: "Visine Eye Drops 15ml", brand: "J&J", category: "OTC", iconKey: "eyedrops", price: 4.20 },
  { name: "Otosporin Ear Drops", brand: "GSK", category: "Prescription", iconKey: "eardrops", price: 6.40, stock: "rx" },
  { name: "Daktarin Cream 30g", brand: "J&J", category: "Prescription", iconKey: "lotion", price: 5.80, stock: "rx" },
  { name: "Fucidin Cream 15g", brand: "Leo Pharma", category: "Prescription", iconKey: "lotion", price: 9.60, stock: "rx" },
  { name: "Hydrocortisone 1% Cream", brand: "Cipla", category: "OTC", iconKey: "lotion", price: 4.20 },

  // — Women's Health —
  { name: "Always Ultra Pads (16ct)", brand: "P&G", category: "Personal Care", iconKey: "pads", price: 3.40 },
  { name: "Pregnancy Test Strip", brand: "Clearblue", category: "Devices", iconKey: "pregtest", price: 4.80 },
  { name: "Folic Acid 5mg", brand: "Cipla", category: "Vitamins", iconKey: "multivit", price: 3.20 },
  { name: "Pregnacare Prenatal", brand: "Vitabiotics", category: "Vitamins", iconKey: "multivit", price: 18.40 },

  // — Stomach & Digestion —
  { name: "Eno Fruit Salt (Lemon)", brand: "GSK", category: "OTC", iconKey: "syrup", price: 2.40 },
  { name: "Gaviscon Double Action", brand: "Reckitt", category: "OTC", iconKey: "syrup", price: 5.80 },
  { name: "Imodium 2mg", brand: "J&J", category: "OTC", iconKey: "painTablet", price: 4.20 },
  { name: "Rehidrat Sachets (8ct)", brand: "Adcock", category: "OTC", iconKey: "painTablet", price: 3.60 },
  { name: "Buscopan 10mg", brand: "Sanofi", category: "OTC", iconKey: "painTablet", price: 3.80 },
  { name: "Omeprazole 20mg", brand: "Cipla", category: "Prescription", iconKey: "painTablet", price: 4.60, stock: "rx" },
  { name: "Nexium 40mg", brand: "AstraZeneca", category: "Prescription", iconKey: "painTablet", price: 18.20, stock: "rx" },

  // — Cosmetics / Misc —
  { name: "Lip Balm Strawberry", brand: "Vaseline", category: "Cosmetics", iconKey: "lotion", price: 1.80 },
  { name: "Eucerin Face Cream 50ml", brand: "Eucerin", category: "Cosmetics", iconKey: "lotion", price: 19.40 },
  { name: "Cetaphil Gentle Cleanser", brand: "Galderma", category: "Cosmetics", iconKey: "lotion", price: 16.80 },
  { name: "Sunglasses UV Reading", brand: "Reading Plus", category: "Cosmetics", iconKey: "sunglasses", price: 8.40, stock: "branch" },
];

const stockFor = (r: () => number, override?: Stock): Stock => {
  if (override) return override;
  const roll = r();
  if (roll < 0.06) return "out";
  if (roll < 0.14) return "low";
  return "in";
};

const r0 = rng(20260604);
export const PRODUCTS_ALL: Product[] = SEED.map((s, i) => {
  const icon = ICON[s.iconKey];
  const st = stockFor(r0, s.stock);
  return {
    id: `kp-${String(i + 1).padStart(3, "0")}`,
    name: s.name,
    brand: s.brand,
    price: s.price,
    emoji: icon.emoji,
    color: icon.color,
    stock: st,
    stockCount: st === "low" ? between(r0, 2, 6) : undefined,
    category: s.category,
    description: s.description ?? `${s.name} — high quality healthcare product from ${s.brand}.`,
    dosage: s.dosage,
    manufacturer: s.brand,
    expiry: `${between(r0, 1, 12).toString().padStart(2, "0")}/202${between(r0, 6, 9)}`,
  };
});

// Map id → image
export const PRODUCT_IMAGE: Record<string, string> = Object.fromEntries(
  SEED.map((s, i) => [`kp-${String(i + 1).padStart(3, "0")}`, ICON[s.iconKey].img]),
);

// Featured = first 12
export const FEATURED_PRODUCTS = PRODUCTS_ALL.slice(0, 12);

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
