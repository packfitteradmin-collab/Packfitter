(function () {
  const PRODUCTS = [
    {
      id: "osprey-farpoint-40",
      type: "bag",
      name: "Osprey Farpoint 40",
      size: "40L",
      note: "Airline-friendly dimensions, harness tucks away clean. Reliable all-rounder for 4–7 day trips.",
      tagline: "Best balance of size, comfort, and carry-on compliance",
      link: "#",
      tags: ["carry-on", "40l", "standard", "delta"]
    },
    {
      id: "tortuga-setout-35",
      type: "bag",
      name: "Tortuga Setout",
      size: "35L",
      note: "Built to closely match carry-on dimensions. Best for light packers or stricter airlines.",
      tagline: "Best balance of size, comfort, and carry-on compliance",
      link: "#",
      tags: ["carry-on", "35l", "light", "strict-airlines"]
    },
    {
      id: "osprey-daylite-26",
      type: "bag",
      name: "Osprey Daylite 26+6",
      size: "26L",
      note: "Slim profile with a low packed depth — fits most budget airline personal item frames. Good for 1–3 day trips.",
      tagline: "Best budget airline personal item pack",
      link: "#",
      tags: ["personal-item", "26l", "light", "budget-airlines", "ryanair", "easyjet"]
    },
    {
      id: "cabin-max-metz",
      type: "bag",
      name: "Cabin Max Metz",
      size: "30L",
      note: "Designed to meet Ryanair and EasyJet carry-on limits. Maximises volume within strict European budget airline dimensions.",
      tagline: "Best for strict European budget airlines",
      link: "#",
      tags: ["carry-on", "30l", "budget-airlines", "ryanair", "easyjet", "strict-airlines"]
    },
    {
      id: "peak-design-travel-backpack",
      type: "bag",
      name: "Peak Design Travel Backpack",
      size: "45L",
      note: "Compresses when underpacked. Better for standard or heavy packers bringing tech.",
      tagline: "",
      link: "#",
      tags: ["carry-on", "45l", "heavy", "tech", "camera"]
    },
    {
      id: "patagonia-nano-puff",
      type: "jacket",
      name: "Patagonia Nano Puff",
      size: "",
      note: "Compresses small and adds warmth without a lot of bulk. Useful for colder carry-on setups.",
      tagline: "",
      link: "#",
      tags: ["cold", "compression", "outerwear"]
    },
    {
      id: "compression-cubes-basic",
      type: "accessory",
      name: "Compression Packing Cubes",
      size: "",
      note: "Reduce soft clothing volume and help when a bag is just over the limit.",
      tagline: "",
      link: "#",
      tags: ["compression", "volume-reduction", "clothing"]
    }
  ];

  // Inject recommendation CSS once
  (function injectStyles() {
    if (document.getElementById("rec-styles")) return;
    const style = document.createElement("style");
    style.id = "rec-styles";
    style.textContent = `
      .rec-badge {
        font-size: 11px;
        font-weight: bold;
        color: #fff;
        background: #111;
        display: inline-block;
        padding: 4px 8px;
        margin-bottom: 6px;
        border-radius: 4px;
      }
      .rec-tagline {
        font-size: 0.78rem;
        color: #6b7280;
        margin-top: 4px;
        margin-bottom: 2px;
      }
      .rec-cta {
        display: inline-block;
        margin-top: 8px;
        font-size: 14px;
        text-decoration: none;
        color: #000;
        font-weight: 600;
      }
      .rec-cta:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  })();

  function renderRecommendations() {
    const containerId =
      typeof window.PAGE_RECOMMENDATION_CONTAINER_ID !== "undefined"
        ? window.PAGE_RECOMMENDATION_CONTAINER_ID
        : "bagRecommendations";
    const recommendationType =
      typeof window.PAGE_RECOMMENDATION_TYPE !== "undefined"
        ? window.PAGE_RECOMMENDATION_TYPE
        : "bag";
    const recommendationIds =
      typeof window.PAGE_RECOMMENDATION_IDS !== "undefined"
        ? window.PAGE_RECOMMENDATION_IDS
        : [];

    const container = document.getElementById(containerId);
    if (!container) return;
    if (!Array.isArray(recommendationIds) || recommendationIds.length === 0) {
      container.innerHTML = "";
      return;
    }

    // Sort products to match order of PAGE_RECOMMENDATION_IDS
    const products = recommendationIds
      .map(id => PRODUCTS.find(p => p.id === id && p.type === recommendationType))
      .filter(Boolean);

    if (products.length === 0) {
      container.innerHTML = "";
      return;
    }

    const trustLine = `<p style="font-size:13px;color:#666;margin-bottom:10px;">These recommendations are based on real carry-on sizing and packing performance.</p>`;

    const cards = products.map((p, index) => {
      const isBest = index === 0;
      const badge = isBest ? `<div class="rec-badge">Best Overall Choice</div>` : "";
      const tagline = isBest && p.tagline ? `<div class="rec-tagline">${p.tagline}</div>` : "";
      return `
        <a href="${p.link}" target="_blank" rel="nofollow noopener" class="bag-rec-link">
          <div class="bag-rec">
            ${badge}
            <div class="bag-rec-name">
              ${p.name}${p.size ? ` <span class="bag-rec-size">${p.size}</span>` : ""}
            </div>
            ${tagline}
            <div class="bag-rec-why">${p.note}</div>
            <a href="${p.link}" class="rec-cta" target="_blank" rel="nofollow noopener">Check Price →</a>
          </div>
        </a>
      `;
    }).join("");

    container.innerHTML = trustLine + cards;
  }

  window.PRODUCTS = PRODUCTS;
  window.renderRecommendations = renderRecommendations;
})();
