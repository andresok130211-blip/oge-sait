function openDuoLesson(btn, panelId) {
  if (btn.classList.contains('locked')) return;
  document.querySelectorAll('.duo-lesson-panel').forEach(p => p.classList.remove('show'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('show');
}
function completeDuoNode(btn, id, pts) {
  // mark lesson done via existing system
  const fakeLesson = document.createElement('div');
  fakeLesson.dataset.lesson = 'duo-' + id;
  // unlock next
  if (!completed['duo-'+id]) {
    completed['duo-'+id] = true;
    localStorage.setItem('oge_completed', JSON.stringify(completed));
    xp += pts;
    localStorage.setItem('oge_xp', xp);
    document.getElementById('xpCount').textContent = xp;
    document.getElementById('xpGain').textContent = pts;
    document.getElementById('overlay').classList.add('show');
    document.getElementById('xpPopup').classList.add('show');
    setTimeout(() => {
      document.getElementById('overlay').classList.remove('show');
      document.getElementById('xpPopup').classList.remove('show');
    }, 1200);
  }
  // visual
  const node = btn.closest('.duo-node-wrap').querySelector('.duo-node');
  if (node) {
    node.classList.remove('active');
    node.classList.add('done');
    node.innerHTML = '✓';
  }
  // unlock nodes that need this id
  document.querySelectorAll('.duo-node.locked[data-unlock="'+id+'"]').forEach(n => {
    n.classList.remove('locked');
    n.classList.add('active');
    if (!n.classList.contains('chest')) {
      // keep icon
    }
  });
  btn.closest('.duo-lesson-panel').classList.remove('show');
  // rebind quizzes in case
  bindQuizzes();
}

