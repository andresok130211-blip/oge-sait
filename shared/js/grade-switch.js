
function showGrade(g){
  document.querySelectorAll('.grade-sec').forEach(function(s){s.classList.toggle('on',s.dataset.grade==String(g))});
  document.querySelectorAll('.gchip').forEach(function(c){c.classList.toggle('on',c.dataset.g==String(g))});
  try{localStorage.setItem('oge_school_grade',String(g))}catch(e){}
}
(function(){
  var chips=document.querySelectorAll('.gchip'); if(!chips.length) return;
  var g=null; try{g=localStorage.getItem('oge_school_grade')}catch(e){}
  var ok=Array.prototype.some.call(chips,function(c){return c.dataset.g===g});
  showGrade(ok?g:chips[0].dataset.g);
  document.addEventListener('click',function(e){
    var o=e.target.closest&&e.target.closest('.q-item[data-why] .opt'); if(!o) return;
    var q=o.closest('.q-item'),fb=q.querySelector('.fb');
    if(!fb||q.dataset.w) return; q.dataset.w='1';
    var s=document.createElement('span'); s.className='why'; s.textContent=q.dataset.why; fb.appendChild(s);
  });
})();
