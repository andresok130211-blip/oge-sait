
let xp=parseInt(localStorage.getItem('oge_math_xp')||'0'),streak=parseInt(localStorage.getItem('oge_math_streak')||'0'),completed=JSON.parse(localStorage.getItem('oge_math_completed')||'{}');
document.getElementById('xpCount').textContent=xp;document.getElementById('streakCount').textContent=streak;
