/* ──────────────────────────────────────────────────────────────────────────
   Vercel Web Analytics — SITE-WIDE INSTALL POINT.
   Privacy-friendly & cookieless: no cookies, no personal data — so NO consent
   banner is required. nav.js loads on every page, so this covers the whole site.
   Requires "Web Analytics" enabled in the Vercel project dashboard; Vercel then
   serves the script at /_vercel/insights/script.js. To change/remove analytics,
   edit only this block. Do NOT add a second analytics tag elsewhere. */
(function(){
  if (window.__pfVALoaded) return;             // guard against double-load
  window.__pfVALoaded = true;
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  var s = document.createElement("script");
  s.defer = true;
  s.src = "/_vercel/insights/script.js";
  document.head.appendChild(s);
})();

/* Cookie consent banner DISABLED — switched to Vercel Web Analytics, which is
   cookieless and sets no tracking cookies, so no consent banner is required.
   The block below is left inert (early return) to keep the diff minimal. */
(function(){
  return;
  var KEY='pf_consent', choice=null;
  try { choice=localStorage.getItem(KEY); } catch(e){}
  if (choice==='granted' || choice==='denied') return;   // already decided
  function decide(val){
    try { localStorage.setItem(KEY,val); } catch(e){}
    if (val==='granted' && window.gtag) window.gtag('consent','update',{analytics_storage:'granted'});
    var el=document.getElementById('pf-consent'); if(el&&el.parentNode) el.parentNode.removeChild(el);
  }
  function build(){
    if (document.getElementById('pf-consent')) return;
    var bar=document.createElement('div');
    bar.id='pf-consent';
    bar.setAttribute('role','dialog');
    bar.setAttribute('aria-label','Cookie consent');
    bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:760px;margin:0 auto;background:#1a2540;color:#fff;border-radius:10px;padding:14px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;box-shadow:0 6px 24px rgba(0,0,0,0.28);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:0.85rem;line-height:1.5;';
    bar.innerHTML='<div style="flex:1 1 300px;min-width:240px;">PackFitter uses analytics cookies to see which guides travelers find useful — that\'s it. No ads, no data selling. <a href="/privacy-policy.html" style="color:#cfe0ff;text-decoration:underline;">Privacy&nbsp;Policy</a>.</div>';
    var btns=document.createElement('div');
    btns.style.cssText='display:flex;gap:8px;flex:0 0 auto;margin-left:auto;';
    var d=document.createElement('button');
    d.type='button'; d.textContent='Decline';
    d.style.cssText='cursor:pointer;border:1px solid rgba(255,255,255,0.5);background:transparent;color:#fff;font-weight:600;font-size:0.85rem;padding:8px 16px;border-radius:8px;';
    d.onclick=function(){ decide('denied'); };
    var a=document.createElement('button');
    a.type='button'; a.textContent='Accept';
    a.style.cssText='cursor:pointer;border:none;background:#fff;color:#1a2540;font-weight:700;font-size:0.85rem;padding:8px 18px;border-radius:8px;';
    a.onclick=function(){ decide('granted'); };
    btns.appendChild(d); btns.appendChild(a); bar.appendChild(btns);
    document.body.appendChild(bar);
  }
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();

/* Lightweight event helper. Tool pages call window.pfTrack('event_name').
   Routes to Vercel Web Analytics custom events. Safe no-op if unavailable. */
window.pfTrack = function(name, params){
  try { if (typeof window.va === 'function') window.va('event', { name: name, data: params || {} }); } catch(e){}
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
  /* Nav v3 (Tools dropdown): bar is Home + 4 dropdowns and fits one row.
     Tag Home so CSS (>=641px) drops its left separator. The old forced
     two-row line-break is no longer inserted (only one row now). */
  if(nav){
    Array.prototype.forEach.call(nav.children,function(el){
      if(el.tagName==='A'){
        var t=(el.textContent||'').trim();
        if(t==='Home') el.classList.add('pf-n-home');
      }
    });
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
