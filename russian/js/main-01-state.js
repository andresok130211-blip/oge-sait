
let xp=parseInt(localStorage.getItem('oge_xp')||'0'),streak=parseInt(localStorage.getItem('oge_streak')||'0'),completed=JSON.parse(localStorage.getItem('oge_completed')||'{}');
document.getElementById('xpCount').textContent=xp;document.getElementById('streakCount').textContent=streak;
