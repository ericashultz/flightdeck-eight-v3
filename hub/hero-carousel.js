/* Hero carousel: dots, arrows, autoplay that stops as soon as anyone touches it. [data-hc-scroll] scrolls to the page content below the banner. */
(function(){
  document.querySelectorAll('.hc').forEach(function(root){
    var slides=[].slice.call(root.querySelectorAll('.hc-slide'));
    var dots=[].slice.call(root.querySelectorAll('.hc-nav button:not(.hc-arr)'));
    var cur=0,timer=null,held=false;
    function go(i){cur=(i+slides.length)%slides.length;
      slides.forEach(function(s,k){s.classList.toggle('on',k===cur)});
      dots.forEach(function(d,k){d.classList.toggle('on',k===cur)});}
    function start(){ if(held||timer) return; timer=setInterval(function(){go(cur+1)},cur===0?12000:7000); }
    function stop(){ clearInterval(timer); timer=null; }
    dots.forEach(function(d,k){d.addEventListener('click',function(){held=true;stop();go(k)})});
    [].slice.call(root.querySelectorAll('.hc-arr')).forEach(function(b){
      b.addEventListener('click',function(){held=true;stop();go(cur+parseInt(b.dataset.hc,10))});});
    var track=root.querySelector('.hc-track');
    track.addEventListener('mouseenter',stop);
    track.addEventListener('mouseleave',function(){ if(!held) start(); });
    [].slice.call(root.querySelectorAll('[data-hc-scroll]')).forEach(function(a){
      a.addEventListener('click',function(e){e.preventDefault();var id=(a.getAttribute('href')||'').replace(/^#/,''),n=(id&&document.getElementById(id))||root.nextElementSibling;if(n)n.scrollIntoView({behavior:'smooth',block:'start'});});});
    go(0); start();
  });
})();
