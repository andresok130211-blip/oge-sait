function normalizeAns(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g,'').replace(',','.').replace('−','-');
}
function checkOpenVariant(btn) {
  const lesson = btn.closest('.lesson');
  if (lesson.dataset.checked === '1') return;
  const tasks = lesson.querySelectorAll('.open-task');
  let ok = 0, total = tasks.length;
  tasks.forEach(t => {
    const input = t.querySelector('.ans-input');
    const correct = normalizeAns(t.dataset.answer);
    const user = normalizeAns(input.value);
    const ansBox = t.querySelector('.correct-ans');
    // accept multiple answers separated by |
    const corrects = correct.split('|');
    const match = corrects.some(c => c === user);
    if (match && user !== '') {
      input.classList.add('ok');
      ok++;
    } else {
      input.classList.add('bad');
    }
    ansBox.classList.add('show');
    input.readOnly = true;
  });
  lesson.dataset.checked = '1';
  btn.disabled = true;
  btn.textContent = 'Проверено';
  const res = lesson.querySelector('.var-result');
  const pct = Math.round(ok/total*100);
  res.classList.add('show');
  res.innerHTML = 'Результат: <strong>' + ok + ' из ' + total + '</strong> (' + pct + '%)';
  if (pct >= 80) res.className = 'var-result show good';
  else if (pct >= 50) res.className = 'var-result show mid';
  else res.className = 'var-result show bad';
  const done = lesson.querySelector('.done-btn');
  if (done) done.style.display = 'block';
}


