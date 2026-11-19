
(function(){
  var vv=null, st={on:false,idx:0,speaking:false,gated:false,cues:null,voice:true,raf:0};
  var ss=window.speechSynthesis;
  function closeV(){
    st.on=false; cancelAnimationFrame(st.raf); try{ss&&ss.cancel();}catch(e){}
    if(vv){ var v=vv.querySelector('video'); try{v.pause();}catch(e){} vv.parentNode.removeChild(vv); vv=null; document.removeEventListener('keydown',kk); }
  }
  function kk(e){ if(e.key==='Escape') closeV(); }
  function say(txt){
    var cap=vv&&vv.querySelector('.vv-cap'); if(cap) cap.textContent=txt;
    if(!st.voice||!ss){ st.speaking=true; var ms=Math.max(1500,txt.length*65); setTimeout(function(){st.speaking=false; if(st.gated){st.gated=false; if(st.on&&vv)vv.querySelector('video').play();}},ms); return; }
    st.speaking=true;
    var parts=txt.split(/([A-Za-z][A-Za-z0-9'’\-]*(?:[ ,.!?;:'’\-]+[A-Za-z0-9][A-Za-z0-9'’\-]*)*[.!?]?)/).filter(function(x){return x&&x.trim()});
    var voices=ss.getVoices(), qi=0;
    function pickV(lang){var re=new RegExp('^'+lang.slice(0,2),'i'),vs=voices.filter(function(x){return re.test(x.lang)});return vs[0]||null}
    function next(){
      if(qi>=parts.length){ st.speaking=false; if(st.gated){ st.gated=false; if(st.on&&vv) vv.querySelector('video').play(); } return; }
      var part=parts[qi++], en=/[A-Za-z]/.test(part);
      var u=new SpeechSynthesisUtterance(part); u.lang=en?'en-US':'ru-RU'; u.rate=1;
      var vo=pickV(u.lang); if(vo) u.voice=vo;
      u.onend=next; u.onerror=next; ss.speak(u);
    }
    next();
  }
  function tick(){
    if(!st.on||!vv) return;
    var v=vv.querySelector('video'), c=st.cues;
    if(st.idx<c.length && v.currentTime>=c[st.idx][0]){
      if(st.speaking){ if(!v.paused){ st.gated=true; v.pause(); } }
      else { say(c[st.idx][1]); st.idx++; }
    }
    st.raf=requestAnimationFrame(tick);
  }
  function startVoice(v){
    st.on=true; st.idx=0; st.speaking=false; st.gated=false;
    try{ss&&ss.cancel(); ss&&ss.getVoices();}catch(e){}
    cancelAnimationFrame(st.raf); st.raf=requestAnimationFrame(tick);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.vb-board'); if(!b) return;
    e.preventDefault();
    var m=/^sc(\d+)-([a-z]+)-(\d+)$/.exec(b.getAttribute('data-lid')); if(!m) return;
    var lt=document.querySelector('[data-lesson="'+b.getAttribute('data-lid')+'"] h4');
    closeV();
    var base='../videos/'+m[2]+'/'+m[1]+'-'+m[3];
    vv=document.createElement('div'); vv.id='vv';
    vv.innerHTML='<div class="vv-top"><b></b><button type="button" class="vv-snd" style="display:none">🔊 Голос: вкл</button><button type="button" class="vv-x">✕ Закрыть</button></div>'+
      '<video controls autoplay playsinline preload="auto"></video><div class="vv-cap" style="display:none"></div><div class="vv-note">Видео без голоса: пишем на доске. Нажми на экран, чтобы остановить.</div>';
    vv.querySelector('b').textContent=lt?lt.textContent:'Видеоурок';
    vv.querySelector('.vv-x').onclick=closeV;
    var v=vv.querySelector('video'); v.src=base+'.mp4';
    document.body.appendChild(vv); document.addEventListener('keydown',kk);
    st.cues=null; st.voice=true; st.on=false;
    var me=vv;
    fetch(base+'.json').then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(c){
      if(vv!==me||!c||!c.length) return;
      st.cues=c;
      var snd=vv.querySelector('.vv-snd'); snd.style.display='';
      var cap=vv.querySelector('.vv-cap'); cap.style.display='block';
      vv.querySelector('.vv-note').textContent='Голос — озвучка твоего телефона. Видео само ждёт, пока голос договорит.';
      snd.onclick=function(){ st.voice=!st.voice; snd.textContent=st.voice?'🔊 Голос: вкл':'🔇 Голос: выкл'; if(!st.voice){try{ss&&ss.cancel();}catch(e){}} };
      v.addEventListener('seeked',function(){ if(!st.on) return; var i=0; while(i<c.length&&c[i][0]<v.currentTime) i++; st.idx=i; try{ss&&ss.cancel();}catch(e){} st.speaking=false; st.gated=false; });
      v.addEventListener('ended',function(){ st.on=false; });
      v.currentTime=0; startVoice(v); v.play().catch(function(){});
    }).catch(function(){});
  });
})();

