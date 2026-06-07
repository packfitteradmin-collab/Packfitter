/* ──────────────────────────────────────────────────────────────────────────
   Google Analytics 4 — SITE-WIDE INSTALL POINT.
   This is the single canonical location for analytics. nav.js loads on all
   pages, so the tag here covers the whole site. Do NOT add gtag anywhere else
   (avoid double-counting). To change/remove analytics, edit only this block.
   ────────────────────────────────────────────────────────────────────────── */
(function(){
  if (window.__pfGA4Loaded) return;            // guard against double-load
  window.__pfGA4Loaded = true;
  var GA_ID = "G-8JC7E0G83R";
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

/* Lightweight GA4 event helper. Tool pages call window.pfTrack('event_name').
   Safe no-op if analytics is blocked/unavailable. See PACKFITTER-ANALYTICS-INSTALL-NOTE.md. */
window.pfTrack = function(name, params){
  try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch(e){}
};

(function(){
  document.querySelectorAll('.pf-nav-dd > button').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var dd=btn.parentElement;
      var wasOpen=dd.classList.contains('pf-dd-open');
      document.querySelectorAll('.pf-nav-dd').forEach(function(d){d.classList.remove('pf-dd-open');});
      if(!wasOpen) dd.classList.add('pf-dd-open');
    });
  });
  document.addEventListener('click',function(){
    document.querySelectorAll('.pf-nav-dd').forEach(function(d){d.classList.remove('pf-dd-open');});
  });
  var ham=document.querySelector('.pf-hamburger');
  var nav=document.querySelector('.pf-nav-bar');
  if(ham&&nav){
    ham.addEventListener('click',function(e){
      e.stopPropagation();
      nav.classList.toggle('pf-nav-open');
    });
  }
  if(window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.pf-nav-dd').forEach(function(dd){
      dd.addEventListener('mouseenter',function(){dd.classList.add('pf-dd-open');});
      dd.addEventListener('mouseleave',function(){dd.classList.remove('pf-dd-open');});
    });
  }
})();
