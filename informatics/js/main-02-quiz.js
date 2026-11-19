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
