generateDuo();







/* ===== Duolingo sequential lessons (fixed) ===== */
(function(){
  function initDuoLessons(){
    document.querySelectorAll('.lesson').forEach(function(lesson){
      if(lesson.dataset.duoInit==='1') return;
      lesson.dataset.duoInit='1';

      var theory=lesson.querySelector('.theory');
      var tip=lesson.querySelector('.tip');
      var questions=Array.prototype.slice.call(lesson.querySelectorAll('.q-item'));
      var doneBtn=lesson.querySelector('.done-btn');
      var pts=10;
      if(doneBtn){
        var mm=(doneBtn.getAttribute('onclick')||'').match(/completeLesson\([^,]+,\s*(\d+)/);
        if(mm) pts=parseInt(mm[1],10)||10;
      }

      var steps=[];
      if(theory){
        var th=document.createElement('div');
        th.className='duo-step duo-theory';
        th.appendChild(theory);
        if(tip) th.appendChild(tip);
        steps.push({el:th, type:'theory'});
      }
      questions.forEach(function(q,i){
        var st=document.createElement('div');
        st.className='duo-step duo-q';
        var lab=document.createElement('div');
        lab.className='duo-step-label';
        lab.textContent='Вопрос '+(i+1)+' из '+questions.length;
        st.appendChild(lab);
        st.appendChild(q);
        steps.push({el:st, type:'q', q:q, qi:i});
      });
      if(!steps.length) return;

      lesson.classList.add('duo-mode');
      var h4=lesson.querySelector('h4');
      Array.prototype.slice.call(lesson.children).forEach(function(ch){
        if(ch===h4) return;
        if(ch===doneBtn){ ch.style.display='none'; return; }
        try{ lesson.removeChild(ch); }catch(e){}
      });

      var prog=document.createElement('div');
      prog.className='duo-progress';
      for(var i=0;i<steps.length;i++){
        prog.appendChild(document.createElement('i'));
      }
      lesson.appendChild(prog);
      steps.forEach(function(s){ lesson.appendChild(s.el); });

      var nav=document.createElement('div');
      nav.className='duo-nav';
      var next=document.createElement('button');
      next.type='button';
      next.className='duo-next';
      next.textContent='Далее →';
      nav.appendChild(next);
      lesson.appendChild(nav);

      var finish=document.createElement('div');
      finish.className='duo-step duo-finish-wrap';
      finish.innerHTML='<div class="duo-finish"><div class="big">Урок пройден!</div><div>Отличная работа</div></div>';
      lesson.appendChild(finish);

      var state={idx:0, answered:{}, finished:false};

      function setProgress(){
        var dots=prog.querySelectorAll('i');
        for(var j=0;j<dots.length;j++){
          dots[j].classList.remove('on','cur');
          if(j<state.idx) dots[j].classList.add('on');
          if(j===state.idx) dots[j].classList.add('cur');
        }
      }

      function show(i){
        if(state.finished) return;
        state.idx=i;
        for(var j=0;j<steps.length;j++){
          steps[j].el.classList.toggle('active', j===i);
        }
        finish.classList.remove('active');
        setProgress();
        var step=steps[i];
        if(!step) return;
        if(step.type==='theory'){
          next.style.display='flex';
          next.disabled=false;
          next.textContent=questions.length?'К вопросам →':'Готово ✓';
        } else {
          if(state.answered[step.qi]){
            next.style.display='flex';
            next.disabled=false;
            next.textContent=(i>=steps.length-1)?'Завершить ✓':'Далее →';
          } else {
            next.style.display='none';
          }
        }
        try{ step.el.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch(e){}
      }

      function finishLesson(){
        if(state.finished) return;
        state.finished=true;
        for(var j=0;j<steps.length;j++) steps[j].el.classList.remove('active');
        finish.classList.add('active');
        prog.querySelectorAll('i').forEach(function(d){ d.classList.add('on'); d.classList.remove('cur'); });
        next.style.display='none';
        var btn=doneBtn;
        if(!btn){
          btn=document.createElement('button');
          btn.className='done-btn';
          btn.style.display='none';
          lesson.appendChild(btn);
        } else if(!lesson.contains(btn)){
          lesson.appendChild(btn);
          btn.style.display='none';
        }
        try{
          if(typeof completeLesson==='function') completeLesson(btn, pts);
        }catch(e){ console.warn(e); }
      }

      next.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        if(state.finished) return;
        if(state.idx>=steps.length-1){
          finishLesson();
          return;
        }
        show(state.idx+1);
      };

      lesson.addEventListener('click', function(e){
        var opt=e.target.closest ? e.target.closest('.opt') : null;
        if(!opt || !lesson.contains(opt)) return;
        if(opt.classList.contains('disabled')) return;
        var q=opt.closest('.q-item');
        if(!q) return;
        var stepEl=opt.closest('.duo-step');
        if(!stepEl || !stepEl.classList.contains('active')) return;

        var c=String(q.getAttribute('data-c'));
        var opts=q.querySelectorAll('.opt');
        var fb=q.querySelector('.fb');
        for(var oi=0;oi<opts.length;oi++) opts[oi].classList.add('disabled');
        if(String(opt.getAttribute('data-v'))===c){
          opt.classList.add('correct');
          if(fb){ fb.textContent='✓ Верно!'; fb.className='fb show ok'; }
        } else {
          opt.classList.add('wrong');
          for(var oi=0;oi<opts.length;oi++){
            if(String(opts[oi].getAttribute('data-v'))===c) opts[oi].classList.add('correct');
          }
          if(fb){ fb.textContent='✗ Неправильно. Правильный — зелёным.'; fb.className='fb show fail'; }
        }

        var qi=-1;
        for(var i=0;i<questions.length;i++){ if(questions[i]===q) qi=i; }
        if(qi>=0) state.answered[qi]=true;

        next.style.display='flex';
        next.disabled=false;
        var isLast=state.idx>=steps.length-1;
        next.textContent=isLast?'Завершить ✓':'Далее →';

        clearTimeout(lesson._duoT);
        lesson._duoT=setTimeout(function(){
          if(state.finished) return;
          if(isLast) finishLesson();
          else show(state.idx+1);
        }, 700);
      }, true);

      show(0);
    });
  }

  var _toggle=window.toggleUnit;
  window.toggleUnit=function(h){
    try{
      if(typeof _toggle==='function') _toggle(h);
      else if(h && h.parentElement) h.parentElement.classList.toggle('open');
    }catch(e){}
    setTimeout(initDuoLessons, 40);
  };

  function boot(){ setTimeout(initDuoLessons, 80); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  var tries=0;
  var iv=setInterval(function(){
    tries++;
    initDuoLessons();
    if(tries>15) clearInterval(iv);
  }, 500);
})();

