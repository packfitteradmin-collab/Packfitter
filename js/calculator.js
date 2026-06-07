
const BAGS = [
  // ── Personal item bag ───────────────────────────────────────────────────
  { name:"Personal Item Bag",  category:"personal-item",    capacity:12,  efficiency:0.80, effectiveCapacity:9.60,   bagWeight:0.25, weightLimit:5,  type:"softpack"  },
  { name:"Personal Item Bag",  category:"personal-item",    capacity:15,  efficiency:0.80, effectiveCapacity:12.00,  bagWeight:0.35, weightLimit:7,  type:"softpack"  },
  { name:"Personal Item Bag",  category:"personal-item",    capacity:18,  efficiency:0.80, effectiveCapacity:14.40,  bagWeight:0.45, weightLimit:7,  type:"softpack"  },
  { name:"Personal Item Bag",  category:"personal-item",    capacity:20,  efficiency:0.80, effectiveCapacity:16.00,  bagWeight:0.50, weightLimit:7,  type:"softpack"  },
  { name:"Personal Item Bag",  category:"personal-item",    capacity:22,  efficiency:0.80, effectiveCapacity:17.60,  bagWeight:0.55, weightLimit:7,  type:"softpack"  },
  { name:"Personal Item Bag",  category:"personal-item",    capacity:25,  efficiency:0.80, effectiveCapacity:20.00,  bagWeight:0.60, weightLimit:10, type:"softpack"  },
  // ── Carry-on backpack ────────────────────────────────────────────────────
  { name:"Carry-On Backpack",  category:"backpack",         capacity:25,  efficiency:0.85, effectiveCapacity:21.25, bagWeight:0.70, weightLimit:10, type:"topload"   },
  { name:"Carry-On Backpack",  category:"backpack",         capacity:30,  efficiency:0.85, effectiveCapacity:25.50, bagWeight:0.80, weightLimit:12, type:"topload"   },
  { name:"Carry-On Backpack",  category:"backpack",         capacity:35,  efficiency:0.85, effectiveCapacity:29.75, bagWeight:0.90, weightLimit:12, type:"topload"   },
  { name:"Carry-On Backpack",  category:"backpack",         capacity:40,  efficiency:0.85, effectiveCapacity:34.00, bagWeight:1.00, weightLimit:12, type:"topload"   },
  { name:"Carry-On Backpack",  category:"backpack",         capacity:45,  efficiency:0.85, effectiveCapacity:38.25, bagWeight:1.20, weightLimit:12, type:"topload"   },
  // ── Carry-on suitcase ────────────────────────────────────────────────────
  { name:"Carry-On Suitcase",  category:"suitcase-carryon", capacity:35,  efficiency:0.90, effectiveCapacity:31.50, bagWeight:2.50, weightLimit:10, type:"hardshell" },
  { name:"Carry-On Suitcase",  category:"suitcase-carryon", capacity:40,  efficiency:0.90, effectiveCapacity:36.00, bagWeight:2.80, weightLimit:10, type:"hardshell" },
  { name:"Carry-On Suitcase",  category:"suitcase-carryon", capacity:45,  efficiency:0.90, effectiveCapacity:40.50, bagWeight:3.00, weightLimit:10, type:"hardshell" },
  // ── Checked suitcase ─────────────────────────────────────────────────────
  { name:"Checked Suitcase",   category:"suitcase-checked", capacity:60,  efficiency:0.90, effectiveCapacity:54.00, bagWeight:3.50, weightLimit:23, type:"hardshell" },
  { name:"Checked Suitcase",   category:"suitcase-checked", capacity:70,  efficiency:0.90, effectiveCapacity:63.00, bagWeight:3.80, weightLimit:23, type:"hardshell" },
  { name:"Checked Suitcase",   category:"suitcase-checked", capacity:80,  efficiency:0.90, effectiveCapacity:72.00, bagWeight:4.20, weightLimit:23, type:"hardshell" },
  { name:"Checked Suitcase",   category:"suitcase-checked", capacity:100, efficiency:0.90, effectiveCapacity:90.00, bagWeight:4.80, weightLimit:23, type:"hardshell" },
];

const AIRLINES = [
  // piL/piW/piH = personal-item max dimensions (inches); piLcm/piWcm/piHcm = same in cm
  { name:"American Airlines",   coL:22.0, coW:14.0, coH:9.0, coLcm:55.9, coWcm:35.6, coHcm:22.9, piL:18.0, piW:14.0, piH:8.0,  piLcm:45.0, piWcm:35.0, piHcm:20.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit on domestic routes" },
  { name:"Delta Air Lines",     coL:22.0, coW:14.0, coH:9.0, coLcm:55.9, coWcm:35.6, coHcm:22.9, piL:18.0, piW:14.0, piH:8.0,  piLcm:45.0, piWcm:35.0, piHcm:20.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit on domestic routes" },
  { name:"United Airlines",     coL:22.0, coW:14.0, coH:9.0, coLcm:55.9, coWcm:35.6, coHcm:22.9, piL:17.0, piW:10.0, piH:9.0,  piLcm:43.0, piWcm:25.0, piHcm:22.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit on domestic routes" },
  { name:"Southwest Airlines",  coL:24.0, coW:16.0, coH:10.0,coLcm:61.0, coWcm:40.6, coHcm:25.4, piL:16.25,piW:13.5,piH:8.0,  piLcm:41.0, piWcm:34.0, piHcm:20.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit. Checked bags no longer free as of 2025 (fees apply on most fares)" },
  { name:"JetBlue",             coL:22.0, coW:14.0, coH:9.0, coLcm:55.9, coWcm:35.6, coHcm:22.9, piL:17.0, piW:13.0, piH:8.0,  piLcm:43.0, piWcm:33.0, piHcm:20.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit enforced" },
  { name:"Alaska Airlines",     coL:22.0, coW:14.0, coH:9.0, coLcm:55.9, coWcm:35.6, coHcm:22.9, piL:17.0, piW:13.0, piH:8.0,  piLcm:43.0, piWcm:33.0, piHcm:20.0, weightKg:0,  weightLbs:0,   personalItem:true, note:"No official weight limit enforced" },
  { name:"Frontier Airlines",   coL:24.0, coW:16.0, coH:10.0,coLcm:61.0, coWcm:40.6, coHcm:25.4, piL:18.0, piW:14.0, piH:8.0,  piLcm:46.0, piWcm:35.0, piHcm:20.0, weightKg:10, weightLbs:22,  personalItem:true, note:"Carry-on fee applies unless bundled fare" },
  { name:"Air Canada",          coL:21.7, coW:15.7, coH:9.1, coLcm:55.0, coWcm:40.0, coHcm:23.0, piL:13.0, piW:10.0, piH:6.0,  piLcm:33.0, piWcm:25.0, piHcm:16.0, weightKg:10, weightLbs:22,  personalItem:true, note:"Weight limit applies on international routes" },
  { name:"British Airways",     coL:22.0, coW:17.7, coH:9.8, coLcm:56.0, coWcm:45.0, coHcm:25.0, piL:16.0, piW:12.0, piH:6.0,  piLcm:40.0, piWcm:30.0, piHcm:15.0, weightKg:23, weightLbs:50.7,personalItem:true, note:"Generous weight limit; dimensions strictly enforced" },
  { name:"Lufthansa",           coL:21.7, coW:15.7, coH:9.1, coLcm:55.0, coWcm:40.0, coHcm:23.0, piL:16.0, piW:12.0, piH:4.0,  piLcm:40.0, piWcm:30.0, piHcm:10.0, weightKg:8,  weightLbs:17.6,personalItem:true, note:"Weight limit strictly enforced at gate" },
  { name:"Air France",          coL:21.7, coW:13.8, coH:9.8, coLcm:55.0, coWcm:35.0, coHcm:25.0, piL:16.0, piW:12.0, piH:6.0,  piLcm:40.0, piWcm:30.0, piHcm:15.0, weightKg:12, weightLbs:26.5,personalItem:true, note:"One additional personal item permitted" },
  { name:"Emirates",            coL:21.7, coW:15.0, coH:7.9, coLcm:55.0, coWcm:38.0, coHcm:20.0, piL:15.0, piW:12.0, piH:6.0,  piLcm:38.0, piWcm:30.0, piHcm:15.0, weightKg:7,  weightLbs:15.4,personalItem:true, note:"Strictly enforced; all cabin bags combined under 7kg" },
  { name:"Singapore Airlines",  coL:21.7, coW:15.0, coH:7.9, coLcm:55.0, coWcm:38.0, coHcm:20.0, piL:16.0, piW:12.0, piH:6.0,  piLcm:40.0, piWcm:30.0, piHcm:15.0, weightKg:7,  weightLbs:15.4,personalItem:true, note:"Combined weight of all cabin bags must not exceed 7kg" },
  { name:"Cathay Pacific",      coL:22.0, coW:14.2, coH:9.1, coLcm:56.0, coWcm:36.0, coHcm:23.0, piL:18.0, piW:14.0, piH:8.0,  piLcm:45.0, piWcm:36.0, piHcm:20.0, weightKg:7,  weightLbs:15.4,personalItem:true, note:"Weight limit strictly enforced at boarding" },
  { name:"Ryanair",             coL:21.7, coW:15.7, coH:7.9, coLcm:55.0, coWcm:40.0, coHcm:20.0, piL:15.7, piW:11.8, piH:7.9,  piLcm:40.0, piWcm:30.0, piHcm:20.0, weightKg:10, weightLbs:22,  personalItem:true, note:"Priority boarding required for full-size cabin bag" },
  { name:"Qantas",              coL:22.0, coW:14.2, coH:9.1, coLcm:56.0, coWcm:36.0, coHcm:23.0, piL:18.0, piW:14.0, piH:8.0,  piLcm:45.0, piWcm:36.0, piHcm:20.0, weightKg:7,  weightLbs:15.4,personalItem:true, note:"Personal item included within total weight allowance" },
  { name:"KLM",                 coL:21.7, coW:13.8, coH:9.8, coLcm:55.0, coWcm:35.0, coHcm:25.0, piL:16.0, piW:12.0, piH:6.0,  piLcm:40.0, piWcm:30.0, piHcm:15.0, weightKg:12, weightLbs:26.5,personalItem:true, note:"Hand luggage and personal item combined under 12kg" },
  { name:"Turkish Airlines",    coL:21.7, coW:15.7, coH:7.9, coLcm:55.0, coWcm:40.0, coHcm:20.0, piL:16.0, piW:12.0, piH:6.0,  piLcm:40.0, piWcm:30.0, piHcm:15.0, weightKg:8,  weightLbs:17.6,personalItem:true, note:"Economy class standard; enforced at check-in" },
  { name:"EasyJet",             coL:22.0, coW:17.7, coH:9.8, coLcm:56.0, coWcm:45.0, coHcm:25.0, piL:17.7, piW:14.2, piH:7.9,  piLcm:45.0, piWcm:36.0, piHcm:20.0, weightKg:15, weightLbs:33.1,personalItem:true, note:"Large cabin bag requires reserved overhead bin fee" },
];

const ITEMS = {
  "Tops":              { baseVolume:1.10, weight:0.15, cFactor:0.85, gTax:1.00, rigid:false, clothing:true },
  "Underwear":            { baseVolume:0.25, weight:0.05, cFactor:0.85, gTax:1.00, rigid:false, clothing:true },
  "Socks":                { baseVolume:0.40, weight:0.08, cFactor:0.85, gTax:1.00, rigid:false, clothing:true },
  "Bottoms":         { baseVolume:2.20, weight:0.40, cFactor:0.85, gTax:1.00, rigid:false, clothing:true },
  "Jeans":                { baseVolume:3.80, weight:0.70, cFactor:0.90, gTax:1.05, rigid:false, clothing:true },
  "Shorts":               { baseVolume:1.20, weight:0.25, cFactor:0.85, gTax:1.00, rigid:false, clothing:true },
  "Dress Shirt":          { baseVolume:0.40, weight:0.20, cFactor:0.90, gTax:1.05, rigid:false, clothing:true },
  "Sweater":              { baseVolume:4.00, weight:0.45, cFactor:0.75, gTax:1.00, rigid:false, clothing:true },
  "Insulated Jacket":     { baseVolume:4.70, weight:0.60, cFactor:0.60, gTax:1.00, rigid:false, outerwear:true, softOuterwear:true },
  "Insulated Mid Layer":   { baseVolume:3.50, weight:0.55, cFactor:0.65, gTax:1.00, rigid:false, outerwear:true, softOuterwear:true },
  "Fleece Jacket":        { baseVolume:1.80, weight:0.50, cFactor:0.75, gTax:1.00, rigid:false, outerwear:true, softOuterwear:true },
  "Light Layer":          { baseVolume:2.00, weight:0.40, cFactor:0.75, gTax:1.00, rigid:false, outerwear:true, softOuterwear:true },
  "Mid Layer":            { baseVolume:4.50, weight:0.50, cFactor:0.80, gTax:1.00, rigid:false, outerwear:true, softOuterwear:true },
  "Shoes":             { baseVolume:6.50, weight:0.70, cFactor:1.00, gTax:1.15, rigid:false, shoe:true },
  "Sandals":              { baseVolume:1.20, weight:0.40, cFactor:1.00, gTax:1.10, rigid:false, shoe:true },
  "Boots":                { baseVolume:7.50, weight:1.20, cFactor:1.00, gTax:1.25, rigid:true,  shoe:true },
  "Dress Shoes":          { baseVolume:6.50, weight:0.90, cFactor:1.00, gTax:1.20, rigid:true,  shoe:true },
  "Toiletry Kit":    { baseVolume:2.00, weight:0.80, cFactor:0.95, gTax:1.05, rigid:false },
  "Hard Toiletry Kit":    { baseVolume:2.80, weight:0.90, cFactor:1.00, gTax:1.15, rigid:true },
  "Laptop 13in":          { baseVolume:2.00, weight:1.40, cFactor:1.00, gTax:1.20, rigid:true,  electronics:true },
  "Laptop Charger":       { baseVolume:0.40, weight:0.30, cFactor:1.00, gTax:1.05, rigid:false, electronics:true },
  "Phone Charger":        { baseVolume:0.10, weight:0.10, cFactor:1.00, gTax:1.00, rigid:false, electronics:true },
  "Power Bank":           { baseVolume:0.40, weight:0.30, cFactor:1.00, gTax:1.05, rigid:true,  electronics:true },
  "Over-Ear Headphones":  { baseVolume:1.50, weight:0.30, cFactor:1.00, gTax:1.25, rigid:true,  electronics:true },
  "Earbuds and Case":     { baseVolume:0.20, weight:0.07, cFactor:1.00, gTax:1.05, rigid:true,  electronics:true },
  "Camera":               { baseVolume:2.50, weight:0.80, cFactor:1.00, gTax:1.25, rigid:true,  electronics:true },
  "Travel Towel":         { baseVolume:1.00, weight:0.25, cFactor:0.75, gTax:1.00, rigid:false },
  "Travel Pillow":        { baseVolume:2.50, weight:0.20, cFactor:0.60, gTax:1.00, rigid:false },
  "Sunglasses and Case":  { baseVolume:0.40, weight:0.10, cFactor:1.00, gTax:1.10, rigid:true },
  "Kindle or Book":       { baseVolume:0.40, weight:0.20, cFactor:1.00, gTax:1.05, rigid:true },
  "Reusable Water Bottle":{ baseVolume:1.00, weight:0.20, cFactor:1.00, gTax:1.15, rigid:true, waterBottle:true },
  "Camera Bag":           { baseVolume:6.00, weight:1.20, cFactor:1.00, gTax:1.20, rigid:true },
  "Lens Case":            { baseVolume:2.50, weight:0.60, cFactor:1.00, gTax:1.15, rigid:true },
  // ── Formalwear ───────────────────────────────────────────────────────────
  // Blazer/sport coat: structure-sensitive, does not compress well in cubes,
  // not subject to packing-profile multiplier (you bring 1 regardless).
  // cFactor 0.90 = slight compression possible in garment folder.
  // gTax 1.15 = does not tetris-pack well (shape-sensitive).
  "Blazer":               { baseVolume:4.50, weight:0.55, cFactor:0.90, gTax:1.15, rigid:false, formalwear:true },
};

const SIZE_MULTIPLIER = { XS:0.85, S:0.90, M:1.00, L:1.10, XL:1.20, XXL:1.30 };

const PROFILE_MULTIPLIERS = {
  ultralight: 0.70,
  light:      0.85,
  standard:   1.05,
  heavy:      1.30
};

const CLOTHING_MULTIPLIER_TARGETS = new Set([
  "Tops", "Bottoms", "Shorts", "Mid Layer", "Underwear", "Socks"
]);

const CUBE_FACTOR = 0.85;

function calcVp(itemName, qty, mSize, worn) {
  const item = ITEMS[itemName];
  if (!item) return { volume:0, weight:0, rigid:false, name:itemName, worn:!!worn, qty:qty, item:null };
  const ms = item.clothing ? mSize : 1.00;
  const vp = item.baseVolume * ms * item.cFactor * item.gTax * qty;
  const w  = item.weight * qty;
  return { volume: worn ? 0 : vp, weight:w, rigid:item.rigid, item:item, mSize:ms, qty:qty, worn:!!worn, name:itemName };
}

function isCubeEligible(entry) {
  if (entry.worn) return false;
  const item = entry.item;
  if (!item) return false;
  if (item.shoe || item.electronics || item.rigid) return false;
  if (item.name === "Hard Toiletry Kit") return false;
  if (item.clothing || item.softOuterwear) return true;
  return false;
}

function buildItemList(profile, tripDays, climate, laundry, mSize, includeLaptop, shoeList, includeBulkyLayer, blazerMode) {
  const entries = [];
  const packMult = PROFILE_MULTIPLIERS[profile] !== undefined ? PROFILE_MULTIPLIERS[profile] : 1.05;

  function add(name, qty, worn) {
    const entry = calcVp(name, qty, mSize, !!worn);
    if (!entry.worn && CLOTHING_MULTIPLIER_TARGETS.has(name)) { entry.volume *= packMult; }
    entries.push(entry);
  }

  let shirts, underwear, socks, pants;
  if (laundry === "NO") {
    shirts = tripDays; underwear = tripDays; socks = tripDays;
    pants  = Math.ceil(tripDays / 3);
  } else if (tripDays <= 4) {
    shirts = tripDays; underwear = tripDays; socks = tripDays;
    pants  = Math.ceil(tripDays / 3);
  } else if (tripDays <= 7) {
    shirts = 4; underwear = 5; socks = 5;
    pants  = Math.ceil(tripDays / 4);
  } else {
    shirts = 5;
    underwear = 5;
    socks = 5;
    pants = (climate === "COLD") ? 3 : 2;
  }

  add("Tops",   shirts);
  add("Underwear", underwear);
  add("Socks",     socks);
  if (climate === "WARM") {
    add("Shorts", pants);
    add("Bottoms", 1);
  } else {
    add("Bottoms", pants);
  }

  if (climate === "WARM") {
    if (profile !== "light") { add("Light Layer", 1); }
  } else if (climate === "MILD") {
    if (profile === "heavy") { add("Insulated Mid Layer", 1); } else { add("Mid Layer", 1); }
  } else if (climate === "COLD") {
    add("Insulated Mid Layer", 1);
    add("Insulated Jacket", 1, true);
  }

  add("Shoes", 1, true);
  add("Toiletry Kit", 1);
  add("Phone Charger", 1);

  if (includeLaptop) {
    add("Laptop 13in", 1);
    add("Laptop Charger", 1);
    add("Power Bank", 1);
    add("Earbuds and Case", 1);
  }

  if (includeBulkyLayer) { add("Insulated Jacket", 1); }

  const SHOE_ITEM_MAP = { "compact": "Sandals", "standard": "Shoes", "bulky": "Boots" };
  for (let i = 0; i < shoeList.length; i++) { add(SHOE_ITEM_MAP[shoeList[i]] || "Shoes", 1); }

  // Blazer / sport coat — "packed" adds full volume, "worn" adds weight only
  if (blazerMode === "packed") { add("Blazer", 1, false); }
  if (blazerMode === "worn")  { add("Blazer", 1, true); }

  return entries;
}

function runEngine(bag, airline, personalItem, profile, tripDays, climate, laundry, clothingSize, includeLaptop, shoeList, includeBulkyLayer, blazerMode) {
  const mSize = SIZE_MULTIPLIER[clothingSize] || 1.0;
  const entries = buildItemList(profile, tripDays, climate, laundry, mSize, includeLaptop, shoeList, includeBulkyLayer, blazerMode || "none");

  let vtotal = 0, wTotal = bag.bagWeight, vRigid = 0;
  for (const e of entries) {
    if (ITEMS[e.name] && ITEMS[e.name].waterBottle) { wTotal += e.weight; continue; }
    vtotal += e.volume;
    wTotal += e.weight;
    if (e.rigid && !e.worn) vRigid += e.volume;
  }
  vtotal *= 1.15;

  let adjustedCapacity = bag.effectiveCapacity;
  if (personalItem) adjustedCapacity += 25;

  const weightLimit = airline.weightKg;
  let weightConflict = weightLimit > 0 && wTotal > weightLimit;
  const rigidRatio = vRigid / adjustedCapacity;
  const geometryConflict = rigidRatio > 0.60;

  function calcWithCubes() {
    let cubeTotal = 0;
    for (const e of entries) {
      if (ITEMS[e.name] && ITEMS[e.name].waterBottle) continue;
      if (isCubeEligible(e)) {
        const item = e.item;
        const ms = item.clothing ? mSize : 1.00;
        cubeTotal += item.baseVolume * ms * item.cFactor * CUBE_FACTOR * item.gTax * e.qty;
      } else { cubeTotal += e.volume; }
    }
    return cubeTotal * 1.15;
  }

  let resultState, compressionMsg = "";
  if (weightConflict) {
    resultState = "WEIGHT_CONFLICT";
  } else if (geometryConflict) {
    resultState = "GEOMETRY_CONFLICT";
  } else if (vtotal > adjustedCapacity) {
    if (vtotal <= adjustedCapacity * 1.10) {
      resultState = "COMPRESSION_REQUIRED";
      compressionMsg = "This is a tight fit. Compression cubes or careful packing should resolve it.";
    } else {
      const vtotalCubes = calcWithCubes();
      if (vtotalCubes <= adjustedCapacity) {
        resultState = "COMPRESSION_REQUIRED";
        compressionMsg = "Using compression cubes would reduce soft-item volume and allow this setup to fit.";
      } else { resultState = "DOES_NOT_FIT"; }
    }
  } else { resultState = "FIT"; }

  const remainingVolume = adjustedCapacity - vtotal;
  const remainingWeight = weightLimit > 0 ? weightLimit - wTotal : null;
  const volumeUsage     = vtotal / adjustedCapacity;

  let fitResult, visualState;
  if (resultState === "FIT") {
    fitResult = volumeUsage <= 0.80 ? "FITS" : "FITS_TIGHT_CLOSE";
    visualState = "green";
  } else if (resultState === "COMPRESSION_REQUIRED") {
    fitResult = "FITS_TIGHT"; visualState = "yellow";
  } else {
    fitResult = "DOES_NOT_FIT"; visualState = "red";
  }

  let practicality = "MEDIUM", practicalityMsg = "";
  if (vtotal > adjustedCapacity * 1.25) {
    practicality = "VERY_LOW"; practicalityMsg = "A larger bag or personal item overflow is the more realistic option.";
  } else if (tripDays >= 10 && laundry === "NO" && adjustedCapacity <= 40) {
    practicality = "VERY_LOW"; practicalityMsg = "This setup is not practical for carry-on-only travel.";
  } else if (climate === "COLD" && adjustedCapacity <= 35) {
    practicality = "LOW"; practicalityMsg = "Cold-weather gear makes small-bag travel difficult.";
  } else if (adjustedCapacity <= 30 && tripDays >= 4) {
    practicality = "LOW"; practicalityMsg = "This setup requires very efficient packing for the bag size and trip length.";
  } else if (adjustedCapacity >= 35 && adjustedCapacity <= 40 && tripDays >= 3 && tripDays <= 7) {
    practicality = "HIGH"; practicalityMsg = "This is a typical carry-on travel setup.";
  }

  let placement;
  if (bag.category === "personal-item") {
    placement = "PERSONAL_ITEM";     // PI bags are always personal items — skip flex logic
  } else {
    const isFlexibleSize = bag.capacity <= 25;
    if (isFlexibleSize) {
      // 25L bags can function as personal item OR compact carry-on depending on packing
      if (rigidRatio > 0.40 || vtotal > bag.effectiveCapacity * 0.85) {
        placement = "FLEX_CARRY_ON";   // packed bulky/rigid — more like a small carry-on
      } else {
        placement = "FLEX_PERSONAL";   // light/soft — typically works as a personal item
      }
    }
    else if (bag.capacity <= 50) placement = "CARRY_ON";
    else placement = "TOO_LARGE";
  }

  const showWarning = vtotal > adjustedCapacity || weightConflict || geometryConflict ||
    (tripDays >= 10 && climate === "COLD" && laundry === "NO" && adjustedCapacity <= 40);

  const suggestions = [];
  if (fitResult !== "FITS") {
    if (vtotal > adjustedCapacity) suggestions.push("Reduce packed clothing volume — this is the main constraint");
    if (geometryConflict) suggestions.push(bag.category === "personal-item" ? "Rigid items take up disproportionate space in a personal item — reduce rigid gear or consider a carry-on" : "Too many rigid items — move tech or shoes to a personal item");
    if (weightLimit > 0 && wTotal > weightLimit) suggestions.push("Weight exceeds airline limits — reduce heavy items");
    suggestions.push("Wear your bulkiest items during transit");
    if (practicality === "VERY_LOW") suggestions.push(bag.category === "suitcase-checked" ? "Consider a larger checked bag for this setup" : (bag.category === "personal-item" ? "Consider a larger personal item or stepping up to a carry-on backpack" : "Consider shifting items to a personal item or stepping up to a larger carry-on"));
    if (bag.capacity < 50 && bag.category !== "suitcase-checked" && bag.category !== "personal-item") suggestions.push("A larger carry-on bag could resolve the volume shortfall within " + airline.name + "'s carry-on limit");
  }

  return {
    resultState, fitResult, visualState, placement,
    vtotal, adjustedCapacity, volumeUsage,
    vRigid, rigidRatio,
    wTotal, weightLimit, remainingVolume, remainingWeight,
    practicality, practicalityMsg,
    showWarning, suggestions, compressionMsg,
    weightConflict, geometryConflict,
    entries,
  };
}







var AIRLINE_NOTE_TEXT = (typeof window.AIRLINE_NOTE_TEXT !== "undefined") ? window.AIRLINE_NOTE_TEXT : "Packed external dimensions set fit, not the bag's listed capacity. Bag structure sets whether dimensions stay within the carry-on box.";

var PAGE_CLUSTER                    = (typeof window.PAGE_CLUSTER !== "undefined") ? window.PAGE_CLUSTER : "FIT_EASY";
var PAGE_DEFAULT_BAG_TYPE           = (typeof window.PAGE_DEFAULT_BAG_TYPE !== "undefined") ? window.PAGE_DEFAULT_BAG_TYPE : "backpack";
var PAGE_DEFAULT_BAG_SIZE           = (typeof window.PAGE_DEFAULT_BAG_SIZE !== "undefined") ? window.PAGE_DEFAULT_BAG_SIZE : 30;
var PAGE_DEFAULT_AIRLINE            = (typeof window.PAGE_DEFAULT_AIRLINE !== "undefined") ? window.PAGE_DEFAULT_AIRLINE : "Delta Air Lines";
var PAGE_DEFAULT_TRIP_DAYS          = (typeof window.PAGE_DEFAULT_TRIP_DAYS !== "undefined") ? window.PAGE_DEFAULT_TRIP_DAYS : 3;
var PAGE_DEFAULT_CLIMATE            = (typeof window.PAGE_DEFAULT_CLIMATE !== "undefined") ? window.PAGE_DEFAULT_CLIMATE : "WARM";
var PAGE_DEFAULT_PROFILE            = (typeof window.PAGE_DEFAULT_PROFILE !== "undefined") ? window.PAGE_DEFAULT_PROFILE : "light";
var PAGE_DEFAULT_LAUNDRY            = (typeof window.PAGE_DEFAULT_LAUNDRY !== "undefined") ? window.PAGE_DEFAULT_LAUNDRY : "NO";
var PAGE_DEFAULT_INCLUDE_LAPTOP     = (typeof window.PAGE_DEFAULT_INCLUDE_LAPTOP !== "undefined") ? window.PAGE_DEFAULT_INCLUDE_LAPTOP : false;
var PAGE_DEFAULT_INCLUDE_BULKY_LAYER = (typeof window.PAGE_DEFAULT_INCLUDE_BULKY_LAYER !== "undefined") ? window.PAGE_DEFAULT_INCLUDE_BULKY_LAYER : false;
var PAGE_DEFAULT_EXTRA_SHOES        = (typeof window.PAGE_DEFAULT_EXTRA_SHOES !== "undefined") ? window.PAGE_DEFAULT_EXTRA_SHOES : 0;
var PAGE_DEFAULT_SHOE_TYPE          = (typeof window.PAGE_DEFAULT_SHOE_TYPE !== "undefined") ? window.PAGE_DEFAULT_SHOE_TYPE : "standard";
var PAGE_DEFAULT_CLOTHING_SIZE      = (typeof window.PAGE_DEFAULT_CLOTHING_SIZE !== "undefined") ? window.PAGE_DEFAULT_CLOTHING_SIZE : "M";
var PAGE_DEFAULT_PERSONAL_ITEM      = (typeof window.PAGE_DEFAULT_PERSONAL_ITEM !== "undefined") ? window.PAGE_DEFAULT_PERSONAL_ITEM : false;
var PAGE_IS_BAG_SPECIFIC            = (typeof window.PAGE_IS_BAG_SPECIFIC !== "undefined") ? window.PAGE_IS_BAG_SPECIFIC : true;
var PAGE_CHECKED_BAG_CONTEXT        = (typeof window.PAGE_CHECKED_BAG_CONTEXT !== "undefined") ? window.PAGE_CHECKED_BAG_CONTEXT : "";
var PAGE_DEFAULT_BLAZER_MODE        = (typeof window.PAGE_DEFAULT_BLAZER_MODE !== "undefined") ? window.PAGE_DEFAULT_BLAZER_MODE : "none";

// ── Cluster scenario system ─────────────────────────────────────────────────
const CLUSTER_SCENARIOS = {
  FIT_EASY: {
    tripDays: 3, profile: "light", climate: "WARM", laundry: "NO",
    includeLaptop: false, includeExtraShoes: false, clusterLabel: "FIT_EASY",
    getDescription: function(pct, bag, airline) {
      return "A 3-day warm-weather trip uses ~" + pct + "% of this bag — well within " + airline.name + "'s carry-on limit with meaningful room to spare.";
    }
  },
  FIT_NEAR_LIMIT: {
    tripDays: 7, profile: "heavy", climate: "MILD", laundry: "NO",
    includeLaptop: false, includeExtraShoes: false, clusterLabel: "FIT_NEAR_LIMIT",
    getDescription: function(pct, bag, airline) {
      return "Seven days of heavy packing without laundry loads this bag to ~" + pct + "% — within " + airline.name + "'s carry-on limit, but with very little margin.";
    }
  },
  COMPRESSION_REQUIRED: {
    tripDays: 7, profile: "heavy", climate: "COLD", laundry: "NO",
    includeLaptop: true, includeExtraShoes: false, clusterLabel: "COMPRESSION_REQUIRED",
    getDescription: function(pct, bag, airline) {
      return "Cold-weather gear and a laptop push this " + bag.capacity + "L past usable capacity — compression cubes bring it within range for " + airline.name + ".";
    }
  },
  COMPRESSION_REQUIRED_LARGE: {
    tripDays: 8, profile: "heavy", climate: "COLD", laundry: "NO",
    includeLaptop: true, includeExtraShoes: true, clusterLabel: "COMPRESSION_REQUIRED",
    getDescription: function(pct, bag, airline) {
      return "An 8-day cold-weather trip with a laptop and extra shoes exceeds raw capacity — compression packing resolves it within " + airline.name + "'s carry-on limit.";
    }
  },
  DOES_NOT_FIT: {
    tripDays: 10, profile: "heavy", climate: "COLD", laundry: "NO",
    includeLaptop: true, includeExtraShoes: true, clusterLabel: "DOES_NOT_FIT",
    getDescription: function(pct, bag, airline) {
      return "A 10-day cold-weather trip with a full laptop kit exceeds this bag's capacity — even with compression, it doesn't fit within " + airline.name + "'s carry-on limit.";
    }
  },
  GEOMETRY_EDGE: {
    tripDays: 5, profile: "standard", climate: "MILD", laundry: "NO",
    includeLaptop: false, includeExtraShoes: false, clusterLabel: "GEOMETRY_EDGE",
    getDescription: function(pct, bag, airline) {
      return "Five days of standard gear loads this bag to ~" + pct + "% — within " + airline.name + "'s carry-on limit, with bag structure as the primary carry-on variable.";
    }
  },
  FIT_NEAR_LIMIT_WARM: {
    tripDays: 7, profile: "heavy", climate: "WARM", laundry: "NO",
    includeLaptop: false, includeExtraShoes: false, clusterLabel: "FIT_NEAR_LIMIT",
    getDescription: function(pct, bag, airline) {
      return "Seven days of heavy warm-weather packing without laundry loads this bag to ~" + pct + "% — within " + airline.name + "'s carry-on limit but with limited margin.";
    }
  }
};

function renderScenarioBlock() {
  var el = document.getElementById("scenario");
  if (!el) return;
  var clusterDef = CLUSTER_SCENARIOS[PAGE_CLUSTER];
  if (!clusterDef) return;

  var bag     = BAGS.find(function(b) { return b.category === PAGE_DEFAULT_BAG_TYPE && b.capacity === PAGE_DEFAULT_BAG_SIZE; }) || BAGS[0];
  var airline = AIRLINES.filter(function(a) { return a.name === PAGE_DEFAULT_AIRLINE; })[0] || AIRLINES[0];

  var r = runEngine(bag, airline, false,
    clusterDef.profile, clusterDef.tripDays, clusterDef.climate, clusterDef.laundry,
    "M", clusterDef.includeLaptop, clusterDef.includeExtraShoes ? ["standard"] : [], false);

  var rawPct  = Math.round(r.volumeUsage * 100);
  var pctLow  = Math.max(0, rawPct - 3);
  var pctHigh = Math.min(140, rawPct + 3);
  var pctBand = pctLow + "\u2013" + pctHigh + "%";

  var resultLabel, resultColor;
  if      (r.resultState === "DOES_NOT_FIT")         { resultLabel = "DOES NOT FIT";         resultColor = "#dc2626"; }
  else if (r.resultState === "COMPRESSION_REQUIRED") { resultLabel = "COMPRESSION REQUIRED"; resultColor = "#b45309"; }
  else if (r.resultState === "WEIGHT_CONFLICT")      { resultLabel = "WEIGHT ISSUE";         resultColor = "#7c3aed"; }
  else if (r.resultState === "GEOMETRY_CONFLICT")    { resultLabel = "GEOMETRY ISSUE";       resultColor = "#7c3aed"; }
  else if (r.volumeUsage > 0.80)                     { resultLabel = "FITS \u2014 NEAR CAPACITY"; resultColor = "#b45309"; }
  else                                               { resultLabel = "FITS";                 resultColor = "#15803d"; }

  var addons = [];
  if (clusterDef.includeLaptop)     addons.push("laptop");
  if (clusterDef.includeExtraShoes) addons.push("extra shoes");
  var addonStr = addons.length ? addons.join(" + ") : "none";

  var desc = clusterDef.getDescription(rawPct, bag, airline);
  var climateStr = clusterDef.climate.charAt(0) + clusterDef.climate.slice(1).toLowerCase();

  el.innerHTML =
    '<p class="section-label" style="color:#3b82f6;">Typical Scenario</p>' +
    '<ul style="list-style:none;padding:0 0 0 14px;margin:0 0 18px;border-left:3px solid #e5e7eb;">' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Bag: ' + bag.capacity + 'L ' + bag.category.replace('suitcase-carryon','carry-on suitcase').replace('suitcase-checked','checked suitcase') + '</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Airline: ' + airline.name + '</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Trip length: ' + clusterDef.tripDays + ' days</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Packing style: ' + clusterDef.profile + '</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Climate: ' + climateStr + '</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Laundry: ' + clusterDef.laundry.toLowerCase() + '</li>' +
      '<li style="font-size:0.88rem;color:#444;padding:3px 0;">Add-ons: ' + addonStr + '</li>' +
    '</ul>' +
    '<p class="section-label">Result</p>' +
    '<p style="font-size:0.9rem;line-height:1.7;margin-bottom:3px;">\u2192 <strong style="color:' + resultColor + ';">' + resultLabel + '</strong></p>' +
    '<p style="font-size:0.9rem;color:#1a1a1a;line-height:1.7;margin-bottom:3px;">\u2192 ~' + pctBand + ' of ' + bag.capacity + 'L capacity used</p>' +
    '<p style="font-size:0.9rem;color:#555;line-height:1.6;">\u2192 ' + desc + '</p>' +
    '<p style="font-size:0.88rem;color:#6b7280;margin-top:20px;padding-top:16px;border-top:1px solid #f3f4f6;font-style:italic;">Your trip may be different \u2014 adjust your setup below:</p>';
}

function populateBagSizes() {
  var bagType = document.getElementById("bagType").value;
  var sizeSel = document.getElementById("bagSize");
  sizeSel.innerHTML = "";
  var SIZE_MAP = {
    "personal-item":     [12, 15, 18, 20, 22, 25],
    "backpack":          [25, 30, 35, 40, 45],
    "suitcase-carryon":  [35, 40, 45],
    "suitcase-checked":  [60, 70, 80, 100]
  };
  (SIZE_MAP[bagType] || [30]).forEach(function(size) {
    var opt = document.createElement("option");
    opt.value = size;
    opt.textContent = size + "L";
    sizeSel.appendChild(opt);
  });
}

function applyPageDefaults() {
  // Helper: safely set a form element's value/checked if it exists
  function setVal(id, val) { var el = document.getElementById(id); if (el) el.value = val; }
  function setChk(id, val) { var el = document.getElementById(id); if (el) el.checked = val; }

  setVal("tripDays", String(PAGE_DEFAULT_TRIP_DAYS));
  setVal("climate", PAGE_DEFAULT_CLIMATE);
  setVal("profile", PAGE_DEFAULT_PROFILE);
  setVal("laundry", PAGE_DEFAULT_LAUNDRY);
  setVal("clothingSize", PAGE_DEFAULT_CLOTHING_SIZE);
  setChk("includeLaptop", PAGE_DEFAULT_INCLUDE_LAPTOP);
  setChk("includeBulkyLayer", PAGE_DEFAULT_INCLUDE_BULKY_LAYER);
  setVal("extraShoes", String(PAGE_DEFAULT_EXTRA_SHOES));
  updateShoeType();
  if (PAGE_DEFAULT_EXTRA_SHOES > 0) {
    var st1d = document.getElementById("shoeType1"); if (st1d) st1d.value = PAGE_DEFAULT_SHOE_TYPE;
  }
  setChk("personalItem", PAGE_DEFAULT_PERSONAL_ITEM);
  setVal("blazerMode", PAGE_DEFAULT_BLAZER_MODE);
}

function populateSelects() {
  document.getElementById("bagType").value = PAGE_DEFAULT_BAG_TYPE;
  populateBagSizes();
  document.getElementById("bagSize").value = String(PAGE_DEFAULT_BAG_SIZE);
  const airlineSel = document.getElementById("airline");
  AIRLINES.forEach((a, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = a.name;
    if (a.name === PAGE_DEFAULT_AIRLINE) opt.selected = true;
    airlineSel.appendChild(opt);
  });
}

function computeVolumeInterpretation(vtotal, effectiveSystemCapacity, statedSystemCapacity, hasPersonalItem, bagType) {
  var isChecked = bagType === "suitcase-checked";
  var isPI = bagType === "personal-item";
  if (vtotal <= effectiveSystemCapacity) {
    if (isPI) return { cls: "green", text: "Fits this personal item \u2014 should fit under the seat." };
    return { cls: "green", text: isChecked ? "Fits this checked bag \u2014 plenty of room for this setup." : "Carry-on viable \u2014 this setup fits within your carry-on system." };
  } else if (vtotal <= statedSystemCapacity) {
    if (isPI) return { cls: "yellow", text: "Tight personal-item fit \u2014 should work with efficient packing." };
    return { cls: "yellow", text: isChecked ? "Tight fit \u2014 this setup should fit with efficient packing." : "Tight fit \u2014 this setup should fit your carry-on system with efficient packing." };
  } else if (vtotal <= statedSystemCapacity * 1.10) {
    if (isPI) return { cls: "yellow", text: "Very tight \u2014 at the edge of this personal item. A larger bag or carry-on may help." };
    var tip = isChecked ? "Consider a larger checked bag." : (hasPersonalItem ? "Consider a larger carry-on." : "A personal item or larger carry-on may help.");
    return { cls: "yellow", text: isChecked ? "Very tight \u2014 at the edge of this checked bag. " + tip : "Very tight \u2014 at the edge of your carry-on system. " + tip };
  } else {
    if (isPI) return { cls: "red", text: "Exceeds this personal item \u2014 a carry-on backpack (25\u201335L) is recommended for this setup." };
    var rec = isChecked ? "A larger checked bag is recommended." : (hasPersonalItem ? "A larger carry-on or checked bag is recommended." : "A personal item, larger carry-on, or checked bag is recommended.");
    return { cls: "red", text: isChecked ? "Exceeds this checked bag \u2014 " + rec : "Exceeds carry-on system \u2014 " + rec };
  }
}

function computeBagRanges(vtotal, personalItem, bagType, selectedBagSize) {
  var isChecked = bagType === "suitcase-checked";
  var isPI = bagType === "personal-item";
  var PI_CAP = personalItem ? 25 : 0;

  // Personal item primary: recommend within PI sizes, then suggest carry-on upgrade
  if (isPI) {
    var piOptions = [
      { size: 12, ec: 9.60 }, { size: 15, ec: 12.00 }, { size: 18, ec: 14.40 },
      { size: 20, ec: 16.00 }, { size: 22, ec: 17.60 }, { size: 25, ec: 20.00 }
    ];
    var piCap = personalItem ? 25 : 0;
    var minPI = piOptions.find(function(b) { return (b.ec + piCap) >= vtotal; });
    if (minPI) {
      var comfortPI = piOptions.find(function(b) { return (vtotal / (b.ec + piCap)) <= 0.78; });
      var best = minPI.size + "L";
      var comfort = comfortPI && comfortPI.size > minPI.size ? comfortPI.size + "L" : null;
      return { bestFit: best, bestFitNote: null, comfortable: comfort, checked: null };
    }
    // No PI size works — suggest carry-on
    return { bestFit: null, bestFitNote: null, comfortable: null, checked: "25–35L carry-on" };
  }

  var carryOnOptions = [
    { size: 25, ec: 21.25 }, { size: 30, ec: 25.50 }, { size: 35, ec: 29.75 },
    { size: 40, ec: 34.00 }, { size: 45, ec: 38.25 }
  ];
  var checkedOptions = [
    { size: 60, ec: 54.00 }, { size: 70, ec: 63.00 },
    { size: 80, ec: 72.00 }, { size: 100, ec: 90.00 }
  ];

  // For checked suitcases, recommend within checked sizes only
  if (isChecked) {
    var minChecked = checkedOptions.find(function(b) { return b.ec >= vtotal; });
    var comfortChecked = checkedOptions.find(function(b) { return (vtotal / b.ec) <= 0.78; });
    var bestSize = minChecked ? minChecked.size + "L" : null;
    var comfortSize = comfortChecked && minChecked && comfortChecked.size > minChecked.size ? comfortChecked.size + "L" : null;
    return { bestFit: bestSize, bestFitNote: null, comfortable: comfortSize, checked: bestSize ? null : "100L+" };
  }

  // Look up the selected bag's effective capacity
  var selectedBag = carryOnOptions.find(function(b) { return b.size === selectedBagSize; });
  var selectedEC = selectedBag ? selectedBag.ec : 0;

  // Check if the selected bag works on its own
  var selectedFitsBagOnly = selectedEC >= vtotal;
  // Check if the selected bag works with a personal item
  var selectedFitsWithPI = (selectedEC + 25) >= vtotal;

  // Find smallest carry-on that works bag-only
  var minBagOnly = carryOnOptions.find(function(b) { return b.ec >= vtotal; });
  // Comfortable: usage <= 78% of system capacity
  var comfortBagOnly = carryOnOptions.find(function(b) { return (vtotal / (b.ec + PI_CAP)) <= 0.78; });

  // CASE A: Selected bag works on its own
  if (selectedFitsBagOnly) {
    var best = selectedBagSize + "L";
    var comfort = comfortBagOnly && comfortBagOnly.size > selectedBagSize ? comfortBagOnly.size + "L" : null;
    return { bestFit: best, bestFitNote: null, comfortable: comfort, checked: null };
  }

  // CASE B: Selected bag does NOT work alone, but a carry-on works bag-only
  // Recommend the smallest carry-on that works (which is larger than selected)
  if (minBagOnly) {
    var best = minBagOnly.size + "L";
    var comfort = comfortBagOnly && comfortBagOnly.size > minBagOnly.size ? comfortBagOnly.size + "L" : null;
    return { bestFit: best, bestFitNote: null, comfortable: comfort, checked: null };
  }

  // CASE C: No carry-on works bag-only, but selected bag + PI works
  // Recommend the selected bag with PI note — do not downgrade to a smaller bag
  if (selectedFitsWithPI) {
    var best = selectedBagSize + "L";
    var note = personalItem ? null : "with a personal item";
    var comfortWithPI = carryOnOptions.find(function(b) { return b.size >= selectedBagSize && (vtotal / (b.ec + 25)) <= 0.78; });
    var comfort = comfortWithPI && comfortWithPI.size > selectedBagSize ? comfortWithPI.size + "L" : null;
    return { bestFit: best, bestFitNote: note, comfortable: comfort, checked: null };
  }

  // CASE D: Selected bag + PI does not work, but a larger carry-on + PI does
  var largerWithPI = carryOnOptions.find(function(b) { return b.size > selectedBagSize && (b.ec + 25) >= vtotal; });
  if (largerWithPI) {
    var best = largerWithPI.size + "L";
    var note = personalItem ? null : "with a personal item";
    var comfortWithPI = carryOnOptions.find(function(b) { return b.size > largerWithPI.size && (vtotal / (b.ec + 25)) <= 0.78; });
    var comfort = comfortWithPI ? comfortWithPI.size + "L" : null;
    return { bestFit: best, bestFitNote: note, comfortable: comfort, checked: null };
  }

  // CASE E: No carry-on solution works — checked bag required
  var minChecked = checkedOptions.find(function(b) { return b.ec >= vtotal; });
  var checkedSize = minChecked ? minChecked.size + "L" : "100L+";
  return { bestFit: null, bestFitNote: null, comfortable: null, checked: checkedSize };
}

function buildOptimizationSuggestions(vtotal, inputs) {
  var suggestions = [];
  if (inputs.shoeCount > 0) {
    var shoeVolMap = { "bulky": 7.5, "compact": 1.2, "standard": 6.5 };
    var totalShoeVol = 0;
    for (var si = 0; si < inputs.shoeList.length; si++) { totalShoeVol += (shoeVolMap[inputs.shoeList[si]] || 6.5); }
    var saving = Math.round(totalShoeVol * 1.15);
    suggestions.push("Removing " + (inputs.shoeCount > 1 ? inputs.shoeCount + " pairs of extra shoes" : "the extra pair of shoes") + " reduces volume by ~" + saving + "L");
  }
  if (inputs.includeBulkyLayer) {
    suggestions.push("Wearing your bulky layer at the airport (not packing it) saves ~3–5L");
  }
  if (inputs.blazerMode === "packed") {
    suggestions.push("Wearing your blazer during travel instead of packing it saves ~4–5L and avoids wrinkles");
  }
  if (inputs.laundry === "NO" && inputs.tripDays >= 5) {
    suggestions.push("Adding laundry access mid-trip reduces clothing by 30–40% — the single biggest lever for longer trips");
  }
  if (inputs.profile === "heavy") {
    suggestions.push("Switching from heavy to standard packing reduces clothing volume by ~15%");
  }
  if (inputs.climate === "COLD") {
    suggestions.push("Wearing your heaviest cold-weather layer at the airport keeps it out of the bag entirely");
  }
  if (inputs.carryOnSystemCapacity && vtotal > inputs.carryOnSystemCapacity * 0.70 && vtotal <= inputs.carryOnSystemCapacity) {
    suggestions.push("You are near the limit of your carry-on system — consider reducing volume or checking a bag");
  }
  return suggestions.slice(0, 4);
}
function buildHumanSummary(inputs, vtotal) {
  var days = inputs.tripDays, profile = inputs.profile, climate = inputs.climate;
  var shoeCount = inputs.shoeCount, laptop = inputs.includeLaptop;
  var bulky = inputs.includeBulkyLayer, laundry = inputs.laundry;
  var blazer = inputs.blazerMode || "none";

  var isLight  = profile === "light"  && shoeCount === 0 && !laptop && !bulky && blazer === "none" && days <= 5;
  var isHeavy  = profile === "heavy"  || (laptop && shoeCount > 0) || (climate === "COLD" && days >= 7);

  var drivers = [];
  if (climate === "COLD")               drivers.push("cold-weather layers");
  if (laptop)                           drivers.push("laptop and tech gear");
  if (shoeCount > 1)                    drivers.push("extra shoes");
  else if (shoeCount === 1)             drivers.push("an extra pair of shoes");
  if (bulky)                            drivers.push("a packed bulky layer");
  if (blazer === "packed")              drivers.push("a packed blazer");
  if (laundry === "NO" && days >= 7)    drivers.push("full clothing for " + days + " days (no laundry)");
  else if (days >= 10)                  drivers.push("extended trip length");

  var dStr = drivers.length === 0 ? "" :
             drivers.length === 1 ? drivers[0] :
             drivers.slice(0, -1).join(", ") + " and " + drivers[drivers.length - 1];

  if (isLight && vtotal <= 20) {
    return "This is a light packing setup — easily fits in a small carry-on with room to spare.";
  }
  if (drivers.length === 0) {
    if (vtotal <= 25)      return "This is a minimal packing setup. Most carry-on bags will handle this easily.";
    if (vtotal <= 35)      return "This is a straightforward " + days + "-day setup. A 35–40L carry-on is the right fit.";
    return                        "This is a moderate setup for " + days + " days. Volume is within carry-on range.";
  }
  if (vtotal > (inputs.carryOnSystemCapacity || 38.25)) {
    return dStr.charAt(0).toUpperCase() + dStr.slice(1) + " significantly increase volume — which is why this setup exceeds your carry-on system capacity.";
  }
  if (isHeavy || vtotal > 35) {
    return "This setup is driven by " + dStr + " — pushing it close to carry-on limits.";
  }
  return "This is a manageable setup — " + dStr + " add " + (vtotal > 28 ? "moderate" : "some") + " volume but it stays within carry-on range.";
}

function buildVolumeDrivers(inputs, vtotal) {
  var days = inputs.tripDays, profile = inputs.profile, climate = inputs.climate;
  var shoeCount = inputs.shoeCount, laptop = inputs.includeLaptop;
  var bulky = inputs.includeBulkyLayer, laundry = inputs.laundry;
  var blazer = inputs.blazerMode || "none";

  var drivers = [];
  if (laundry === "NO" && days >= 5)         drivers.push(days + "-day clothing, no laundry");
  else if (laundry === "YES" && days >= 10)  drivers.push("extended trip (" + days + " days)");
  else if (days <= 3)                        drivers.push("short trip (" + days + " days)");
  if (climate === "COLD")                    drivers.push("cold-weather layers");
  if (laptop)                                drivers.push("laptop and tech");
  if (shoeCount > 0)                         drivers.push(shoeCount > 1 ? shoeCount + " extra pairs of shoes" : "extra shoes");
  if (bulky)                                 drivers.push("bulky layer");
  if (blazer === "packed")                   drivers.push("packed blazer");
  if (profile === "heavy")                   drivers.push("heavy packing style");

  if (drivers.length === 0) return "Main volume drivers: minimal clothing and no bulky items";
  if (drivers.length === 1) return "Main volume driver: " + drivers[0];
  return "Main volume drivers: " + drivers.join(", ");
}


function buildCategorizedPackingList(entries) {
  var cats = {
    tops:       { label: "Tops",       items: [] },
    bottoms:    { label: "Bottoms",    items: [] },
    layers:     { label: "Layers",     items: [] },
    underwear:  { label: "Underwear",  items: [] },
    socks:      { label: "Socks",      items: [] },
    footwear:   { label: "Footwear",   items: [] },
    gear:       { label: "Gear",       items: [] },
    toiletries: { label: "Toiletries", items: [] }
  };
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (!e.name || !e.item) continue;
    var qty = e.worn ? "(worn)" : "×" + e.qty;
    var displayName = (window.PAGE_ITEM_LABEL_OVERRIDES && window.PAGE_ITEM_LABEL_OVERRIDES[e.name]) || e.name;
    var label = displayName + " " + qty;
    var item = e.item;
    if (e.name === "Tops" || e.name === "Dress Shirt")                      cats.tops.items.push(label);
    else if (e.name === "Bottoms" || e.name === "Jeans" || e.name === "Shorts") cats.bottoms.items.push(label);
    else if (item.outerwear)                                                    cats.layers.items.push(label);
    else if (e.name === "Underwear")                                            cats.underwear.items.push(label);
    else if (e.name === "Socks")                                                cats.socks.items.push(label);
    else if (item.shoe)                                                         cats.footwear.items.push(label);
    else if (item.electronics)                                                  cats.gear.items.push(label);
    else                                                                        cats.toiletries.items.push(label);
  }
  return Object.values(cats).filter(function(c) { return c.items.length > 0; });
}

function updateShoeType() {
  var count = parseInt(document.getElementById("extraShoes").value) || 0;
  var f1 = document.getElementById("shoeType1Field");
  var f2 = document.getElementById("shoeType2Field");
  if (f1) { f1.style.display = count >= 1 ? "" : "none"; }
  if (f2) { f2.style.display = count >= 2 ? "" : "none"; }
}
function updateLaundryDefault() {
  // No-op: laundry is set only by PAGE_DEFAULT_LAUNDRY or user interaction.
}

function updateCalcContext(bagType, bagSize, airlineName) {
  var el = document.getElementById("calcContextLabel");
  if (!el) return;
  var cleanName = airlineName.replace(" Airlines", "").replace(" Air Lines", "");
  var bagLabel = "bag";
  if (bagType === "personal-item") bagLabel = "personal item bag";
  else if (bagType === "backpack") bagLabel = "backpack";
  else if (bagType === "suitcase-carryon") bagLabel = "carry-on suitcase";
  else if (bagType === "suitcase-checked") bagLabel = "checked suitcase";
  el.textContent = "Current setup: " + bagSize + "L " + bagLabel + " on " + cleanName;
  el.style.display = "";
}

// ── Personal Item Dimension Advisory ────────────────────────────────────────
// Typical external dimensions (inches) for personal-item bags by capacity.
// These are approximate — soft bags compress, structured bags don't.
var PI_TYPICAL_DIMS = {
  12: { l:15.0, w:10.0, h:5.5 },
  15: { l:16.0, w:11.0, h:6.0 },
  18: { l:17.0, w:12.0, h:7.0 },
  20: { l:18.0, w:12.5, h:7.5 },
  22: { l:18.5, w:13.0, h:8.0 },
  25: { l:19.5, w:13.5, h:8.5 }
};

function computePIDimensionAdvisory(bag, airline) {
  if (bag.category !== "personal-item") return "";
  var dims = PI_TYPICAL_DIMS[bag.capacity];
  if (!dims || !airline.piL) return "";

  var exceeds = (dims.l > airline.piL) || (dims.w > airline.piW) || (dims.h > airline.piH);
  var close = !exceeds && ((airline.piL - dims.l) < 1.5 || (airline.piW - dims.w) < 1.0 || (airline.piH - dims.h) < 0.5);

  if (exceeds) {
    return "<strong>Dimension note:</strong> A typical " + bag.capacity + "L bag (~" + dims.l + " × " + dims.w + " × " + dims.h + " in) may exceed " + airline.name + "’s personal item limits (" + airline.piL + " × " + airline.piW + " × " + airline.piH + " in). Soft bags often compress to fit, but check before flying.";
  } else if (close) {
    return "<strong>Dimension note:</strong> A typical " + bag.capacity + "L bag is close to " + airline.name + "’s personal item limits. Should fit if the bag is soft-sided or compressible.";
  }
  return "";
}

function runCalculation() {
  const bagType           = document.getElementById("bagType").value;
  const bagSize           = parseInt(document.getElementById("bagSize").value);
  const bag               = BAGS.find(function(b) { return b.category === bagType && b.capacity === bagSize; }) || BAGS[0];
  const airlineEl         = document.getElementById("airline");
  const airline           = AIRLINES[airlineEl ? airlineEl.value : 1] || AIRLINES[1];
  const personalItem      = document.getElementById("personalItem").checked;
  updateCalcContext(bagType, bagSize, airline ? airline.name : "Your Airline");
  const profile           = document.getElementById("profile").value;
  const tripDays          = parseInt(document.getElementById("tripDays").value) || 5;
  const climate           = document.getElementById("climate").value;
  const laundry           = document.getElementById("laundry").value;
  const size              = document.getElementById("clothingSize").value;
  const includeLaptop     = document.getElementById("includeLaptop").checked;
  const bulkyEl           = document.getElementById("includeBulkyLayer");
  const includeBulkyLayer = bulkyEl ? bulkyEl.checked : false;
  const shoeCount         = parseInt(document.getElementById("extraShoes").value) || 0;
  const shoeList          = [];
  if (shoeCount >= 1) { var st1 = document.getElementById("shoeType1"); shoeList.push(st1 ? st1.value : "standard"); }
  if (shoeCount >= 2) { var st2 = document.getElementById("shoeType2"); shoeList.push(st2 ? st2.value : "standard"); }
  const blazerEl          = document.getElementById("blazerMode");
  const blazerMode        = blazerEl ? blazerEl.value : "none";

  const r = runEngine(bag, airline, personalItem, profile, tripDays, climate, laundry, size, includeLaptop, shoeList, includeBulkyLayer, blazerMode);

  const PERSONAL_ITEM_CAPACITY = personalItem ? 25 : 0;
  const carryOnOnlyCapacity = r.adjustedCapacity - PERSONAL_ITEM_CAPACITY;
  const carryOnSystemCapacity = r.adjustedCapacity;
  const isFlexibleSize = bag.capacity <= 25 && bag.category !== "personal-item";
  const isPIprimary = bag.category === "personal-item";
  const statedBagCapacity = bag.capacity;
  const statedSystemCap = statedBagCapacity + PERSONAL_ITEM_CAPACITY;
  const overflowBeyondEffective = Math.max(0, r.vtotal - carryOnOnlyCapacity);
  const overflowBeyondStated = Math.max(0, r.vtotal - statedBagCapacity);

  const card = document.getElementById("resultCard");
  card.className = "result-card";

  const inputs = {
    tripDays: tripDays, profile: profile, climate: climate, laundry: laundry,
    shoeCount: shoeCount, shoeList: shoeList,
    includeLaptop: includeLaptop, includeBulkyLayer: includeBulkyLayer,
    blazerMode: blazerMode,
    personalItem: personalItem,
    carryOnOnlyCapacity: carryOnOnlyCapacity,
    carryOnSystemCapacity: carryOnSystemCapacity
  };

  // 0. Final Decision — new nuanced hierarchy
  var decisionEl = document.getElementById("finalDecision");
  var decisionClass = "";
  var decisionMain  = "";
  var decisionSub   = "";

  if (r.weightConflict) {
    decisionClass = "red";
    decisionMain  = "Weight limit exceeded";
    decisionSub   = "Reduce heavy items to meet " + airline.name + " weight restrictions";
  } else if (r.geometryConflict) {
    decisionClass = "yellow";
    decisionMain  = "Rigid items may cause fit issues";
    decisionSub   = bagType === "suitcase-checked"
      ? "Rigid gear takes up disproportionate space \u2014 consider reducing rigid items"
      : (bagType === "personal-item" ? "Rigid items take up disproportionate space in a personal item bag" : "Consider moving rigid gear to a personal item");
  } else if (bagType === "personal-item") {
    // Personal item bag selected as primary
    if (r.vtotal <= carryOnOnlyCapacity * 0.80) {
      decisionClass = "green";
      decisionMain  = "Fits as a personal item";
      decisionSub   = "Should fit under the seat with room to spare";
    } else if (r.vtotal <= carryOnOnlyCapacity) {
      decisionClass = "green";
      decisionMain  = "Fits as a personal item";
      decisionSub   = "Should fit under the seat";
    } else if (r.vtotal <= statedBagCapacity) {
      decisionClass = "yellow";
      decisionMain  = "Tight personal-item setup";
      decisionSub   = "Fits with efficient packing \u2014 a structured bag helps";
    } else if (r.vtotal <= statedBagCapacity * 1.10) {
      decisionClass = "yellow";
      decisionMain  = "Very tight for this personal item";
      decisionSub   = "At the edge of this bag \u2014 consider a larger personal item or a carry-on backpack";
    } else if (r.vtotal <= 25) {
      decisionClass = "red";
      decisionMain  = "Larger personal item or carry-on recommended";
      decisionSub   = "This setup needs more space than a " + statedBagCapacity + "L personal item provides";
    } else {
      decisionClass = "red";
      decisionMain  = "Consider a carry-on backpack";
      decisionSub   = "This setup exceeds personal-item capacity \u2014 a 30\u201335L carry-on would give more flexibility";
    }
  } else if (bagType === "suitcase-checked") {
    // Checked suitcase selected
    if (r.vtotal <= carryOnOnlyCapacity) {
      decisionClass = "green";
      decisionMain  = "Fits this checked bag";
      decisionSub   = "Plenty of room for this setup";
    } else if (r.vtotal <= statedBagCapacity) {
      decisionClass = "yellow";
      decisionMain  = "Tight fit for this checked bag";
      decisionSub   = "Should work with efficient packing";
    } else {
      decisionClass = "red";
      decisionMain  = "Larger checked bag recommended";
      decisionSub   = "This setup exceeds this bag\u2019s capacity";
    }
  } else if (isFlexibleSize && !personalItem) {
    // 25L flexible classification (no PI)
    if (r.vtotal <= carryOnOnlyCapacity * 0.70) {
      decisionClass = "green";
      decisionMain  = "Typically works as a personal item";
      decisionSub   = "Light setup \u2014 should fit under most seats";
    } else if (r.vtotal <= carryOnOnlyCapacity) {
      decisionClass = "green";
      decisionMain  = "Should work as a personal item";
      decisionSub   = "Fits within typical personal item range";
    } else if (r.vtotal <= statedBagCapacity) {
      decisionClass = "yellow";
      decisionMain  = "Tight fit \u2014 personal item or compact carry-on";
      decisionSub   = "Depends on packed shape and airline enforcement";
    } else {
      decisionClass = "yellow";
      decisionMain  = "May need overhead bin space";
      decisionSub   = "A slightly larger bag or personal item would help";
    }
  } else if (personalItem) {
    // Personal item already selected \u2014 evaluate the carry-on system
    var piOverflow = Math.ceil(overflowBeyondEffective);
    if (r.vtotal <= carryOnOnlyCapacity) {
      decisionClass = "green";
      decisionMain  = "Fits in carry-on alone";
      decisionSub   = "Personal item provides extra overflow space";
    } else if (r.vtotal <= carryOnOnlyCapacity + 25) {
      decisionClass = "green";
      decisionMain  = "Carry-on + personal item should work";
      decisionSub   = "About " + piOverflow + "L of overflow to your personal item";
    } else if (r.vtotal <= statedSystemCap) {
      decisionClass = "yellow";
      decisionMain  = "Carry-on + personal item \u2014 tight fit";
      decisionSub   = "About " + piOverflow + "L to your personal item \u2014 tight but workable";
    } else if (r.vtotal <= statedSystemCap * 1.08) {
      decisionClass = "yellow";
      decisionMain  = "Carry-on + personal item \u2014 very tight";
      decisionSub   = "At the limit of this carry-on system";
    } else if (statedBagCapacity < 45) {
      decisionClass = "red";
      decisionMain  = "Larger carry-on recommended";
      decisionSub   = "Even with a personal item, this bag is too small for this setup";
    } else {
      decisionClass = "red";
      decisionMain  = "Checked bag likely required";
      decisionSub   = "This setup exceeds practical carry-on capacity";
    }
  } else {
    // No personal item selected \u2014 evaluate bag alone, then suggest alternatives
    var piWouldSolve = r.vtotal <= statedBagCapacity + 25;
    if (r.vtotal <= carryOnOnlyCapacity) {
      decisionClass = "green";
      decisionMain  = "Should fit in carry-on";
      decisionSub   = "Based on typical packing volume";
    } else if (r.vtotal <= carryOnOnlyCapacity * 1.15) {
      decisionClass = "yellow";
      decisionMain  = "Tight fit";
      decisionSub   = "Should work with efficient packing";
    } else if (r.vtotal <= statedBagCapacity) {
      decisionClass = "yellow";
      decisionMain  = "Very tight fit";
      decisionSub   = "Requires careful packing \u2014 at the limit of this bag";
    } else if (r.vtotal <= statedBagCapacity * 1.08) {
      decisionClass = "yellow";
      decisionMain  = "At the edge of this bag";
      decisionSub   = "A personal item or slightly larger bag would help";
    } else if (piWouldSolve) {
      decisionClass = "yellow";
      decisionMain  = "Better with a personal item";
      decisionSub   = "You need about " + Math.ceil(overflowBeyondStated) + "L beyond this bag";
    } else if (r.vtotal <= 45) {
      decisionClass = "red";
      decisionMain  = "Larger carry-on recommended";
      decisionSub   = "This bag is too small for this packing setup";
    } else if (r.vtotal <= 70) {
      decisionClass = "red";
      decisionMain  = "Larger carry-on + personal item recommended";
      decisionSub   = "This setup needs more space than a single carry-on provides";
    } else {
      decisionClass = "red";
      decisionMain  = "Checked bag likely required";
      decisionSub   = "Exceeds practical carry-on system capacity";
    }
  }

  if (decisionEl) {
    decisionEl.className = "final-decision " + decisionClass;
    decisionEl.innerHTML = "<div><div class=\"decision-main\">" + decisionMain + "</div><div class=\"decision-sub\">" + decisionSub + "</div></div>";
  }

  // 1. Required Volume
  document.getElementById("reqVolumeNumber").textContent = "~" + r.vtotal.toFixed(1) + "L required";
  document.getElementById("reqVolumeLabel").textContent  = "This packing setup requires approximately " + r.vtotal.toFixed(1) + " liters of space.";

  // 2. Human Summary
  const summaryEl = document.getElementById("humanSummary");
  const summaryText = buildHumanSummary(inputs, r.vtotal);
  summaryEl.textContent  = summaryText;
  summaryEl.style.display = "";

  // 3. Volume Drivers
  const driversEl = document.getElementById("volumeDrivers");
  driversEl.textContent  = buildVolumeDrivers(inputs, r.vtotal);
  driversEl.style.display = "";

  // 4. Interpretation
  const interp   = computeVolumeInterpretation(r.vtotal, carryOnSystemCapacity, statedSystemCap, personalItem, bagType);
  const interpEl = document.getElementById("volInterp");
  interpEl.className   = "vol-interp " + interp.cls;
  interpEl.textContent = interp.text;

  // 5. Personal Item Note — dynamic overflow messaging
  const piNoteEl = document.getElementById("personalItemNote");
  var piMsg = "";

  if (bagType === "suitcase-checked") {
    // No personal item messaging for checked suitcases
    piMsg = "";
  } else if (bagType === "personal-item") {
    // Personal item is the primary bag — show dimension advisory
    var piDimAdvisory = computePIDimensionAdvisory(bag, airline);
    if (piDimAdvisory) {
      piMsg = piDimAdvisory;
    }
    if (personalItem) {
      // User also checked "add personal item" — show dual-bag note
      var piOverflowPI = Math.ceil(Math.max(0, r.vtotal - carryOnOnlyCapacity));
      if (r.vtotal <= carryOnOnlyCapacity) {
        piMsg += (piMsg ? "<br>" : "") + "<strong>Two-bag setup:</strong> This setup fits in the primary bag alone — the secondary bag provides extra overflow space.";
      } else {
        piMsg += (piMsg ? "<br>" : "") + "<strong>Two-bag setup:</strong> About " + piOverflowPI + "L of overflow to your secondary bag.";
      }
    }
  } else if (isFlexibleSize && !personalItem) {
    // 25L flexible placement guidance
    if (r.placement === "FLEX_PERSONAL") {
      piMsg = "<strong>Placement: Typically a personal item.</strong> This setup is light enough that a " + statedBagCapacity + "L bag should fit under most airline seats.";
    } else {
      piMsg = "<strong>Placement: Personal item or small carry-on.</strong> This " + statedBagCapacity + "L bag is packed to a point where it may not fit under all seats. It could work as either a personal item or a compact carry-on.";
    }
  } else if (personalItem) {
    // PI selected — evaluate the system
    var piOverflowNote = Math.ceil(overflowBeyondEffective);
    if (r.vtotal <= carryOnOnlyCapacity) {
      piMsg = "<strong>Using carry-on + personal item.</strong> This setup fits in the carry-on alone \u2014 the personal item provides extra overflow space.";
    } else if (r.vtotal <= statedSystemCap) {
      if (piOverflowNote <= 10) {
        piMsg = "<strong>Your carry-on + personal item setup should work.</strong> About " + piOverflowNote + "L of overflow goes to your personal item \u2014 a small personal item should be enough.";
      } else {
        piMsg = "<strong>Your carry-on + personal item setup should work.</strong> About " + piOverflowNote + "L of overflow goes to your personal item.";
      }
    } else if (statedBagCapacity < 45) {
      piMsg = "<strong>Even with a personal item, this setup needs more space.</strong> Consider a larger carry-on to bring the overflow down to a manageable level.";
    } else {
      piMsg = "<strong>Even with a personal item, this setup exceeds practical carry-on capacity.</strong> A checked bag is the more realistic option for this trip.";
    }
  } else if (r.vtotal > statedBagCapacity) {
    // No PI, bag alone doesn't fit — suggest PI if it would help
    var overflowNote = Math.ceil(overflowBeyondStated);
    if (r.vtotal <= statedBagCapacity + 25) {
      if (overflowNote <= 8) {
        piMsg = "<strong>A personal item would help.</strong> You need about " + overflowNote + "L beyond this bag \u2014 a small personal item should handle it.";
      } else {
        piMsg = "<strong>A personal item would help.</strong> You need about " + overflowNote + "L beyond this bag.";
      }
    }
  }

  if (piMsg) {
    piNoteEl.innerHTML = piMsg;
    piNoteEl.style.display = "";
  } else {
    piNoteEl.style.display = "none";
  }

  // 6. Bag Recommendations
  const ranges   = computeBagRanges(r.vtotal, personalItem, bagType, bagSize);
  const rangesEl = document.getElementById("bagRanges");
  var isBagPage = (typeof PAGE_IS_BAG_SPECIFIC !== "undefined" && PAGE_IS_BAG_SPECIFIC);
  let rangesHTML = '<div class="bag-ranges-title">Bag Size Recommendations</div>';
  if (ranges.bestFit) {
    var bestMatchesSelected = (ranges.bestFit === bagSize + "L");
    var bestLabel = (isBagPage && bestMatchesSelected) ? "Selected Bag" : (isBagPage ? "Smallest Bag That Should Work" : "Best Fit");
    var bestDesc = ranges.bestFitNote ? "(fits " + ranges.bestFitNote + ")" : "(fits comfortably without overpacking)";
    rangesHTML += '<div class="bag-range-row"><span class="bag-range-label">' + bestLabel + '</span><span class="bag-range-value green">' + ranges.bestFit + '<span class="bag-range-desc">' + bestDesc + '</span></span></div>';
    // Smaller Option row — only on bag-specific pages when a smaller carry-on also works
    if (isBagPage && bestMatchesSelected && bagType !== "suitcase-checked") {
      var smallerCarryOnOptions = [
        { size: 25, ec: 21.25 }, { size: 30, ec: 25.50 }, { size: 35, ec: 29.75 },
        { size: 40, ec: 34.00 }, { size: 45, ec: 38.25 }
      ];
      var piCap = personalItem ? 25 : 0;
      var smallestWorking = smallerCarryOnOptions.find(function(b) { return (b.ec + piCap) >= r.vtotal; });
      if (smallestWorking && smallestWorking.size < bagSize) {
        rangesHTML += '<div class="bag-range-row"><span class="bag-range-label">Smaller Option</span><span class="bag-range-value green">' + smallestWorking.size + 'L<span class="bag-range-desc">(smallest bag that should work)</span></span></div>';
      }
    }
  }
  if (ranges.comfortable) {
    var comfortLabel = isBagPage ? "More Comfortable Option" : "Comfortable";
    rangesHTML += '<div class="bag-range-row"><span class="bag-range-label">' + comfortLabel + '</span><span class="bag-range-value blue">' + ranges.comfortable + '<span class="bag-range-desc">(extra room and easier packing)</span></span></div>';
  }
  if (!ranges.bestFit) {
    rangesHTML += '<div class="bag-range-row"><span class="bag-range-label">Minimum Carry-On</span><span class="bag-range-value orange">Exceeds 45L<span class="bag-range-desc">(no standard carry-on fits)</span></span></div>';
  }
  if (ranges.checked) {
    rangesHTML += '<div class="bag-range-row"><span class="bag-range-label">Checked Option</span><span class="bag-range-value orange">' + ranges.checked + '<span class="bag-range-desc">(recommended for this setup)</span></span></div>';
  }
  rangesEl.innerHTML     = rangesHTML;
  rangesEl.style.display = "";

  // 6b. Bridge: Quick Packing Calculator -> Complete Packing List Generator
  // Inserted once, right after the bag recommendation and before the reduction tips.
  if (!document.getElementById("plgBridge")) {
    var plgBridge = document.createElement("div");
    plgBridge.id = "plgBridge";
    plgBridge.className = "plg-bridge";
    plgBridge.innerHTML =
      '<div class="plg-bridge-title">Need the exact packing list?</div>' +
      '<p class="plg-bridge-text">This estimate tells you <strong>how much space</strong> you’ll need. The <strong>Complete Packing List Generator</strong> tells you <strong>exactly what to pack</strong>.</p>' +
      '<a href="/packing-list-generator.html" class="cta-primary plg-bridge-btn" onclick="window.pfTrack&&window.pfTrack(\'bridge_clicked\')">Build my packing list →</a>';
    rangesEl.parentNode.insertBefore(plgBridge, rangesEl.nextSibling);
  }

  // 7. Optimization Suggestions
  const suggestions = buildOptimizationSuggestions(r.vtotal, inputs);
  const sugBox      = document.getElementById("suggestionsBox");
  if (suggestions.length > 0) {
    document.getElementById("suggestionsList").innerHTML = suggestions.map(function(s) { return "<li>" + s + "</li>"; }).join("");
    sugBox.style.display = "";
  } else { sugBox.style.display = "none"; }

  // 8. Categorized Packing List
  const packCats = buildCategorizedPackingList(r.entries);
  const packBox  = document.getElementById("packListBox");
  if (packCats.length > 0) {
    document.getElementById("packCategoryRows").innerHTML = packCats.map(function(cat) {
      return '<div class="pack-cat-row"><span class="pack-cat-name">' + cat.label + '</span><span class="pack-cat-items">' + cat.items.join(", ") + "</span></div>";
    }).join("");
    packBox.style.display = "";
  } else { packBox.style.display = "none"; }

  // 9. Airline Note — softened to match nuanced decision hierarchy
  const airlineNoteEl = document.getElementById("airlineNote");
  if (bagType === "suitcase-checked") {
    airlineNoteEl.innerHTML = "<strong>Checked suitcase selected.</strong> Check your airline\u2019s checked bag size and weight limits before travel.";
  } else if (r.vtotal > statedSystemCap * 1.10) {
    var aName = airline ? airline.name : "your airline";
    var exceedNote = "<strong>This setup likely exceeds carry-on capacity for " + aName + ".</strong> A checked bag or larger carry-on system is recommended.";
    if (airline) {
      exceedNote += "<br>" + airline.name + " carry-on limit: " + airline.coL + " \u00d7 " + airline.coW + " \u00d7 " + airline.coH + " in (" + airline.coLcm + " \u00d7 " + airline.coWcm + " \u00d7 " + airline.coHcm + " cm).";
      if (airline.weightKg > 0) { exceedNote += " Weight limit: " + airline.weightKg + " kg (" + airline.weightLbs + " lbs)."; }
    }
    airlineNoteEl.innerHTML = exceedNote;
  } else if (r.vtotal > statedSystemCap) {
    var tightAirline = airline ? airline.name : "your airline";
    var tightNote = "<strong>At the limit of carry-on capacity.</strong> This is a very tight fit for " + tightAirline + "\u2019s carry-on system.";
    if (airline) {
      tightNote += "<br>" + airline.name + " carry-on limit: " + airline.coL + " \u00d7 " + airline.coW + " \u00d7 " + airline.coH + " in (" + airline.coLcm + " \u00d7 " + airline.coWcm + " \u00d7 " + airline.coHcm + " cm).";
      if (airline.weightKg > 0) { tightNote += " Weight limit: " + airline.weightKg + " kg (" + airline.weightLbs + " lbs)."; }
    }
    airlineNoteEl.innerHTML = tightNote;
  } else if (isPIprimary && airline) {
    const a = airline;
    let piAirlineNote = "<strong>" + a.name + " personal item limit:</strong> ";
    if (a.piL) {
      piAirlineNote += a.piL + " × " + a.piW + " × " + a.piH + " in (" + a.piLcm + " × " + a.piWcm + " × " + a.piHcm + " cm).";
    } else {
      piAirlineNote += "No specific dimensions published — generally must fit under the seat in front of you.";
    }
    if (a.note) { piAirlineNote += " " + a.note + "."; }
    airlineNoteEl.innerHTML = piAirlineNote;
  } else if (isFlexibleSize && airline) {
    const a = airline;
    let flexNote = "<strong>" + a.name + "</strong>: A " + bag.capacity + "L bag is at the boundary between personal item and carry-on. ";
    if (r.placement === "FLEX_PERSONAL") {
      flexNote += "This setup is light enough to typically qualify as a personal item (under-seat). ";
    } else {
      flexNote += "When packed out, this bag may function more like a compact carry-on than a true personal item. ";
    }
    flexNote += "Final acceptance depends on external dimensions, packed shape, and gate agent discretion.";
    if (a.coL) { flexNote += "<br>Carry-on limit: " + a.coL + " \u00d7 " + a.coW + " \u00d7 " + a.coH + " in (" + a.coLcm + " \u00d7 " + a.coWcm + " \u00d7 " + a.coHcm + " cm)."; }
    if (a.note) { flexNote += " " + a.note + "."; }
    airlineNoteEl.innerHTML = flexNote;
  } else if (airline) {
    const a = airline;
    let noteHTML = "<strong>" + a.name + "</strong> carry-on limit: " + a.coL + " × " + a.coW + " × " + a.coH + " in (" + a.coLcm + " × " + a.coWcm + " × " + a.coHcm + " cm).";
    if (a.weightKg > 0) { noteHTML += " Weight limit: " + a.weightKg + " kg (" + a.weightLbs + " lbs)."; }
    noteHTML += "<br>" + a.note + ". " + AIRLINE_NOTE_TEXT;
    airlineNoteEl.innerHTML = noteHTML;
  }

  // Dynamic personal-item suggestion — triggered when packing load exceeds ~45L
  window.AIRLINES = AIRLINES;
  var __piBlock = document.querySelector(".personal-item-suggestion");
  if (__piBlock) {
    if (r.vtotal > 45) {
      __piBlock.style.display = "";
      if (!__piBlock.dataset.rendered) {
        window.recommendBags({
          airlineName: airline ? airline.name : "Your Airline",
          requiredCapacity: 20,
          bagFamily: "personal_item_backpack",
          containerId: "personalItemRecommendations"
        });
        __piBlock.dataset.rendered = "1";
      }
    } else {
      __piBlock.style.display = "none";
    }
  }

  // Dynamic Bag Recommendations — trip/destination pages (guarded by element existence)
  if (typeof window.recommendBags === "function" && r.vtotal > 0 && bagType !== "suitcase-checked") {
    var tripRecContainer = document.getElementById("tripRecContainer");
    if (tripRecContainer) {
      var recCap = Math.ceil(r.vtotal);
      var recAirlineName = airline ? airline.name : "Delta Air Lines";
      var recFamily = (bagType === "backpack") ? "carry_on_backpack" : "rolling_carry_on";
      var recResult = window.recommendBags({
        airlineName: recAirlineName,
        requiredCapacity: recCap,
        bagFamily: recFamily,
        containerId: "tripRecContainer"
      });
      var recsWrap = document.getElementById("tripBagRecs");
      var introEl = document.getElementById("tripBagRecsIntro");
      if (recsWrap && recResult.safest) {
        var recLabel = (recFamily === "carry_on_backpack") ? "carry-on backpack" : "rolling carry-on";
        introEl.textContent = "Recommended " + recLabel + " for a " + tripDays + "-day, " + Math.ceil(r.vtotal) + "L setup:";
        recsWrap.style.display = "";
      } else if (recsWrap) {
        recsWrap.style.display = "none";
      }
    }
  }

  // Garment bag suggestion — business/formalwear pages only (gated by DOM existence)
  var garmentBlock = document.getElementById("garmentBagRecs");
  if (garmentBlock) {
    garmentBlock.style.display = (blazerMode === "packed") ? "" : "none";
  }

  // Checked-bag recommendation — trip/destination pages (page-type gated)
  var checkedBagContainer = document.getElementById("checkedBagRecs");
  if (checkedBagContainer && typeof window.shouldShowCheckedBagRecs === "function" && typeof window.renderCheckedBagSection === "function") {
    var showChecked = window.shouldShowCheckedBagRecs({requiredVolume: r.vtotal, bagType: bagType, recommendedSize: bagSize, bulkyIntent: false});
    if (showChecked) {
      window.renderCheckedBagSection({requiredCapacity: Math.ceil(r.vtotal), containerId: "checkedBagRecs", pageContext: PAGE_CHECKED_BAG_CONTEXT});
    } else {
      checkedBagContainer.innerHTML = "";
      checkedBagContainer.style.display = "none";
    }
  }

  // GA4: quick_calculator_run — once per page, user-initiated runs only
  // (the on-load auto-calc on preset pages is skipped via __pfCalcInitDone).
  if (window.__pfCalcInitDone && !window.__pfQcrFired) {
    window.__pfQcrFired = true;
    if (window.pfTrack) window.pfTrack('quick_calculator_run');
  }
}

// Homepage calculator auto-init — gated on the calculator DOM so the engine can be
// loaded read-only on other pages (e.g. the packing list generator) without erroring.
if (document.getElementById("laundry")) {
  populateSelects();
  applyPageDefaults();
  (function() { var el = document.getElementById("laundry"); if (!el.value) el.value = "NO"; })();
  renderScenarioBlock();
  if (window.PAGE_ENABLE_AUTO_CALC) runCalculation();
  window.__pfCalcInitDone = true;   // any runCalculation after this point is user-initiated
}

// Read-only engine handle for reuse by other tool pages. Does not change any logic.
window.PackFitterEngine = {
  buildItemList: buildItemList,
  runEngine: runEngine,
  SIZE_MULTIPLIER: SIZE_MULTIPLIER,
  ITEMS: ITEMS
};
