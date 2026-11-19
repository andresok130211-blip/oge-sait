function normalizeAns(s){return String(s).trim().toLowerCase().replace(/\s+/g,'').replace('ё','е')}
function checkOpenVariant(btn){
  const lesson=btn.closest('.lesson');if(lesson.dataset.checked==='1')return;
  const tasks=lesson.querySelectorAll('.open-task');let ok=0,total=tasks.length;
  tasks.forEach(t=>{
    const input=t.querySelector('.ans-input');if(!input)return;
    const corrects=normalizeAns(t.dataset.answer).split('|');
    const user=normalizeAns(input.value);
    const ansBox=t.querySelector('.correct-ans');
    let match=corrects.some(c=>c===user);
    if(!match&&user.length>=2&&corrects[0]&&corrects[0].length===user.length){
      match=user.split('').sort().join('')===corrects[0].split('').sort().join('');
    }
    if(match&&user!==''){input.classList.add('ok');ok++}else{input.classList.add('bad')}
    if(ansBox)ansBox.classList.add('show');input.readOnly=true;
  });
  lesson.dataset.checked='1';btn.disabled=true;btn.textContent='Проверено';
  const res=lesson.querySelector('.var-result');const pct=total?Math.round(ok/total*100):0;
  if(res){res.classList.add('show');res.innerHTML='Результат: <strong>'+ok+' из '+total+'</strong> ('+pct+'%)';
    if(pct>=80)res.className='var-result show good';else if(pct>=50)res.className='var-result show mid';else res.className='var-result show bad'}
  const done=lesson.querySelector('.done-btn');if(done)done.style.display='block';
}









