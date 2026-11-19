function openDuoLesson(btn,panelId){if(btn.classList.contains('locked'))return;document.querySelectorAll('.duo-lesson-panel').forEach(p=>p.classList.remove('show'));const panel=document.getElementById(panelId);if(panel)panel.classList.toggle('show')}
function completeDuoNode(btn,id,pts){
  try{
    if(!completed['duo-'+id]){
      completed['duo-'+id]=true;
      localStorage.setItem('oge_math_completed',JSON.stringify(completed));
      xp+=pts;
      localStorage.setItem('oge_math_xp',xp);
      var xc=document.getElementById('xpCount'); if(xc) xc.textContent=xp;
      var xg=document.getElementById('xpGain'); if(xg) xg.textContent=pts;
      var ov=document.getElementById('overlay'); var popup=document.getElementById('xpPopup');
      if(ov) ov.classList.add('show');
      if(popup) popup.classList.add('show');
      setTimeout(function(){ if(ov) ov.classList.remove('show'); if(popup) popup.classList.remove('show'); },1200);
    }
    var wrap=btn.closest('.duo-node-wrap');
    if(wrap){
      var node=wrap.querySelector('.duo-node');
      if(node){ node.classList.remove('active'); node.classList.add('done'); node.textContent='✓'; }
    }
    document.querySelectorAll('.duo-node.locked[data-unlock="'+id+'"]').forEach(function(n){
      n.classList.remove('locked'); n.classList.add('active');
    });
    var panel=btn.closest('.duo-lesson-panel');
    if(panel) panel.classList.remove('show');
    document.querySelectorAll('.q-item').forEach(function(q){ delete q.dataset.bound; }); if(typeof bindQuizzes==='function') bindQuizzes();
  }catch(e){ console && console.error(e); }
}
function checkVariant(btn) {
  const lesson = btn.closest('.lesson');
  if (lesson.dataset.checked === '1') return;
  const questions = lesson.querySelectorAll('.var-q');
  let correct = 0, total = questions.length, answered = 0;
  questions.forEach(q => {
    const right = q.dataset.correct;
    const selected = q.querySelector('.var-opt.selected');
    q.querySelectorAll('.var-opt').forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.v === right) {
        if (selected && selected.dataset.v === right) {
          opt.classList.add('show-ok');
        } else {
          opt.classList.add('show-miss'); // show correct answer
        }
      } else if (selected && opt === selected) {
        opt.classList.add('show-bad');
      }
    });
    if (selected) {
      answered++;
      if (selected.dataset.v === right) correct++;
    } else {
      // mark correct anyway
      q.querySelectorAll('.var-opt').forEach(opt => {
        if (opt.dataset.v === right) opt.classList.add('show-miss');
      });
    }
  });
  lesson.dataset.checked = '1';
  btn.disabled = true;
  btn.textContent = 'Проверено';
  const res = lesson.querySelector('.var-result');
  res.classList.add('show');
  const pct = Math.round(correct / total * 100);
  res.innerHTML = `Результат: <strong>${correct} из ${total}</strong> (${pct}%)`;
  if (pct >= 80) res.className = 'var-result show good';
  else if (pct >= 50) res.className = 'var-result show mid';
  else res.className = 'var-result show bad';
  const done = lesson.querySelector('.done-btn');
  if (done) done.style.display = 'block';
}


