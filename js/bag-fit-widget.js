/* PackFitter — Live Bag Fit Widget (BAGFIT-V1, 2026-07-06)
   Computes a bag's fit against the canonical airline dataset (window.PF_AIRLINES,
   loaded from /js/airline-data.js) and renders it into any element carrying
   data-bagfit. Because it reads the live dataset, every product card updates
   automatically whenever airline data changes (e.g. the ANA 2026-07 PI update).

   Usage:
     <div data-bagfit="card" data-h="16.5" data-w="12.2" data-d="4.7"></div>  → info box
     <span data-bagfit="cell" data-h=".." data-w=".." data-d="..">fallback</span> → table badges

   Rules (dimensions/realism skills):
   - Orientation-agnostic: sorted-triple comparison (bags can be turned).
   - Personal-item counts use ONLY airlines with a PUBLISHED size (piEst === false).
     Airlines with under-seat-only rules are disclosed, never counted as pass/fail.
   - No "guaranteed fit" language. Enforcement caveat always shown in card mode.
   - Spirit (ceased) and any ceased carrier excluded. */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var A = window.PF_AIRLINES;
    var els = document.querySelectorAll("[data-bagfit]");
    if (!A || !A.length || !els.length) return;

    function sorted(t) { return t.slice().sort(function (x, y) { return y - x; }); }
    function fits(bag, lim) {
      var b = sorted(bag), l = sorted(lim);
      return b[0] <= l[0] + 1e-9 && b[1] <= l[1] + 1e-9 && b[2] <= l[2] + 1e-9;
    }

    var live = A.filter(function (a) { return !a.ceased; });
    var piAir = live.filter(function (a) {
      return a.personalItem && a.piEst === false && a.piL && a.piW && a.piH;
    });
    var coAir = live.filter(function (a) { return a.coL && a.coW && a.coH; });

    Array.prototype.forEach.call(els, function (el) {
      var h = parseFloat(el.getAttribute("data-h"));
      var w = parseFloat(el.getAttribute("data-w"));
      var d = parseFloat(el.getAttribute("data-d"));
      if (!(h && w && d)) return;
      var bag = [h, w, d];

      var piPass = [], piFail = [];
      piAir.forEach(function (a) {
        (fits(bag, [a.piL, a.piW, a.piH]) ? piPass : piFail).push(a.name);
      });
      var coPass = 0, coFail = [];
      coAir.forEach(function (a) {
        if (fits(bag, [a.coL, a.coW, a.coH])) coPass++; else coFail.push(a.name);
      });

      if (el.getAttribute("data-bagfit") === "cell") {
        var coClass = coFail.length ? "badge-yellow" : "badge-green";
        var piClass = piFail.length ? (piPass.length ? "badge-yellow" : "badge-red") : "badge-green";
        el.innerHTML =
          '<span class="badge ' + coClass + '">carry-on ' + coPass + "/" + coAir.length + "</span> " +
          '<span class="badge ' + piClass + '">personal item ' + piPass.length + "/" + piAir.length + "</span>";
      } else {
        var piTxt;
        if (!piFail.length) {
          piTxt = "It also qualifies as a <em>personal item</em> on every airline in our dataset that publishes a personal-item size (" + piPass.length + " of " + piAir.length + ").";
        } else if (piPass.length === 0) {
          piTxt = "It does not fit any published <em>personal-item</em> limit (0 of " + piAir.length + ") — plan on it being your main cabin bag, with under-seat use only on airlines that don't publish a size.";
        } else if (piFail.length <= 5) {
          piTxt = "As a <em>personal item</em>, it qualifies on <strong>" + piPass.length + " of " + piAir.length + "</strong> airlines that publish a size — over the limit on " + piFail.join(", ") + ", where it rides as your main cabin bag instead.";
        } else {
          piTxt = "As a <em>personal item</em>, it qualifies on <strong>" + piPass.length + " of " + piAir.length + "</strong> airlines that publish a size (incl. " + piPass.slice(0, 4).join(", ") + "). It exceeds the smaller limits used by most European and international carriers — there it rides as your main cabin bag instead.";
        }
        el.innerHTML =
          '<p class="personal-item-note"><strong>Live fit check:</strong> fits the published <em>carry-on</em> limit on ' +
          "<strong>" + coPass + " of " + coAir.length + "</strong> airlines in our verified dataset" +
          (coFail.length ? " (over on " + coFail.join(", ") + ")" : "") + ". " + piTxt +
          " Computed live from the same verified airline data as our <a href=\"/will-it-fit.html\">Bag Size Checker</a>, so these counts update whenever airline rules change." +
          " Airlines with no published personal-item size (Delta, Southwest, and others) use an under-seat rule and aren't counted. Manufacturer-spec dimensions; enforcement varies by gate.</p>";
      }
    });
  });
})();
