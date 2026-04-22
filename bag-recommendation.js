/**
 * PackFitter Bag Recommendation Engine v2.0
 * ------------------------------------------
 * Dimension-driven, safe-first bag recommendations for airline pages.
 *
 * CORE PRINCIPLE:
 *   Recommend the SAFEST bag first (most reliable fit for the airline),
 *   then other bags that also work. Correctness and trust over variety.
 *
 * CLASSIFICATION:
 *   All carry_class values are DERIVED from bag dimensions via classifyBag().
 *   Manual carry_class assignments are NOT used as source of truth.
 *
 * BAG FAMILIES (page default + calculator override):
 *   - carry_on_backpack  (default on current airline backpack pages)
 *   - rolling_carry_on   (when user selects "suitcase-carryon" in calculator)
 *   - personal_item_backpack (only shown when placement = FLEX_PERSONAL)
 *
 * RECOMMENDATION STRUCTURE:
 *   A. Best Match    — top composite-ranked bag for the user's scenario
 *   B. Also Works    — other bags that pass airline fit checks
 *   C. Lower-Risk Fit (optional) — only when a truly more conservative option qualifies
 *                                  (clean pass, ≥10% smaller volume, capacity not larger)
 *
 * HOW TO USE:
 *   <script src="/bag-recommendation.js"></script>
 *   <div id="bagRecommendations"></div>
 *   Then call:
 *     window.recommendBags({
 *       airlineName: "Delta Air Lines",
 *       requiredCapacity: 35,
 *       bagFamily: "carry_on_backpack"   // or "rolling_carry_on"
 *     });
 */
(function () {
  "use strict";

  /* ==========================================================================
     SECTION 1 — BAG DATABASE
     All dims = overall external (H × W × D, inches, including wheels/handles)
     Capacity = normalized realistic (non-expanded)

     IMPORTANT: carry_class is NO LONGER manually assigned here.
     It is computed by classifyBag() at initialization from real dimensions.
     The old manual values are preserved in _legacy_class for audit only.
     ========================================================================== */
  var BAG_DB = [
    // --- ROLLING CARRY-ON (5) ---
    { name:"Maxlite\u00ae 5 Carry-On Spinner",              brand:"Travelpro",    cat:"Rolling Carry-On",  family:"rolling_carry_on",      cap:46, h:23,    w:14.5,  d:9,    price:"$$",  structure:"Softside",        amazon:true, url:"https://amzn.to/3Ou1OU8",     _legacy_class:"compact_carry_on" },
    { name:"Maxlite\u00ae 5 International Carry-On Spinner", brand:"Travelpro",   cat:"Rolling Carry-On",  family:"rolling_carry_on",      cap:39, h:21.75, w:15.75, d:7.75, price:"$$",  structure:"Softside",        amazon:true, url:"https://amzn.to/489bYQP",     _legacy_class:"international_carry_on" },
    { name:"Maxlite\u00ae 5 Compact Carry-On Spinner",       brand:"Travelpro",   cat:"Rolling Carry-On",  family:"rolling_carry_on",      cap:38, h:22,    w:14,    d:9,    price:"$$",  structure:"Softside",        amazon:true, url:"https://amzn.to/489bYQP",     _legacy_class:null },
    { name:"Samsonite Freeform Carry-On Spinner",            brand:"Samsonite",   cat:"Rolling Carry-On",  family:"rolling_carry_on",      cap:41, h:23,    w:15,    d:10,   price:"$$",  structure:"Hardside",        amazon:true, url:"https://amzn.to/486n7lo",     _legacy_class:"standard_carry_on" },
    { name:"Amazon Basics Hardside Carry-On Spinner",        brand:"Amazon Basics",cat:"Rolling Carry-On",  family:"rolling_carry_on",      cap:38, h:21.7,  w:14.8,  d:10,   price:"$",   structure:"Hardside",        amazon:true, url:"https://amzn.to/4eobGte",     _legacy_class:"standard_carry_on" },

    // --- CARRY-ON BACKPACK (8) ---
    { name:"Osprey Farpoint 40",                             brand:"Osprey",      cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:40, h:22,    w:14,    d:9,    price:"$$",  structure:"Soft/frameless",  amazon:true, url:"https://amzn.to/42jJu3j",     _legacy_class:"compact_carry_on" },
    { name:"Peak Design Travel Backpack 30L",                brand:"Peak Design", cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:30, h:20.9,  w:13,    d:7,    price:"$$$", structure:"Soft/structured", amazon:true, url:"https://amzn.to/4stFzM0",     _legacy_class:"international_carry_on" },
    { name:"Peak Design Travel Backpack 45L",                brand:"Peak Design", cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:45, h:22,    w:14,    d:9,    price:"$$$", structure:"Soft/structured", amazon:true, url:"https://amzn.to/4tLlYba",     _legacy_class:"compact_carry_on" },
    { name:"Nomatic Travel Bag 40L",                         brand:"Nomatic",     cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:40, h:21,    w:14,    d:9,    price:"$$$", structure:"Structured",      amazon:true, url:"https://amzn.to/4tOfSXz",     _legacy_class:"compact_carry_on" },
    { name:"Thule Subterra Backpack 34L",                    brand:"Thule",       cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:34, h:20.5,  w:12,    d:9,    price:"$$",  structure:"Soft/structured", amazon:true, url:"https://amzn.to/4sLW5Hv",     _legacy_class:null },
    { name:"Cotopaxi Allpa 35L Travel Pack",                 brand:"Cotopaxi",    cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:35, h:22,    w:12,    d:10,   price:"$$$", structure:"Soft/structured", amazon:true, url:"https://amzn.to/41EIM0A",     _legacy_class:"standard_carry_on" },
    { name:"Coowoz Travel Backpack 45L",                     brand:"Coowoz",      cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:45, h:18.5,  w:12.6,  d:8.7,  price:"$",   structure:"Soft",            amazon:true, url:"https://amzn.to/41J1ofN",     _legacy_class:"compact_carry_on" },
    { name:"Tortuga Expandable Travel Backpack, 27-32.5L",   brand:"Tortuga",     cat:"Carry-On Backpack", family:"carry_on_backpack",     cap:27, h:19.2,  w:12.5,  d:6.9,  price:"$$",  structure:"Soft/structured", amazon:true, url:"https://amzn.to/41J1ofN",     _legacy_class:null },

    // --- PERSONAL ITEM (3) ---
    { name:"Matein Travel Laptop Backpack",                  brand:"Matein",      cat:"Personal Item",     family:"personal_item_backpack", cap:28, h:18,    w:12,    d:7.8,  price:"$",   structure:"Soft",            amazon:true, url:"https://amzn.to/4tgPOo5",     _legacy_class:"personal_item" },
    { name:"Samsonite Xenon 3.0 Slim Backpack",              brand:"Samsonite",   cat:"Personal Item",     family:"personal_item_backpack", cap:20, h:16.5,  w:12,    d:6,    price:"$$",  structure:"Soft/ballistic",  amazon:true, url:"https://amzn.to/42issm8",     _legacy_class:"personal_item" },
    { name:"Osprey Daylite",                                 brand:"Osprey",      cat:"Personal Item",     family:"personal_item_backpack", cap:13, h:17.5,  w:10,    d:8,    price:"$$",  structure:"Soft/frameless",  amazon:true, url:"https://amzn.to/42a2kKi",     _legacy_class:"personal_item" },

    // --- CHECKED SUITCASE (2) ---
    // Only shown on trip-intent / destination-intent pages, never on airline bag-fit pages.
    // Gated by PAGE_ALLOWS_CHECKED_BAG_RECS flag (set per page).
    { name:"SWISSGEAR Sion Softside 25\" Spinner",           brand:"SwissGear",   cat:"Checked Suitcase",  family:"checked_suitcase",       cap:68, h:25,    w:16,    d:11,   price:"$$",  structure:"Softside",        amazon:true, url:"https://amzn.to/4e6OTlL",     _legacy_class:null },
    { name:"Samsonite Omni PC Hardside 28\" Spinner",        brand:"Samsonite",   cat:"Checked Suitcase",  family:"checked_suitcase",       cap:85, h:28,    w:20.5,  d:13.5, price:"$$",  structure:"Hardside",        amazon:true, url:"https://amzn.to/4mGfKY5",     _legacy_class:null }
  ];


  /* ==========================================================================
     SECTION 2 — DIMENSION-DERIVED CLASSIFICATION
     classifyBag() is the ONLY source of truth for carry_class.
     Same thresholds apply to backpacks and suitcases.
     ========================================================================== */

  /**
   * classifyBag(bag) — Derive carry class from actual bag dimensions.
   *
   * @param {object} bag — must have h, w, d (inches, including wheels/handles)
   * @returns {string} one of: personal_item, international_carry_on,
   *                   compact_carry_on, standard_carry_on, checked
   *
   * Thresholds are checked most-restrictive-first:
   *   personal_item:          h ≤ 18  AND  w ≤ 14  AND  d ≤ 8
   *   international_carry_on: h ≤ 22  AND  w ≤ 14  AND  d ≤ 8
   *   compact_carry_on:       h ≤ 22  AND  w ≤ 14  AND  d ≤ 9
   *   standard_carry_on:      h ≤ 23  AND  w ≤ 15  AND  d ≤ 10
   *   checked:                anything larger
   */
  function classifyBag(bag) {
    var h = bag.h, w = bag.w, d = bag.d;
    if (h <= 18 && w <= 14 && d <= 8)  return "personal_item";
    if (h <= 22 && w <= 14 && d <= 8)  return "international_carry_on";
    if (h <= 22 && w <= 14 && d <= 9)  return "compact_carry_on";
    if (h <= 23 && w <= 15 && d <= 10) return "standard_carry_on";
    return "checked";
  }


  /* --- Apply classifyBag() to every bag at initialization --- */
  for (var i = 0; i < BAG_DB.length; i++) {
    BAG_DB[i].carry_class = classifyBag(BAG_DB[i]);
  }


  /* ==========================================================================
     SECTION 2a — CARRY CLASS LABELS
     User-facing display strings for each dimensional carry class.
     ========================================================================== */
  var CARRY_CLASS_LABEL = {
    "personal_item":          "Personal Item",
    "international_carry_on": "International Carry-On",
    "compact_carry_on":       "Safe US Carry-On",
    "standard_carry_on":      "Max-Size Carry-On",
    "checked":                "Checked / Oversized"
  };


  /* ==========================================================================
     SECTION 3 — AIRLINE TYPE CLASSIFICATION
     ========================================================================== */
  var AIRLINE_TYPES = {
    // STANDARD_US — flexible enforcement, gate agents rarely measure
    "American Airlines":  "STANDARD_US",
    "Delta Air Lines":    "STANDARD_US",
    "United Airlines":    "STANDARD_US",
    "Southwest Airlines": "STANDARD_US",
    "JetBlue":            "STANDARD_US",
    "Alaska Airlines":    "STANDARD_US",

    // STRICT — hard sizer enforcement, zero tolerance
    "Ryanair":            "STRICT",
    "Spirit Airlines":    "STRICT",
    "Frontier Airlines":  "STRICT",
    "EasyJet":            "STRICT",

    // INTERNATIONAL_STANDARD — measured but some tolerance
    "Air Canada":         "INTERNATIONAL_STANDARD",
    "British Airways":    "INTERNATIONAL_STANDARD",
    "Lufthansa":          "INTERNATIONAL_STANDARD",
    "Air France":         "INTERNATIONAL_STANDARD",
    "Emirates":           "INTERNATIONAL_STANDARD",
    "Singapore Airlines": "INTERNATIONAL_STANDARD",
    "Cathay Pacific":     "INTERNATIONAL_STANDARD",
    "Qantas":             "INTERNATIONAL_STANDARD",
    "KLM":                "INTERNATIONAL_STANDARD",
    "Turkish Airlines":   "INTERNATIONAL_STANDARD"
  };


  /* ==========================================================================
     SECTION 4 — TOLERANCE RULES
     Returns "PASS" | "BORDERLINE" | "FAIL" for a single dimension diff.
     ========================================================================== */
  function dimStatus(diff, dimType, airlineType) {
    // STRICT — zero tolerance on every dimension
    if (airlineType === "STRICT") {
      return diff <= 0 ? "PASS" : "FAIL";
    }

    // INTERNATIONAL_STANDARD
    if (airlineType === "INTERNATIONAL_STANDARD") {
      if (dimType === "depth") {
        if (diff <= 0)   return "PASS";
        if (diff <= 0.5) return "BORDERLINE";
        return "FAIL";
      }
      if (dimType === "width") {
        if (diff <= 0) return "PASS";
        if (diff <= 1) return "BORDERLINE";
        return "FAIL";
      }
      // height
      if (diff <= 0) return "PASS";
      if (diff <= 1) return "BORDERLINE";
      return "FAIL";
    }

    // STANDARD_US (default)
    if (dimType === "depth") {
      if (diff <= 0) return "PASS";
      if (diff <= 1) return "BORDERLINE";
      return "FAIL";
    }
    if (dimType === "width") {
      if (diff <= 0) return "PASS";
      if (diff <= 1) return "BORDERLINE";
      return "FAIL";
    }
    // height — wheels tolerated on US domestic
    if (diff <= 1) return "PASS";
    if (diff <= 2) return "BORDERLINE";
    return "FAIL";
  }


  /* ==========================================================================
     SECTION 5 — AIRLINE COMPLIANCE SCORING
     Computes a numeric compliance score for a bag against airline limits.
     Higher score = safer fit.
     ========================================================================== */

  /**
   * scoreBagFit(bag, airlineLimits, airlineType)
   *
   * Returns { score, status, hDiff, wDiff, dDiff, hStatus, wStatus, dStatus }
   *
   * score breakdown:
   *   100 = all dims PASS with margin
   *   80  = all dims PASS, tight
   *   50  = one or more BORDERLINE
   *   0   = any dim FAIL (bag is excluded)
   *
   * Within PASS: score adjusted by total margin (more margin = higher)
   * Backpacks get a small bonus for being compressible (soft-sided).
   */
  function scoreBagFit(bag, airlineLimits, airlineType) {
    if (!airlineLimits) return { score: 50, status: "unknown" };

    var hDiff = bag.h - airlineLimits.maxH;
    var wDiff = bag.w - airlineLimits.maxW;
    var dDiff = bag.d - airlineLimits.maxD;

    var hS = dimStatus(hDiff, "height", airlineType);
    var wS = dimStatus(wDiff, "width",  airlineType);
    var dS = dimStatus(dDiff, "depth",  airlineType);

    var result = {
      hDiff: hDiff, wDiff: wDiff, dDiff: dDiff,
      hStatus: hS, wStatus: wS, dStatus: dS
    };

    // Any FAIL → exclude entirely
    if (hS === "FAIL" || wS === "FAIL" || dS === "FAIL") {
      result.score = 0;
      result.status = "fail";
      return result;
    }

    // Any BORDERLINE → limited score
    if (hS === "BORDERLINE" || wS === "BORDERLINE" || dS === "BORDERLINE") {
      // Base 50, small bonus for margin on passing dims
      var borderlineCount = (hS === "BORDERLINE" ? 1 : 0) + (wS === "BORDERLINE" ? 1 : 0) + (dS === "BORDERLINE" ? 1 : 0);
      result.score = 50 - (borderlineCount * 5);
      result.status = "borderline";
      return result;
    }

    // All PASS — score by total margin (negative diff = room to spare)
    var totalMargin = (-hDiff) + (-wDiff) + (-dDiff);
    // Base 80, up to 100 based on margin
    result.score = Math.min(100, 80 + Math.floor(totalMargin * 2));
    result.status = "pass";

    return result;
  }


  /* ==========================================================================
     SECTION 5a — COMPOSITE RANKING (v2.1 — real-world usefulness + conversion)
     All scoring is derived from existing BAG_DB fields. No ranking fields
     are stored on bags themselves.

     Final score = weighted sum of six sub-scores:
       capacityMatchScore  × 0.40   (MOST IMPORTANT)
       fitQualityScore     × 0.25
       categoryBoostScore  × 0.10
       priceSweetSpotScore × 0.10
       brandTrustScore     × 0.10
       marginScore         × 0.05   (tiebreaker only)

     Hard-filter rules (must pass BEFORE scoring):
       - Bag must fit airline limits (fit.status !== "fail")
       - Bag must be in the selected bag family
       - Carry-on recs exclude "checked"-classified bags
     ========================================================================== */

  /**
   * capacityMatchScore — how close is bag capacity to required capacity?
   * 0 diff = 1.0, ±5L ≈ 0.75, ±10L ≈ 0.5, beyond ±20L = 0
   * THIS IS THE PRIMARY DRIVER. A 27L bag must never outrank a 40L bag
   * on a 40L use case if both fit the airline.
   */
  function capacityMatchScore(bagCap, required) {
    if (!required) return 0.5;
    var diff = Math.abs(bagCap - required);
    return Math.max(0, 1 - (diff / 20));
  }

  /**
   * fitQualityScore — does the bag actually hold the gear without compression?
   * Prefer bags whose capacity >= required. Penalize under-capacity and
   * heavily over-capacity bags.
   */
  function fitQualityScore(bag, required) {
    if (!required) return 0.5;
    if (bag.cap >= required) {
      // Bag is big enough. Penalize if way oversized (>50% larger than needed).
      if (bag.cap > required * 1.5) return 0.6;
      return 1.0;
    }
    // Compression required — how much shortfall?
    var shortfall = required - bag.cap;
    return Math.max(0, 1 - (shortfall / 15));
  }

  /**
   * categoryBoostScore — soft boost for matching bag family.
   * Since getRecommendations() already filters by family, all surviving
   * candidates get 1.0 here. Reserved for future cross-family bonuses.
   */
  function categoryBoostScore(bag, bagFamily) {
    return bag.family === bagFamily ? 1.0 : 0.5;
  }

  /**
   * priceSweetSpotScore — boost bags in the $80–$180 conversion sweet spot.
   * $$ tier = sweet spot, $ tier = budget (lower conversion ceiling),
   * $$$ tier = premium (smaller audience but higher ticket).
   */
  function priceSweetSpotScore(bag) {
    if (bag.price === "$$")  return 1.00;
    if (bag.price === "$")   return 0.65;
    if (bag.price === "$$$") return 0.55;
    return 0.50;
  }

  /**
   * brandTrustScore — light boost for recognized brands.
   * Tiered by conversion strength, not raw brand prestige.
   * Capped at 10% of total score per spec ("do not overpower capacity match").
   */
  var BRAND_TRUST = {
    "Osprey":       1.00,
    "Travelpro":    1.00,
    "Samsonite":    1.00,
    "Peak Design":  0.85,
    "Thule":        0.80,
    "Cotopaxi":     0.80,
    "Nomatic":      0.75,
    "SwissGear":    0.75,
    "Tortuga":      0.70,
    "JanSport":     0.70,
    "Matein":       0.65,
    "Amazon Basics":0.60,
    "Coowoz":       0.50,
    "Taygeer":      0.45,
    "Coofay":       0.45
  };
  function brandTrustScore(bag) {
    return BRAND_TRUST[bag.brand] || 0.50;
  }

  /**
   * marginScore — dimensional margin from airline limits (tiebreaker only).
   * pass with >6" total margin ≈ 1.0, 0 margin ≈ 0.5, borderline ≈ 0.3.
   */
  function marginScore(fit) {
    if (!fit || fit.status === "unknown") return 0.5;
    if (fit.status === "borderline") return 0.3;
    if (fit.status === "pass") {
      var totalMargin = (-fit.hDiff) + (-fit.wDiff) + (-fit.dDiff);
      return Math.min(1.0, 0.5 + (totalMargin / 12));
    }
    return 0;
  }

  /**
   * computeCompositeScore — combine all sub-scores with weights from spec.
   */
  function computeCompositeScore(bag, requiredCapacity, bagFamily) {
    var cap   = capacityMatchScore(bag.cap, requiredCapacity);
    var fit   = fitQualityScore(bag, requiredCapacity);
    var cat   = categoryBoostScore(bag, bagFamily);
    var price = priceSweetSpotScore(bag);
    var brand = brandTrustScore(bag);
    var marg  = marginScore(bag._fit);

    // Store sub-scores for debugging / reason-string use
    bag._subScores = { cap:cap, fit:fit, cat:cat, price:price, brand:brand, margin:marg };

    return (
      cap   * 0.40 +
      fit   * 0.25 +
      cat   * 0.10 +
      price * 0.10 +
      brand * 0.10 +
      marg  * 0.05
    );
  }


  /* ==========================================================================
     SECTION 6 — CORE RECOMMENDATION LOGIC (SAFE-FIRST)
     ========================================================================== */

  /**
   * getRecommendations(opts)
   *
   * @param {string}  opts.airlineName       — airline name (matches AIRLINE_TYPES keys)
   * @param {number}  [opts.requiredCapacity] — liters the user needs (from calculator)
   * @param {string}  [opts.bagFamily]        — "carry_on_backpack" | "rolling_carry_on" | "personal_item_backpack"
   * @param {string}  [opts.placement]        — "FLEX_PERSONAL" | "FLEX_CARRY_ON" | "CARRY_ON" | "TOO_LARGE"
   *
   * Returns { safest: bag|null, alsoWorks: [bags], stricterOption: bag|null, excluded: [bags] }
   */
  function getRecommendations(opts) {
    var airlineName      = opts.airlineName || null;
    var requiredCapacity = opts.requiredCapacity || 35;
    var placement        = opts.placement || null;

    // --- Step 1: Determine bag family ---
    // Page default = carry_on_backpack.
    // Calculator bagType override: "suitcase-carryon" → rolling_carry_on
    //                              "suitcase-checked" → (checked mode, not yet implemented)
    //                              "backpack" → carry_on_backpack
    var bagFamily = opts.bagFamily || "carry_on_backpack";

    // Placement can refine but doesn't replace family selection
    // FLEX_PERSONAL → switch to personal_item_backpack if family is carry_on_backpack
    if (placement === "FLEX_PERSONAL" && bagFamily === "carry_on_backpack") {
      bagFamily = "personal_item_backpack";
    }

    // --- Step 2: Filter by bag family ---
    // Rule: do NOT mix personal item bags into carry-on recommendations
    var candidates = BAG_DB.filter(function (b) {
      return b.family === bagFamily;
    });

    // Further filter: exclude "checked" classified bags from BACKPACK recommendations only.
    // Rollers are allowed through — their airline fit is judged by the per-dimension
    // tolerance rules in scoreBagFit(), not by the coarse classifyBag() bucket.
    // Personal item pages also skip this filter (their own size tier applies).
    if (bagFamily === "carry_on_backpack") {
      candidates = candidates.filter(function (b) {
        return b.carry_class !== "checked";
      });
    }

    if (candidates.length === 0) {
      return { safest: null, alsoWorks: [], stricterOption: null, excluded: [] };
    }

    // --- Step 3: Get airline limits ---
    var airlineType = null;
    var airlineLimits = null;

    if (airlineName) {
      airlineType = AIRLINE_TYPES[airlineName] || "STANDARD_US";

      // Read airline dims from page-level AIRLINES array if available
      var airlines = window.AIRLINES || [];
      var match = null;
      for (var a = 0; a < airlines.length; a++) {
        if (airlines[a].name === airlineName) { match = airlines[a]; break; }
      }
      if (match) {
        // coL = max height, coW = max width, coH = max depth
        airlineLimits = { maxH: match.coL, maxW: match.coW, maxD: match.coH };
      }
    }

    // --- Step 4: Score every candidate against airline ---
    var scored = [];
    var excluded = [];

    for (var c = 0; c < candidates.length; c++) {
      var bag = candidates[c];
      var fit = scoreBagFit(bag, airlineLimits, airlineType);
      bag._fit = fit;
      bag._capDist = Math.abs(bag.cap - requiredCapacity);

      if (fit.status === "fail") {
        excluded.push(bag);
      } else {
        scored.push(bag);
      }
    }

    // --- Step 4.5: Hard capacity filter (backpack pages only) ---
    // Never recommend a backpack smaller than what the calculator says
    // the user needs. Undersized bags are dropped BEFORE ranking so they
    // cannot appear in any slot (Safest, Also Works, or Stricter Option).
    //
    // Scope: carry_on_backpack only. rolling_carry_on and
    // personal_item_backpack are NOT subject to this rule yet.
    if (bagFamily === "carry_on_backpack" && requiredCapacity) {
      var capacityPassing = [];
      for (var k = 0; k < scored.length; k++) {
        if (scored[k].cap >= requiredCapacity) {
          capacityPassing.push(scored[k]);
        } else {
          excluded.push(scored[k]);
        }
      }
      scored = capacityPassing;
    }

    // --- Step 5: Rank scored bags by composite score ---
    // Ranking v2.1 — prioritize real-world usefulness and conversion, NOT margin.
    // Score formula (weights per spec):
    //   capacity*0.40 + fit*0.25 + category*0.10 + price*0.10 + brand*0.10 + margin*0.05
    //
    // HARD RULE enforced by capacityMatchScore + fitQualityScore (both 0.65 total weight):
    //   A 27L bag can NEVER outrank a 40L bag on a 40L use case if both fit airline rules.
    for (var i = 0; i < scored.length; i++) {
      scored[i]._compositeScore = computeCompositeScore(
        scored[i], requiredCapacity, bagFamily
      );
    }

    scored.sort(function (a, b) {
      // Primary: composite score (descending)
      if (a._compositeScore !== b._compositeScore) {
        return b._compositeScore - a._compositeScore;
      }
      // Tiebreaker 1: compliance fit score (prefer safer fit)
      if (a._fit.score !== b._fit.score) return b._fit.score - a._fit.score;
      // Tiebreaker 2: capacity closeness to requirement
      return a._capDist - b._capDist;
    });

    // --- Step 6: Assign recommendation slots (top 3–5 cap per spec) ---
    // A. Best Match     = top composite score (real-world best for this use case)
    // B. Also Works     = next 2 composite-ranked bags
    // C. Lower-Risk Fit = optional truly-conservative alternate. Strict gating:
    //                     must pass airline fit, not be the best-match itself,
    //                     have ≥10% smaller external volume footprint, and have
    //                     capacity that is NOT larger than best-match capacity.
    //                     Surfaced only when meaningfully more conservative for
    //                     stricter enforcement (STRICT airline or best-match is
    //                     classified standard_carry_on / borderline-fit).
    //
    // Total display is capped at 3–5 bags (best + up to 2 alsoWorks + 1 lower-risk).

    // Cap the working set at 5 to prevent accidental over-display
    scored = scored.slice(0, 5);

    var safest = scored.length > 0 ? scored[0] : null;
    var alsoWorks = scored.length > 1 ? scored.slice(1) : [];

    // Cap Also Works at 2 bags (total core display = up to 3)
    alsoWorks = alsoWorks.slice(0, 2);

    // Find a Lower-Risk Fit candidate. Must satisfy ALL of the following:
    //   1. Passes airline fit (status === "pass", not borderline)
    //   2. Is NOT the best-match bag
    //   3. External volume footprint ≥10% smaller than best-match
    //   4. Capacity is NOT larger than best-match capacity
    //   5. Context is one where a more conservative option is meaningful
    //      (STRICT airline, OR best-match is borderline-fit, OR best-match
    //      is classified standard_carry_on)
    var stricterOption = null;
    if (safest && scored.length > 1) {
      var contextWantsConservative =
        (airlineType === "STRICT") ||
        (safest._fit && safest._fit.status === "borderline") ||
        (safest.carry_class === "standard_carry_on");

      if (contextWantsConservative) {
        var safestVol = safest.h * safest.w * safest.d;
        // Search smallest-volume first so the most conservative qualifier wins
        var smallestByVolume = scored.slice().sort(function (a, b) {
          return (a.h * a.w * a.d) - (b.h * b.w * b.d);
        });
        for (var s = 0; s < smallestByVolume.length; s++) {
          var candidate = smallestByVolume[s];
          if (candidate === safest) continue;                          // (2)
          if (!candidate._fit || candidate._fit.status !== "pass") continue; // (1) clean pass only
          if (candidate.cap > safest.cap) continue;                    // (4) not larger capacity
          var candidateVol = candidate.h * candidate.w * candidate.d;
          if (candidateVol >= safestVol * 0.90) continue;              // (3) ≥10% smaller volume
          stricterOption = candidate;                                  // (5) context already gated above
          break;
        }
        if (stricterOption) {
          alsoWorks = alsoWorks.filter(function (b) { return b !== stricterOption; });
        }
      }
    }

    // Build reason strings
    if (safest) safest._reason = buildSafestReason(safest, airlineLimits);
    for (var w = 0; w < alsoWorks.length; w++) {
      alsoWorks[w]._reason = buildAlsoWorksReason(alsoWorks[w], airlineLimits);
    }
    if (stricterOption) stricterOption._reason = buildStricterReason(stricterOption, airlineLimits);

    return {
      safest: safest,
      alsoWorks: alsoWorks,
      stricterOption: stricterOption,
      excluded: excluded
    };
  }


  /* ==========================================================================
     SECTION 6a — REASON STRINGS
     ========================================================================== */
  function buildSafestReason(bag, limits) {
    if (!limits) return "Reliable fit for most airlines based on dimensions";
    var hMargin = limits.maxH - bag.h;
    var wMargin = limits.maxW - bag.w;
    var dMargin = limits.maxD - bag.d;
    var minMargin = Math.min(hMargin, wMargin, dMargin);

    if (minMargin >= 1) {
      return "Fits within airline limits with room to spare on all dimensions";
    }
    if (minMargin >= 0) {
      return "Fits within airline limits on all dimensions";
    }
    // Borderline on at least one dim (backpacks may compress)
    if (bag.family === "carry_on_backpack") {
      return "Fits airline limits \u2014 soft-sided design allows minor compression if needed";
    }
    return "Fits airline limits, though one dimension is tight";
  }

  function buildAlsoWorksReason(bag, limits) {
    if (!limits) return "Good option for this trip length";
    var fit = bag._fit;
    if (fit.status === "pass") {
      return "Also fits within airline limits \u2014 more capacity for longer trips";
    }
    // Borderline
    var parts = [];
    if (fit.dStatus === "BORDERLINE") parts.push("depth " + bag.d + "\" vs " + limits.maxD + "\" limit");
    if (fit.wStatus === "BORDERLINE") parts.push("width " + bag.w + "\" vs " + limits.maxW + "\" limit");
    if (fit.hStatus === "BORDERLINE") parts.push("height " + bag.h + "\" vs " + limits.maxH + "\" limit");
    var dimNote = parts.length > 0 ? " (" + parts.join(", ") + ")" : "";
    if (bag.family === "carry_on_backpack") {
      return "Usually works \u2014 soft-sided bags can compress slightly" + dimNote;
    }
    return "Usually works if not overpacked" + dimNote;
  }

  function buildStricterReason(bag, limits) {
    if (!limits) return "Smaller and more conservative fit for stricter airline enforcement";
    return "Smaller and more conservative fit for stricter airline enforcement";
  }


  /* ==========================================================================
     SECTION 7 — RENDERING
     ========================================================================== */
  function injectBagRecStyles() {
    if (document.getElementById("bag-rec-engine-styles")) return;
    var style = document.createElement("style");
    style.id = "bag-rec-engine-styles";
    style.textContent = [
      ".bag-rec-section { margin-top: 24px; }",
      ".bag-rec-section:first-child { margin-top: 0; }",
      ".bag-rec-section-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; color: #1a1a1a; }",
      ".bag-rec-section-title.safest { color: #166534; }",
      ".bag-rec-section-title.also-works { color: #1e40af; }",
      ".bag-rec-section-title.stricter { color: #6b21a8; }",
      "",
      ".bag-rec-card { background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06); transition: box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease; }",
      ".bag-rec-card:hover { border-color: #9ca3af; box-shadow: 0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.08); transform: translateY(-1px); }",
      ".bag-rec-card.safest { border-left: 5px solid #22c55e; }",
      ".bag-rec-card.also-works { border-left: 5px solid #3b82f6; }",
      ".bag-rec-card.stricter { border-left: 5px solid #a855f7; }",
      "",
      ".bag-rec-card-info { flex: 1; }",
      ".bag-rec-card-name { font-size: 14px; font-weight: 600; color: #111; }",
      ".bag-rec-card-meta { font-size: 12px; color: #6b7280; margin-top: 2px; }",
      ".bag-rec-card-reason { font-size: 12px; color: #374151; margin-top: 4px; }",
      ".bag-rec-card-reason.safest { color: #166534; }",
      ".bag-rec-card-reason.stricter { color: #6b21a8; }",
      "",
      ".bag-rec-card-cta { flex-shrink: 0; margin-left: 16px; }",
      ".bag-rec-card-cta a { display: inline-block; padding: 8px 12px; font-size: 13px; font-weight: 600; color: #fff; background: #f97316; border-radius: 6px; text-decoration: none; white-space: nowrap; transition: background 0.15s ease; }",
      ".bag-rec-card-cta a:hover { background: #ea580c; }",
      ".bag-rec-card-cta a:active { background: #c2410c; }",
      "",
      ".bag-rec-trust { font-size: 12px; color: #9ca3af; margin-top: 14px; }",
      ".bag-rec-none { font-size: 13px; color: #6b7280; padding: 10px 0; }",
      "",
      ".personal-item-suggestion { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px 22px; margin-bottom: 20px; }",
      ".personal-item-suggestion h3 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin: 0 0 6px 0; }",
      ".personal-item-suggestion > p { font-size: 0.85rem; color: #555; line-height: 1.5; margin: 0 0 12px 0; }",
      "",
      "@media (max-width: 600px) {",
      "  .bag-rec-card { flex-direction: column; align-items: flex-start; }",
      "  .bag-rec-card-cta { margin-left: 0; margin-top: 10px; }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function renderBagCard(bag, slot) {
    var classLabel = CARRY_CLASS_LABEL[bag.carry_class] || bag.cat;
    var reason = bag._reason || "";
    var reasonCls = "bag-rec-card-reason";
    if (slot === "safest") reasonCls += " safest";
    if (slot === "stricter") reasonCls += " stricter";
    var href = bag.url || "#";

    // Dims display
    var dimsStr = bag.h + ' \u00d7 ' + bag.w + ' \u00d7 ' + bag.d + '"';

    return [
      '<div class="bag-rec-card ' + slot + '">',
      '  <div class="bag-rec-card-info">',
      '    <div class="bag-rec-card-name">' + bag.name + '</div>',
      '    <div class="bag-rec-card-meta">' + bag.cap + 'L \u00b7 ' + classLabel + ' \u00b7 ' + dimsStr + ' \u00b7 ' + bag.price + '</div>',
      '    <div class="' + reasonCls + '">' + reason + '</div>',
      (bag.name === "Osprey Farpoint 40" ? '    <div style="font-size:0.75rem; color:#6b7280; margin-top:4px;">Also available in a women\u2019s-specific fit: <a href="https://amzn.to/3Q7zPdE" target="_blank" rel="nofollow sponsored noopener" style="color:#3b82f6; text-decoration:none;">Osprey Fairview 40</a></div>' : ''),
      '  </div>',
      '  <div class="bag-rec-card-cta">',
      '    <a href="' + href + '" target="_blank" rel="nofollow sponsored noopener">Check Price \u2192</a>',
      '  </div>',
      '</div>'
    ].join("");
  }


  /* ==========================================================================
     SECTION 8 — PUBLIC API
     ========================================================================== */

  /**
   * recommendBags(opts)
   *
   * @param {string}  opts.airlineName        — airline name
   * @param {number}  [opts.requiredCapacity]  — liters needed (default 35)
   * @param {string}  [opts.bagFamily]         — "carry_on_backpack" | "rolling_carry_on" | "personal_item_backpack"
   * @param {string}  [opts.placement]         — placement from calculator
   * @param {string}  [opts.containerId]       — DOM id (default "bagRecommendations")
   * @returns {object} { safest, alsoWorks, stricterOption, excluded }
   */
  function recommendBags(opts) {
    opts = opts || {};
    var containerId = opts.containerId || "bagRecommendations";

    // Map calculator bagType to family
    if (opts.bagType && !opts.bagFamily) {
      if (opts.bagType === "suitcase-carryon") {
        opts.bagFamily = "rolling_carry_on";
      } else if (opts.bagType === "suitcase-checked") {
        opts.bagFamily = "checked_bag"; // future: checked bag path
      } else {
        opts.bagFamily = "carry_on_backpack";
      }
    }

    // Compute recommendations
    var result = getRecommendations(opts);

    // Render
    injectBagRecStyles();
    var container = document.getElementById(containerId);
    if (!container) return result;

    var html = "";

    if (!result.safest && result.alsoWorks.length === 0) {
      html = '<div class="bag-rec-none">No bags in our database match this airline and bag type combination. Try adjusting your settings or check a different airline.</div>';
    } else {
      // A. Best Match
      if (result.safest) {
        html += '<div class="bag-rec-section">';
        html += '<div class="bag-rec-section-title safest">Best Match</div>';
        html += renderBagCard(result.safest, "safest");
        html += '</div>';
      }

      // B. Also Works
      if (result.alsoWorks.length > 0) {
        html += '<div class="bag-rec-section">';
        html += '<div class="bag-rec-section-title also-works">Also Works</div>';
        for (var i = 0; i < result.alsoWorks.length; i++) {
          html += renderBagCard(result.alsoWorks[i], "also-works");
        }
        html += '</div>';
      }

      // C. Lower-Risk Fit (only when a truly more-conservative candidate qualified)
      if (result.stricterOption) {
        html += '<div class="bag-rec-section">';
        html += '<div class="bag-rec-section-title stricter">Lower-Risk Fit</div>';
        html += renderBagCard(result.stricterOption, "stricter");
        html += '</div>';
      }

      html += '<div class="bag-rec-trust">Recommendations ranked by airline compliance, based on real bag dimensions vs published limits.</div>';
    }

    container.innerHTML = html;

    // Show the parent card if hidden
    var parentCard = document.getElementById("bagRecommendationsCard");
    if (parentCard && result.safest) {
      parentCard.style.display = "";
    }

    return result;
  }


  /* ==========================================================================
     SECTION 9 — CHECKED-BAG RECOMMENDATION SYSTEM (PAGE-TYPE GATED)
     ========================================================================== */

  /**
   * PAGE-TYPE GATING RULES:
   *
   * Checked-bag product cards are ONLY allowed on trip-intent or
   * destination-intent pages. They are NEVER shown on airline bag-fit
   * pages (including airline-specific backpack or personal-item pages).
   *
   * Eligible pages must set:
   *   window.PAGE_ALLOWS_CHECKED_BAG_RECS = true;
   *
   * Airline pages set PAGE_IS_BAG_SPECIFIC = true and do NOT set
   * PAGE_ALLOWS_CHECKED_BAG_RECS, so they are automatically excluded.
   *
   * OVERFLOW CONDITIONS (at least one must be true):
   *   - requiredVolume > 45 (exceeds practical carry-on range)
   *   - recommendedBagSize > 45L
   *   - user selected "suitcase-checked" as bag type
   *   - page intent flag indicates bulky packing (cruise, winter, Alaska)
   *
   * FRAMING:
   *   Carry-on recommendations remain primary. Checked-bag recs appear
   *   BELOW carry-on recs as a conditional fallback with softer framing.
   */

  /**
   * shouldShowCheckedBagRecs(opts)
   *
   * Returns true if ALL gating conditions are met:
   *   1. Page has opted in (PAGE_ALLOWS_CHECKED_BAG_RECS === true)
   *   2. Page is NOT an airline bag-fit page (PAGE_IS_BAG_SPECIFIC !== true)
   *   3. At least one overflow condition is met
   *
   * @param {object} opts
   * @param {number} opts.requiredVolume  — liters needed from calculator
   * @param {string} opts.bagType         — "backpack" | "suitcase-carryon" | "suitcase-checked"
   * @param {number} opts.recommendedSize — recommended bag size in liters
   * @param {boolean} opts.bulkyIntent    — true for cruise, Alaska, winter pages
   */
  function shouldShowCheckedBagRecs(opts) {
    // Gate 1: page must opt in
    if (typeof window.PAGE_ALLOWS_CHECKED_BAG_RECS === "undefined" ||
        !window.PAGE_ALLOWS_CHECKED_BAG_RECS) {
      return false;
    }

    // Gate 2: airline bag-fit pages are always excluded
    if (typeof window.PAGE_IS_BAG_SPECIFIC !== "undefined" &&
        window.PAGE_IS_BAG_SPECIFIC) {
      return false;
    }

    // Gate 3: at least one overflow condition
    var vol    = opts.requiredVolume || 0;
    var bag    = opts.bagType || "backpack";
    var recSize = opts.recommendedSize || 0;
    var bulky  = opts.bulkyIntent || false;

    if (vol > 45)                      return true;
    if (recSize > 45)                  return true;
    if (bag === "suitcase-checked")    return true;
    if (bulky)                         return true;

    return false;
  }


  /**
   * getCheckedBagRecommendations(opts)
   *
   * Returns up to 2 checked suitcases ranked by capacity match.
   *
   * @param {number} opts.requiredCapacity — liters needed
   * @returns { primary: bag|null, alternate: bag|null }
   */
  function getCheckedBagRecommendations(opts) {
    var required = opts.requiredCapacity || 60;

    var checkedBags = BAG_DB.filter(function (b) {
      return b.family === "checked_suitcase";
    });

    if (checkedBags.length === 0) {
      return { primary: null, alternate: null };
    }

    // Score by capacity match — prefer bag closest to (but >= ) required
    checkedBags.sort(function (a, b) {
      var aFits = a.cap >= required ? 1 : 0;
      var bFits = b.cap >= required ? 1 : 0;
      if (aFits !== bFits) return bFits - aFits; // bags that fit first

      // Among bags that fit: prefer closest capacity
      var aDist = Math.abs(a.cap - required);
      var bDist = Math.abs(b.cap - required);
      if (aDist !== bDist) return aDist - bDist;

      // Tiebreaker: brand trust
      var aBrand = BRAND_TRUST[a.brand] || 0.5;
      var bBrand = BRAND_TRUST[b.brand] || 0.5;
      return bBrand - aBrand;
    });

    return {
      primary: checkedBags[0] || null,
      alternate: checkedBags.length > 1 ? checkedBags[1] : null
    };
  }


  /**
   * renderCheckedBagCard(bag)
   *
   * Returns HTML for a single checked-bag recommendation card.
   * Uses the same card styling as carry-on recs but with a distinct
   * amber/orange left border to visually distinguish checked-bag fallbacks.
   */
  function renderCheckedBagCard(bag) {
    var href = bag.url || "#";
    var dimsStr = bag.h + ' \u00d7 ' + bag.w + ' \u00d7 ' + bag.d + '"';

    // Shell-type-specific descriptions
    var reasonText = "Good option for setups that exceed carry-on capacity";
    var descText = "";
    var isHardside = (bag.structure || "").toLowerCase().indexOf("hard") !== -1;

    if (isHardside) {
      reasonText = "Better protection for fully packed bags \u2014 maintains structure at high capacity";
      descText = "Hard-shell construction helps protect contents and maintain structure when the bag is packed near capacity. Ideal for heavy packing or bulky items.";
    } else {
      reasonText = "Lightweight and flexible \u2014 ideal for most travelers";
      descText = "Soft-sided design is lighter, allows flexible packing, and works well for standard checked-bag setups without bulky or fragile items.";
    }

    return [
      '<div class="bag-rec-card checked-bag">',
      '  <div class="bag-rec-card-info">',
      '    <div class="bag-rec-card-name">' + bag.name + '</div>',
      '    <div class="bag-rec-card-meta">' + bag.cap + 'L \u00b7 ' + bag.structure + ' \u00b7 ' + dimsStr + ' \u00b7 ' + bag.price + '</div>',
      '    <div class="bag-rec-card-reason checked-bag">' + reasonText + '</div>',
      '    <div style="font-size:0.78rem; color:#6b7280; margin-top:4px; line-height:1.45;">' + descText + '</div>',
      '  </div>',
      '  <div class="bag-rec-card-cta">',
      '    <a href="' + href + '" target="_blank" rel="nofollow sponsored noopener">Check Price \u2192</a>',
      '  </div>',
      '</div>'
    ].join("");
  }


  /**
   * renderCheckedBagSection(opts)
   *
   * Renders the full checked-bag recommendation section into a container.
   * Includes contextual framing text, 1–2 product cards, and trust line.
   *
   * @param {object}  opts
   * @param {number}  opts.requiredCapacity — liters needed
   * @param {string}  [opts.containerId]    — DOM id (default "checkedBagRecs")
   * @param {string}  [opts.pageContext]    — "cruise" | "trip" | "destination" (affects framing text)
   * @returns {object} { primary, alternate }
   */
  function renderCheckedBagSection(opts) {
    opts = opts || {};
    var containerId = opts.containerId || "checkedBagRecs";
    var pageContext = opts.pageContext || "trip";

    var result = getCheckedBagRecommendations({
      requiredCapacity: opts.requiredCapacity || 60
    });

    var container = document.getElementById(containerId);
    if (!container) return result;

    if (!result.primary) {
      container.innerHTML = "";
      container.style.display = "none";
      return result;
    }

    // Inject checked-bag-specific styles (once)
    injectCheckedBagStyles();

    // Framing text varies by page context
    var framingText = "";
    if (pageContext === "cruise") {
      framingText = "If your setup includes formalwear, extra shoes, bulky layers, or full toiletries, a checked bag becomes the more practical option.";
    } else {
      framingText = "If your packing setup exceeds carry-on capacity, a checked bag is the more practical option for this trip.";
    }

    var html = "";
    html += '<div class="checked-bag-section">';
    html += '<div class="checked-bag-section-title">Checked Bag Option</div>';
    html += '<p class="checked-bag-framing">' + framingText + '</p>';
    html += renderCheckedBagCard(result.primary);
    if (result.alternate) {
      html += renderCheckedBagCard(result.alternate);
    }
    html += '<div class="bag-rec-trust">Checked bag recommendations shown because this setup exceeds practical carry-on range.</div>';
    html += '</div>';

    container.innerHTML = html;
    container.style.display = "";

    return result;
  }


  /**
   * injectCheckedBagStyles() — adds checked-bag-specific CSS (once).
   */
  function injectCheckedBagStyles() {
    if (document.getElementById("checked-bag-rec-styles")) return;
    var style = document.createElement("style");
    style.id = "checked-bag-rec-styles";
    style.textContent = [
      ".checked-bag-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; }",
      ".checked-bag-section-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: #92400e; }",
      ".checked-bag-framing { font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 14px; }",
      ".bag-rec-card.checked-bag { border-left: 5px solid #f59e0b; }",
      ".bag-rec-card-reason.checked-bag { color: #92400e; }"
    ].join("\n");
    document.head.appendChild(style);
  }


  /* ==========================================================================
     SECTION 10 — EXPORTS
     ========================================================================== */
  window.BAG_DB              = BAG_DB;
  window.AIRLINE_TYPES       = AIRLINE_TYPES;
  window.CARRY_CLASS_LABEL   = CARRY_CLASS_LABEL;
  window.classifyBag         = classifyBag;
  window.scoreBagFit         = scoreBagFit;
  window.recommendBags       = recommendBags;
  window.getRecommendations  = getRecommendations;

  // Checked-bag system (page-type gated)
  window.shouldShowCheckedBagRecs    = shouldShowCheckedBagRecs;
  window.renderCheckedBagSection     = renderCheckedBagSection;
  window.getCheckedBagRecommendations = getCheckedBagRecommendations;

})();
