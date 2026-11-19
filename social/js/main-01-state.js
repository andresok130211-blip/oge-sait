



let xp=parseInt(localStorage.getItem('oge_soc_xp')||'0'),streak=parseInt(localStorage.getItem('oge_soc_streak')||'0'),completed=JSON.parse(localStorage.getItem('oge_soc_completed')||'{}');
document.getElementById('xpCount').textContent=xp;document.getElementById('streakCount').textContent=streak;
function switchTab(n){
  document.getElementById('path-main').classList.toggle('hidden',n!=='main');
  document.getElementById('path-duo').classList.toggle('hidden',n!=='duo');
  document.getElementById('path-hard').classList.toggle('hidden',n!=='hard');
  document.getElementById('path-vars').classList.toggle('hidden',n!=='vars');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===n));
  window.scrollTo({top:0,behavior:'smooth'});
}
function setActiveBnav(b){document.querySelectorAll('.bnav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active')}
function toggleUnit(h){h.parentElement.classList.toggle('open')}

