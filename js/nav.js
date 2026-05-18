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
