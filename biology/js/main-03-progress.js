function completeLesson(btn,pts){
  const id=btn.closest('.lesson').dataset.lesson;
  if(completed[id]){btn.textContent='Уже пройдено ✓';btn.disabled=true;return}
  completed[id]=true;localStorage.setItem('oge_bio_completed',JSON.stringify(completed));
  xp+=pts;
/* sync progress to main menu (only lessons/tests) */
try{
  var STORE='oge_fun_v1';
  var g=JSON.parse(localStorage.getItem(STORE)||'{}');
  if(!g.subj) g.subj={};
  var subj=document.body.getAttribute('data-subject')||(location.pathname.split('/').filter(Boolean).slice(-2,-1)[0])||'russian';
  g.subj[subj]=Math.min(100,(g.subj[subj]||0)+Math.max(3,Math.round((pts||10)/3)));
  g.xp=(g.xp||0)+(pts||10);
  localStorage.setItem(STORE,JSON.stringify(g));
}catch(e){}
localStorage.setItem('oge_bio_xp',xp);document.getElementById('xpCount').textContent=xp;
  const today=new Date().toDateString(),last=localStorage.getItem('oge_bio_last');
  if(last!==today){streak=(last&&new Date(last).getTime()>Date.now()-172800000)?streak+1:1;localStorage.setItem('oge_bio_streak',streak);localStorage.setItem('oge_bio_last',today);document.getElementById('streakCount').textContent=streak}
  btn.textContent='Пройдено ✓';btn.disabled=true;updateProgress();
  document.getElementById('xpGain').textContent=pts;document.getElementById('overlay').classList.add('show');document.getElementById('xpPopup').classList.add('show');
  setTimeout(()=>{document.getElementById('overlay').classList.remove('show');document.getElementById('xpPopup').classList.remove('show')},1500)
}
function updateProgress(){
  document.querySelectorAll('.unit').forEach(u=>{
    const ls=u.querySelectorAll('.lesson');if(!ls.length)return;
    let d=0;ls.forEach(l=>{if(completed[l.dataset.lesson])d++});
    const b=u.querySelector('.unit-progress-bar');if(b)b.style.width=Math.round(d/ls.length*100)+'%'
  })
}
document.querySelectorAll('.lesson').forEach(l=>{
  if(completed[l.dataset.lesson]){const b=l.querySelector('.done-btn');if(b){b.textContent='Пройдено ✓';b.disabled=true}}
});
updateProgress();

