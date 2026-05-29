/* ═══════════════════════════════════════════════════════════════════════════════
   PackFitter Weight Engine — Shared Data Foundation
   ═══════════════════════════════════════════════════════════════════════════════
   Reusable data module for weight estimation across all PackFitter tools:
   - Packing weight calculator
   - Carry-on vs checked strategy pages
   - Family/shared luggage planning
   - Airline compliance pages
   - Overweight fee analysis
   - Bag recommendation engine

   All weights in kg. All fees in USD unless noted.
   Data verified May 2026 from official airline sites and manufacturer specs.
   ═══════════════════════════════════════════════════════════════════════════════ */

window.PF_WEIGHT = (function () {

  // ═══════════════════════════════════════════════════════════════════════════
  // AIRLINE DATABASE
  // ═══════════════════════════════════════════════════════════════════════════
  // Each airline entry contains:
  //   carryon:     { limitKg, limitLbs, enforcement }
  //   checked:     { standardKg, standardLbs, maxKg }
  //   fees:        { firstBag, secondBag, overweight23to32, overweight32to45 }
  //   notes:       string (important quirks)
  //   region:      string (for grouping)
  //   active:      boolean (false = defunct)
  //
  // enforcement levels: "none" | "low" | "moderate" | "strict"

  var AIRLINES = {

    // ── US Full-Service ─────────────────────────────────────────────────────
    delta: {
      name: "Delta Air Lines", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 45, secondBag: 55, overweight23to32: 100, overweight32to45: 200 },
      notes: "No carry-on weight limit. Checked bag fees increased Apr 2026."
    },
    united: {
      name: "United Airlines", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 45 },
      fees: { firstBag: 45, secondBag: 55, overweight23to32: 100, overweight32to45: null },
      notes: "No carry-on weight limit. Over 45 kg not accepted. Prepay saves $5-10."
    },
    american: {
      name: "American Airlines", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 45, secondBag: 55, overweight23to32: 100, overweight32to45: null },
      notes: "No carry-on weight limit. Tiered overweight: $30 for 51-53 lb, $100 for 54-70 lb."
    },
    southwest: {
      name: "Southwest Airlines", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 45 },
      fees: { firstBag: 45, secondBag: 55, overweight23to32: 125, overweight32to45: 200 },
      notes: "No carry-on weight limit. Free checked bags ended May 2025. Business Select and some loyalty tiers still include free bags."
    },
    jetblue: {
      name: "JetBlue", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 45, overweight23to32: 150, overweight32to45: null },
      notes: "No carry-on weight limit. $150 overweight fee is steeper than Delta/United/American."
    },
    alaska: {
      name: "Alaska Airlines", region: "us-major", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 50, overweight23to32: 100, overweight32to45: null },
      notes: "No carry-on weight limit."
    },

    // ── US Budget ────────────────────────────────────────────────────────────
    spirit: {
      name: "Spirit Airlines", region: "us-budget", active: false,
      carryon: { limitKg: 18, limitLbs: 40, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 45 },
      fees: { firstBag: 55, secondBag: 65, overweight23to32: 125, overweight32to45: null },
      notes: "Ceased operations May 2, 2026. Carry-on was 40 lb (not 22 lb). Personal item free, no weight limit."
    },
    frontier: {
      name: "Frontier Airlines", region: "us-budget", active: true,
      carryon: { limitKg: 16, limitLbs: 35, enforcement: "moderate" },
      checked: { standardKg: 18, standardLbs: 40, maxKg: 45 },
      fees: { firstBag: 50, secondBag: 65, overweight18to23: 75, overweight23to32: 100, overweight32to45: 129 },
      notes: "35 lb carry-on limit. 40 lb checked limit — lowest among US carriers. Carry-on fee applies unless bundled."
    },

    // ── European Budget ──────────────────────────────────────────────────────
    ryanair: {
      name: "Ryanair", region: "eu-budget", active: true,
      carryon: { limitKg: 10, limitLbs: 22, enforcement: "strict" },
      carryonFree: { limitKg: 0, limitLbs: 0, note: "Free personal bag has no weight limit (size-limited 40x30x20 cm only)" },
      checked: { standardKg: 20, standardLbs: 44, maxKg: 32 },
      fees: { firstBag: 30, secondBag: 50, overweightPerKg: 13 },
      notes: "10 kg applies to Priority cabin bag only. Free bag (40x30x20 cm) has no weight limit. Checked bags available in 10/20/23 kg tiers."
    },
    easyjet: {
      name: "EasyJet", region: "eu-budget", active: true,
      carryon: { limitKg: 15, limitLbs: 33, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50.7, maxKg: 32 },
      fees: { firstBag: 35, secondBag: 50, overweightPerKg: 12 },
      notes: "15 kg cabin allowance is generous for a budget carrier. Large cabin bag requires overhead seat purchase."
    },
    wizz: {
      name: "Wizz Air", region: "eu-budget", active: true,
      carryon: { limitKg: 10, limitLbs: 22, enforcement: "strict" },
      checked: { standardKg: 20, standardLbs: 44, maxKg: 32 },
      fees: { firstBag: 30, secondBag: 50, overweightPerKg: 13 },
      notes: "10 kg for both free and Priority bags. Checked bags in 10/20/26/32 kg tiers."
    },

    // ── European Full-Service ────────────────────────────────────────────────
    lufthansa: {
      name: "Lufthansa", region: "eu-major", active: true,
      carryon: { limitKg: 8, limitLbs: 17.6, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 70, secondBag: 150, overweight23to32: 100 },
      notes: "8 kg strict. Business/First get 2x8 kg carry-on. Checked included on intercontinental; extra on intra-Europe Light fares."
    },
    british: {
      name: "British Airways", region: "eu-major", active: true,
      carryon: { limitKg: 23, limitLbs: 50.7, enforcement: "low" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 50, secondBag: 100, overweight23to32: 100 },
      notes: "23 kg combined cabin allowance (cabin bag + personal item). Most generous cabin weight in Europe. Max 32 kg hard cutoff per checked bag."
    },
    airfrance: {
      name: "Air France / KLM", region: "eu-major", active: true,
      carryon: { limitKg: 12, limitLbs: 26.5, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 80, overweight23to32: 100 },
      notes: "12 kg Economy, 18 kg Business. Light fare does not include checked bag."
    },
    turkish: {
      name: "Turkish Airlines", region: "eu-major", active: true,
      carryon: { limitKg: 8, limitLbs: 17.6, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 80, overweight23to32: 80 },
      notes: "8 kg Economy, 2x8 kg Business. Checked bag usually included. Uses piece concept to Americas, weight concept elsewhere."
    },

    // ── Middle East / Premium ────────────────────────────────────────────────
    emirates: {
      name: "Emirates", region: "middle-east", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 25, standardLbs: 55, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 75, overweightPerKg: 25 },
      notes: "7 kg all cabin bags combined (Economy). 10 kg Premium Economy. 14 kg Business/First. Weight concept on most routes: fare tier determines allowance (20-30 kg)."
    },
    qatar: {
      name: "Qatar Airways", region: "middle-east", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 25, standardLbs: 55, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 75, overweightPerKg: 25 },
      notes: "7 kg Economy, 15 kg Business/First. Weight concept: 20-35 kg by fare tier. Piece concept to Americas/Africa."
    },
    singapore: {
      name: "Singapore Airlines", region: "asia-pacific", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 25, standardLbs: 55, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 0, overweightPerKg: 20 },
      notes: "7 kg per piece all classes. Weight concept: 25-35 kg by fare. 2x23 kg piece concept to USA/Canada. Pre-purchase 48+ hr saves 25%."
    },
    cathay: {
      name: "Cathay Pacific", region: "asia-pacific", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 100, overweight23to32: 150 },
      notes: "7 kg Economy/Premium Economy, 10 kg Business, 15 kg First. Frequently weighs bags at Hong Kong hub."
    },

    // ── Asia-Pacific ─────────────────────────────────────────────────────────
    qantas: {
      name: "Qantas", region: "asia-pacific", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 60, overweight23to32: 60 },
      notes: "7 kg international Economy. 10 kg domestic per item (14 kg total). International uses weight concept (30 kg total)."
    },
    jetstar: {
      name: "Jetstar", region: "asia-pacific", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 45, secondBag: 60, overweight23to32: 80 },
      notes: "7 kg Starter fare. 14 kg with Flex or +7 kg add-on (no single item over 10 kg). No checked bag included on base fares."
    },
    ana: {
      name: "ANA", region: "asia-pacific", active: true,
      carryon: { limitKg: 10, limitLbs: 22, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 0, overweight23to32: 60 },
      notes: "10 kg combined carry-on + personal. 2 free checked bags on most international Economy fares."
    },
    jal: {
      name: "JAL", region: "asia-pacific", active: true,
      carryon: { limitKg: 10, limitLbs: 22, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 0, secondBag: 0, overweight23to32: 100 },
      notes: "10 kg firm limit all classes. 2 free checked bags on international. First Class allows up to 45 kg per bag."
    },
    airasia: {
      name: "AirAsia", region: "asia-pacific", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 20, standardLbs: 44, maxKg: 32 },
      fees: { firstBag: 30, secondBag: 50, overweightPerKg: 15 },
      notes: "7 kg strict (2 cabin items combined). No checked bag included. Xtra carry-on option adds up to 14 kg."
    },
    scoot: {
      name: "Scoot", region: "asia-pacific", active: true,
      carryon: { limitKg: 10, limitLbs: 22, enforcement: "strict" },
      checked: { standardKg: 20, standardLbs: 44, maxKg: 32 },
      fees: { firstBag: 30, secondBag: 50, overweightPerKg: 20 },
      notes: "10 kg (not 7 kg). ScootPlus gets 15 kg cabin. No checked bag on base fare."
    },

    // ── Canada ───────────────────────────────────────────────────────────────
    aircanada: {
      name: "Air Canada", region: "canada", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 45, secondBag: 60, overweight23to32: 100 },
      notes: "No carry-on weight limit. Only one overweight/oversize fee charged even if both apply."
    },

    // ── Catch-all presets ────────────────────────────────────────────────────
    "other-strict":   {
      name: "Other (7 kg limit)", region: "other", active: true,
      carryon: { limitKg: 7, limitLbs: 15.4, enforcement: "strict" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 60, overweight23to32: 100 },
      notes: "Generic strict 7 kg carrier."
    },
    "other-moderate": {
      name: "Other (8-10 kg limit)", region: "other", active: true,
      carryon: { limitKg: 9, limitLbs: 19.8, enforcement: "moderate" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 60, overweight23to32: 100 },
      notes: "Generic moderate carrier."
    },
    "other-none": {
      name: "Other (no limit)", region: "other", active: true,
      carryon: { limitKg: 0, limitLbs: 0, enforcement: "none" },
      checked: { standardKg: 23, standardLbs: 50, maxKg: 32 },
      fees: { firstBag: 40, secondBag: 60, overweight23to32: 100 },
      notes: "Generic no-limit carrier."
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // BAG EMPTY WEIGHTS BY VOLUME CLASS
  // ═══════════════════════════════════════════════════════════════════════════
  // Derived from verified manufacturer specs (May 2026).
  // Each class has low/typical/high ranges for backpack, softside roller,
  // hardside roller, and duffel where applicable.
  //
  // "low" = lightest realistic product in class
  // "typical" = median product weight
  // "high" = heavy/structured product in class

  var BAG_WEIGHTS = {
    "personal": {
      label: "Personal item (12-20L)",
      volumeRange: [12, 20],
      backpack:   { low: 0.25, typical: 0.40, high: 0.60 },
      softRoller: null,
      hardRoller: null,
      duffel:     null
    },
    "small-backpack": {
      label: "Small backpack (20-30L)",
      volumeRange: [20, 30],
      backpack:   { low: 0.50, typical: 0.70, high: 1.00 },
      softRoller: null,
      hardRoller: null,
      duffel:     { low: 0.40, typical: 0.60, high: 0.80 }
    },
    "travel-backpack": {
      label: "Travel backpack (30-45L)",
      volumeRange: [30, 45],
      backpack:   { low: 0.70, typical: 1.20, high: 2.30 },
      softRoller: null,
      hardRoller: null,
      duffel:     { low: 0.60, typical: 0.90, high: 1.50 }
    },
    "carryon-roller": {
      label: "Carry-on roller (30-50L)",
      volumeRange: [30, 50],
      backpack:   null,
      softRoller: { low: 2.20, typical: 2.60, high: 3.20 },
      hardRoller: { low: 2.10, typical: 3.00, high: 3.60 },
      duffel:     null
    },
    "medium-checked": {
      label: "Medium checked (55-75L)",
      volumeRange: [55, 75],
      backpack:   null,
      softRoller: { low: 2.80, typical: 3.50, high: 4.50 },
      hardRoller: { low: 2.80, typical: 3.90, high: 5.00 },
      duffel:     { low: 1.20, typical: 1.80, high: 2.50 }
    },
    "large-checked": {
      label: "Large checked (75-110L)",
      volumeRange: [75, 110],
      backpack:   null,
      softRoller: { low: 3.50, typical: 4.50, high: 6.20 },
      hardRoller: { low: 3.80, typical: 4.80, high: 6.40 },
      duffel:     { low: 1.50, typical: 2.20, high: 3.00 }
    },
    "xl-luggage": {
      label: "Extra-large (110-130L+)",
      volumeRange: [110, 140],
      backpack:   null,
      softRoller: { low: 3.60, typical: 5.00, high: 6.50 },
      hardRoller: { low: 4.20, typical: 5.50, high: 7.00 },
      duffel:     { low: 1.60, typical: 2.40, high: 4.80 }
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // OVERWEIGHT FEE ECONOMICS — SPLIT VS SINGLE BAG THRESHOLDS
  // ═══════════════════════════════════════════════════════════════════════════
  // Common decision points where splitting into two bags is cheaper.

  var FEE_ECONOMICS = {
    // Most US full-service airlines
    usStandard: {
      checkedLimit: 23,    // kg
      overweightFee: 100,  // 23-32 kg
      secondBagFee: 55,    // typical
      splitThreshold: 23,  // above this, consider splitting
      note: "At most US airlines, $100 overweight fee > $55 second bag fee. Always split above 23 kg."
    },
    // Frontier special case
    frontier: {
      checkedLimit: 18,    // kg (40 lb — lowest US carrier)
      overweightFee18to23: 75,
      overweightFee23to32: 100,
      secondBagFee: 65,
      splitThreshold: 18,
      note: "Frontier's 40 lb checked limit is the industry outlier. Overweight starts at just 41 lb."
    },
    // JetBlue steep overweight
    jetblue: {
      checkedLimit: 23,
      overweightFee: 150,  // steeper than industry
      secondBagFee: 45,
      splitThreshold: 23,
      note: "JetBlue's $150 overweight fee makes splitting into two bags nearly always the better choice."
    },
    // International weight concept
    intlWeightConcept: {
      note: "On weight-concept airlines (Emirates, Qatar, Singapore), overweight is per-kg. Extra weight is expensive: $15-50/kg. Staying under is critical."
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // ITEM WEIGHT MODELS
  // ═══════════════════════════════════════════════════════════════════════════
  // Per-unit weights (kg) derived from calculator.js ITEMS and verified
  // against real product weights. These are averages — individual items vary.

  var ITEM_WEIGHTS = {
    // Clothing (per unit)
    top:              0.15,  // t-shirt, blouse, short-sleeve shirt
    longSleeveShirt:  0.22,  // button-down, flannel
    underwear:        0.05,
    socks:            0.08,  // pair
    pants:            0.40,  // jeans, chinos, travel pants
    shorts:           0.25,
    skirt:            0.25,
    dress:            0.35,
    swimsuit:         0.15,

    // Outerwear / layers
    lightLayer:       0.40,  // windbreaker, light rain shell
    midLayer:         0.50,  // fleece, hoodie
    sweater:          0.45,  // knit sweater, cardigan
    insulatedJacket:  0.60,  // puffy, packable down
    heavyCoat:        1.20,  // parka, heavy winter coat
    rainJacket:       0.35,

    // Footwear
    sneakers:         0.70,  // pair, worn or packed
    boots:            1.20,  // hiking boots
    dressShoes:       0.90,  // pair
    sandals:          0.40,  // pair

    // Toiletries
    toiletryKit:      0.80,  // basic kit: toothbrush, paste, deodorant, razor, shampoo, etc.
    toiletryKitMinimal: 0.40, // ultralight: minimal liquids, bar soap, tiny tubes
    toiletryKitFull:  1.20,  // full-size bottles, makeup, medications, skincare

    // Electronics
    laptop:           1.40,  // 13-14" typical
    laptopCharger:    0.30,
    powerBank:        0.30,
    earbuds:          0.07,
    headphones:       0.25,  // over-ear
    phoneCharger:     0.10,  // cable + small adapter
    tablet:           0.50,
    camera:           0.80,  // mirrorless body
    lensCase:         0.60,  // extra lens + case
    cameraFull:       1.60,  // body + 2 lenses + charger

    // Specialty
    blazer:           0.55,
    suitSeparates:    1.00,  // blazer + dress pants
    formalDress:      0.60,
    tieAndBelt:       0.20,

    // Baby / family
    babyGear:         2.50,  // diapers, wipes, bottles, change of clothes, snacks per child
    strollerBag:      3.00,  // compact travel stroller (gate-checked free on most airlines)

    // Misc
    book:             0.35,
    daypack:          0.30,  // packable 15L daypack
    travelPillow:     0.25,
    umbrellaCompact:  0.30
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // PACKING STYLE MULTIPLIERS
  // ═══════════════════════════════════════════════════════════════════════════
  // Applied to clothing weight only. Matches calculator.js PROFILE_MULTIPLIERS.

  var STYLE_MULTIPLIERS = {
    ultralight: 0.70,   // minimal wardrobe, rewear, compression, lightweight fabrics
    light:      0.85,   // disciplined selection, some rewear, travel-friendly fabrics
    average:    1.05,   // typical traveler, some variety, standard fabrics
    comfort:    1.30    // outfit variety, heavier fabrics, extra options, safety items
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // CHILD WEIGHT MODEL
  // ═══════════════════════════════════════════════════════════════════════════
  // Children under 12 are NOT treated as a "packing style."
  // They create: shared gear, extra clothing volatility, snacks, medical items,
  // entertainment, stroller/baby gear, family bag-sharing logistics.

  var CHILD_MODEL = {
    clothingMultiplier: 0.55,  // kids' clothing weighs ~55% of adult equivalent
    extraGearPerChild:  0.50,  // snacks, entertainment, extra items beyond clothing
    babyGearPerChild:   2.50,  // diapers, wipes, bottles, changes (under 3 only)
    sharedItemsBase:    0.80   // first-aid, sunscreen, shared toiletries for family
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    AIRLINES:           AIRLINES,
    BAG_WEIGHTS:        BAG_WEIGHTS,
    FEE_ECONOMICS:      FEE_ECONOMICS,
    ITEM_WEIGHTS:       ITEM_WEIGHTS,
    STYLE_MULTIPLIERS:  STYLE_MULTIPLIERS,
    CHILD_MODEL:        CHILD_MODEL,

    // ── Helper: get airline by key ──────────────────────────────────────────
    getAirline: function (key) {
      return AIRLINES[key] || null;
    },

    // ── Helper: get carry-on limit (kg) ─────────────────────────────────────
    getCarryonLimit: function (key) {
      var a = AIRLINES[key];
      return a ? a.carryon.limitKg : 0;
    },

    // ── Helper: get checked limit (kg) ──────────────────────────────────────
    getCheckedLimit: function (key) {
      var a = AIRLINES[key];
      return a ? a.checked.standardKg : 23;
    },

    // ── Helper: get bag empty weight range ──────────────────────────────────
    getBagWeight: function (volumeClass, constructionType) {
      var cls = BAG_WEIGHTS[volumeClass];
      if (!cls) return null;
      return cls[constructionType] || null;
    },

    // ── Helper: list active airlines by region ──────────────────────────────
    getAirlinesByRegion: function (region) {
      var result = [];
      for (var key in AIRLINES) {
        if (AIRLINES[key].region === region && AIRLINES[key].active) {
          result.push({ key: key, name: AIRLINES[key].name });
        }
      }
      return result;
    },

    // ── Helper: should split bags? ──────────────────────────────────────────
    shouldSplitBags: function (airlineKey, totalCheckedKg) {
      var a = AIRLINES[airlineKey];
      if (!a) return { split: false, reason: "Unknown airline" };
      var limit = a.checked.standardKg;
      if (totalCheckedKg <= limit) return { split: false, reason: "Under weight limit" };
      var overFee = a.fees.overweight23to32 || 100;
      var secondBag = a.fees.secondBag || 55;
      if (overFee > secondBag) {
        return {
          split: true,
          reason: "Overweight fee ($" + overFee + ") exceeds second bag fee ($" + secondBag + "). Split into two bags.",
          savings: overFee - secondBag
        };
      }
      return { split: false, reason: "Overweight fee is comparable to second bag fee" };
    }
  };

})();
