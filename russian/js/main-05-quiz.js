function bindQuizzes(){
  document.querySelectorAll('.q-item').forEach(function(q){
    if(q.dataset.bound==='1') return;
    q.dataset.bound='1';
    var opts=q.querySelectorAll('.opt');
    var fb=q.querySelector('.fb');
    opts.forEach(function(opt){
      opt.addEventListener('click', function(){
        if(opt.classList.contains('disabled')) return;
        var c=String(q.getAttribute('data-c')||'');
        opts.forEach(function(o){ o.classList.add('disabled'); });
        if(String(opt.getAttribute('data-v'))===c){
          opt.classList.add('correct');
          if(fb){ fb.textContent='✓ Верно!'; fb.className='fb show ok'; }
        } else {
          opt.classList.add('wrong');
          opts.forEach(function(o){
            if(String(o.getAttribute('data-v'))===c) o.classList.add('correct');
          });
          if(fb){ fb.textContent='✗ Неправильно. Правильный — зелёным.'; fb.className='fb show fail'; }
        }
      });
    });
  });
}

bindQuizzes();
// restore duo progress
document.querySelectorAll('.duo-node[data-unlock]').forEach(n => {
  const need = n.dataset.unlock;
  if (completed['duo-'+need]) {
    n.classList.remove('locked');
    if (!n.classList.contains('chest')) n.classList.add('active');
  }
});
Object.keys(completed).forEach(k => {
  if (k.startsWith('duo-')) {
    const id = k.replace('duo-','');
    document.querySelectorAll('.duo-node').forEach(n => {
      // mark done nodes - simplified
    });
  }
});


