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
  /* Group the desktop nav into two rows: tag the three direct tool links and
     insert a flex line-break before the first dropdown. CSS (>=641px) handles
     ordering/separators; mobile hamburger menu is unaffected. */
  if(nav){
    Array.prototype.forEach.call(nav.children,function(el){
      if(el.tagName==='A'){
        var t=(el.textContent||'').trim();
        if(t==='Home') el.classList.add('pf-n-home');
        else if(/Quick Packing Calculator/.test(t)) el.classList.add('pf-n-calc');
        else if(/Complete Packing List Generator/.test(t)) el.classList.add('pf-n-gen');
      }
    });
    if(!nav.querySelector('.pf-nav-break')){
      var _fd=nav.querySelector('.pf-nav-dd');
      if(_fd){ var _b=document.createElement('div'); _b.className='pf-nav-break'; nav.insertBefore(_b,_fd); }
    }
  }
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

/* Sitewide tool CTA tracking. One delegated listener fires a GA4 event when a
   visitor clicks through to one of the three tools, so the reference-page ->
   tool funnel (e.g. airline rules page -> Bag Checker) is measurable on every
   page without editing each one. Safe no-op if pfTrack is unavailable. */
(function(){
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a || !window.pfTrack) return;
    var href = a.getAttribute('href') || '';
    if(/will-it-fit\.html/.test(href))            window.pfTrack('bag_checker_cta_click');
    else if(/packing-list-generator\.html/.test(href)) window.pfTrack('generator_cta_click');
    else if(/(^|\/)(index\.html)?#calculator/.test(href)) window.pfTrack('quick_calc_cta_click');
  }, true);
})();
