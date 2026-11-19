function openDuoLesson(btn,panelId){if(btn.classList.contains('locked'))return;document.querySelectorAll('.duo-lesson-panel').forEach(p=>p.classList.remove('show'));const panel=document.getElementById(panelId);if(panel)panel.classList.toggle('show')}
function completeDuoNode(btn,id,pts){
  if(!completed['duo-'+id]){completed['duo-'+id]=true;localStorage.setItem('oge_eng_completed',JSON.stringify(completed));xp+=pts;localStorage.setItem('oge_eng_xp',xp);document.getElementById('xpCount').textContent=xp;
    document.getElementById('xpGain').textContent=pts;document.getElementById('overlay').classList.add('show');document.getElementById('xpPopup').classList.add('show');
    setTimeout(()=>{document.getElementById('overlay').classList.remove('show');document.getElementById('xpPopup').classList.remove('show')},1200)}
  const node=btn.closest('.duo-node-wrap').querySelector('.duo-node');
  if(node){node.classList.remove('active');node.classList.add('done');node.textContent='✓'}
  document.querySelectorAll('.duo-node.locked[data-unlock="'+id+'"]').forEach(n=>{n.classList.remove('locked');n.classList.add('active')});
  btn.closest('.duo-lesson-panel').classList.remove('show');bindQuizzes()
}
document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
