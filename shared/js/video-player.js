
(function(){
var V=window.OGE_VIDEOS||{}, vp=null, cur=null, si=0, pi=0, playing=false, token=0, voice=null, rate=1;
var RATES=[0.9,1,1.15,1.3];
var hasTTS=('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window);
function pickVoice(){ if(!hasTTS) return; var vs=speechSynthesis.getVoices(); voice=null;
  for(var i=0;i<vs.length;i++){ if(/^ru/i.test(vs[i].lang)){ voice=vs[i]; break; } } }
if(hasTTS){ pickVoice(); try{ speechSynthesis.onvoiceschanged=pickVoice; }catch(e){} }
function el(t,c,h){ var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e; }
function build(){
  vp=el('div'); vp.id='vp';
  vp.innerHTML='<div class="vp-top"><b id="vpT"></b><button type="button" id="vpR">1×</button><button type="button" id="vpX" aria-label="Закрыть">✕</button></div>'+
   '<div class="vp-bar" id="vpB"></div><div class="vp-stage" id="vpS"></div><div class="vp-note" id="vpN"></div>'+
   '<div class="vp-ctl"><button type="button" id="vpP" aria-label="Назад">⏮</button><button type="button" class="main" id="vpM" aria-label="Пауза">⏸</button><button type="button" id="vpF" aria-label="Дальше">⏭</button></div>';
  document.body.appendChild(vp);
  vp.querySelector('#vpX').onclick=close;
  vp.querySelector('#vpM').onclick=toggle;
  vp.querySelector('#vpP').onclick=function(){ go(si>0&&pi===0?si-1:si,0); };
  vp.querySelector('#vpF').onclick=function(){ if(si<cur.s.length-1) go(si+1,0); else finish(); };
  vp.querySelector('#vpR').onclick=function(){ var i=(RATES.indexOf(rate)+1)%RATES.length; rate=RATES[i]; this.textContent=rate+'×'; if(playing) say(); };
}
function stopSpeech(){ token++; if(hasTTS){ try{ speechSynthesis.cancel(); }catch(e){} } }
function render(){
  var s=cur.s[si], h='<div class="vp-label">'+s.l+'</div>';
  for(var j=0;j<=pi&&j<s.p.length;j++){
    h+= s.k==='title' ? '<div class="vp-title">'+s.p[j].h+'</div>' : '<div class="vp-part'+(s.k==='list'?' li':'')+(j===pi?' now':'')+'">'+s.p[j].h+'</div>';
  }
  var st=vp.querySelector('#vpS'); st.innerHTML=h;
  var n=st.querySelector('.now'); if(n&&n.scrollIntoView){ try{ n.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
  var b=''; for(var i=0;i<cur.s.length;i++) b+='<i class="'+(i<si?'on':(i===si?'cur':''))+'"></i>';
  vp.querySelector('#vpB').innerHTML=b;
  vp.querySelector('#vpM').textContent=playing?'⏸':'▶';
}
function chunks(t){ var m=t.match(/[^.!?…]+[.!?…]*\s*/g); return m&&m.length?m:[t]; }
function say(){
  var my=++token, p=cur.s[si].p[pi]; render();
  if(hasTTS) { try{ speechSynthesis.cancel(); }catch(e){} }
  if(hasTTS&&voice){
    var cs=chunks(p.t);
    cs.forEach(function(c,k){
      var u=new SpeechSynthesisUtterance(c); u.voice=voice; u.lang=voice.lang; u.rate=rate;
      if(k===cs.length-1){ u.onend=function(){ if(my===token&&playing) next(); }; }
      u.onerror=function(){ if(my===token&&playing&&k===0) timer(p.t,my); };
      speechSynthesis.speak(u);
    });
  } else { timer(p.t,my); }
}
function timer(t,my){ setTimeout(function(){ if(my===token&&playing) next(); }, Math.max(3000, t.length*75/rate)); }
function next(){
  var s=cur.s[si];
  if(pi<s.p.length-1){ pi++; say(); }
  else if(si<cur.s.length-1){ si++; pi=0; say(); }
  else finish();
}
function go(s,p){ si=s; pi=p; if(playing) say(); else { stopSpeech(); render(); } }
function finish(){ playing=false; stopSpeech(); si=cur.s.length-1; pi=0; render(); }
function toggle(){ if(playing){ playing=false; stopSpeech(); render(); } else { playing=true; say(); } }
function close(){ playing=false; stopSpeech(); if(vp&&vp.parentNode) vp.parentNode.removeChild(vp); vp=null; document.removeEventListener('keydown',key); }
function key(e){
  if(e.key==='Escape') close();
  else if(e.key===' '){ e.preventDefault(); toggle(); }
  else if(e.key==='ArrowRight') vp.querySelector('#vpF').click();
  else if(e.key==='ArrowLeft') vp.querySelector('#vpP').click();
}
function open(id){
  if(!V[id]) return; cur={s:V[id]}; si=0; pi=0; playing=true; if(!vp) build();
  var lt=document.querySelector('[data-lesson="'+id+'"] h4'); vp.querySelector('#vpT').textContent=lt?lt.textContent:'Видеоурок';
  vp.querySelector('#vpN').textContent=(hasTTS&&voice)?'':'Голос на этом устройстве недоступен — читай текст на экране, слайды листаются сами.';
  document.addEventListener('keydown',key); say();
}
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.vb-voice'); if(b){ e.preventDefault(); open(b.getAttribute('data-vid')); }
});
})();
