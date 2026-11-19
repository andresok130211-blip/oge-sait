
(function(){
"use strict";
try{

/* Stars */
(function(){
  var box=document.getElementById('stars');
  if(!box) return;
  for(var i=0;i<40;i++){
    var s=document.createElement('div');
    s.className='star';
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDelay=(Math.random()*3)+'s';
    var sz=(1+Math.random()*2)+'px';
    s.style.width=sz; s.style.height=sz;
    box.appendChild(s);
  }
})();

var STORE='oge_fun_v1';
function load(){
  try{
    var base={xp:0,streak:0,lastDay:'',missionDone:'',missionId:0,subj:{},quizBest:0,visits:{}};
    return Object.assign(base, JSON.parse(localStorage.getItem(STORE)||'{}'));
  }catch(e){ return {xp:0,streak:0,lastDay:'',missionDone:'',missionId:0,subj:{},quizBest:0,visits:{}}; }
}
function save(d){ try{ localStorage.setItem(STORE, JSON.stringify(d)); }catch(e){} }
function today(){ return new Date().toDateString(); }
function yesterday(){ var d=new Date(); d.setDate(d.getDate()-1); return d.toDateString(); }

function toast(msg){
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(window._tt);
  window._tt=setTimeout(function(){ t.classList.remove('show'); }, 2200);
}
window.toast=toast;

function confetti(){
  var c=document.getElementById('confetti');
  if(!c || !c.getContext) return;
  var ctx=c.getContext('2d');
  c.width=window.innerWidth; c.height=window.innerHeight;
  var parts=[], colors=['#a78bfa','#ec4899','#22d3ee','#fbbf24','#4ade80','#f472b6'];
  for(var i=0;i<80;i++){
    parts.push({
      x:c.width/2, y:c.height*0.3,
      vx:(Math.random()-0.5)*12, vy:-(Math.random()*10+4),
      g:0.25+Math.random()*0.15, r:3+Math.random()*4,
      col:colors[i%colors.length], life:60+Math.random()*40
    });
  }
  var frame=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(var j=0;j<parts.length;j++){
      var p=parts[j];
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.g; p.life--;
      ctx.globalAlpha=Math.max(0,p.life/40);
      ctx.fillStyle=p.col;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    frame++;
    if(frame<90) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,c.width,c.height);
  }
  draw();
}

function updateStreak(){
  var d=load();
  var t=today();
  if(d.lastDay!==t){
    if(d.lastDay===yesterday()) d.streak=(d.streak||0)+1;
    else d.streak=1;
    d.lastDay=t;
    save(d);
  }
  var sv=document.getElementById('streakVal');
  var xv=document.getElementById('xpVal');
  if(sv) sv.textContent=d.streak||0;
  if(xv) xv.textContent=d.xp||0;
  return d;
}

var SUBJECTS=[
  {id:'russian',name:'Русский',icon:'📖'},
  {id:'math',name:'Математика',icon:'🔢'},
  {id:'history',name:'История',icon:'🏛️'},
  {id:'biology',name:'Биология',icon:'🧬'},
  {id:'physics',name:'Физика',icon:'⚛️'},
  {id:'english',name:'Английский',icon:'🇬🇧'},
  {id:'geography',name:'География',icon:'🌍'},
  {id:'social',name:'Обществознание',icon:'⚖️'},
  {id:'informatics',name:'Информатика',icon:'💻'},
  {id:'literature',name:'Литература',icon:'📕'},
  {id:'chemistry',name:'Химия',icon:'⚗️'}
];

function renderProgress(){
  var d=load();
  var box=document.getElementById('progressList');
  if(!box) return;
  var html='';
  for(var i=0;i<SUBJECTS.length;i++){
    var s=SUBJECTS[i];
    var v=Math.min(100, d.subj[s.id]||0);
    html+='<div class="prog-item"><div class="prog-head"><span>'+s.icon+' '+s.name+'</span><span>'+v+'%</span></div><div class="prog-bar"><div class="prog-fill" style="width:'+v+'%"></div></div></div>';
  }
  box.innerHTML=html;
  var els=document.querySelectorAll('[data-xp]');
  for(var k=0;k<els.length;k++){
    var id=els[k].getAttribute('data-xp');
    var vv=d.subj[id]||0;
    els[k].textContent=vv?('прогресс '+vv+'%'):'ещё не начинал';
  }
}

function addProgress(subj,pts){
  var d=load();
  d.subj[subj]=Math.min(100,(d.subj[subj]||0)+pts);
  d.xp=(d.xp||0)+Math.round(pts/2);
  save(d);
  renderProgress();
  var xv=document.getElementById('xpVal');
  if(xv) xv.textContent=d.xp;
}

/* XP only once per subject per day (not every click) */
var cards=document.querySelectorAll('.card[data-subj]');
for(var ci=0;ci<cards.length;ci++){
  (function(a){
    a.addEventListener('click', function(){
      var id=a.getAttribute('data-subj');
      grantSubjectVisit(id);
    });
  })(cards[ci]);
}

function grantSubjectVisit(subj){
  /* Больше НЕ даём XP за открытие предмета — только уроки/тесты */
  return;
}

var MISSIONS=[
  {title:'Русский · орфография',desc:'10 минут: повтори сложные написания и сделай 5 упражнений в разделе Практика.',href:'russian/index.html',subj:'russian'},
  {title:'Математика · формулы',desc:'Повтори 5 формул и реши 3 задания из практики.',href:'math/index.html',subj:'math'},
  {title:'История · даты',desc:'Выучи 5 ключевых дат и проверь себя в тесте темы.',href:'history/index.html',subj:'history'},
  {title:'Биология · термины',desc:'Разбери одну сложную тему и ответь на 5 вопросов.',href:'biology/index.html',subj:'biology'},
  {title:'Физика · единицы',desc:'Повтори обозначения величин и реши 2 задачи.',href:'physics/index.html',subj:'physics'},
  {title:'Английский · слова',desc:'Выучи 10 слов и пройди мини-урок в практике.',href:'english/index.html',subj:'english'},
  {title:'География · карта',desc:'Повтори регионы России и пройди тест по теме.',href:'geography/index.html',subj:'geography'},
  {title:'Обществознание · понятия',desc:'Разбери 3 термина и ответь на вопросы в ОГЭ.',href:'social/index.html',subj:'social'},
  {title:'Информатика · алгоритмы',desc:'Повтори блок-схемы и сделай 3 задания.',href:'informatics/index.html',subj:'informatics'},
  {title:'Литература · произведения',desc:'Вспомни 2 произведения и сюжет — раздел ОГЭ.',href:'literature/index.html',subj:'literature'},
  {title:'Химия · реакции',desc:'Повтори типы реакций и пройди короткий тест.',href:'chemistry/index.html',subj:'chemistry'},
  {title:'Мини-тест дня',desc:'Пройди мини-тест из 5 вопросов на главной — проверь уровень.',href:'#quiz',subj:'russian'}
];

function dayIndex(){
  var start=new Date(2025,0,1).getTime();
  return Math.floor((Date.now()-start)/86400000);
}

function showMission(forceNew){
  var d=load();
  var idx;
  if(forceNew) idx=(dayIndex()+Math.floor(Math.random()*MISSIONS.length))%MISSIONS.length;
  else if(typeof d.missionId==='number') idx=d.missionId%MISSIONS.length;
  else idx=dayIndex()%MISSIONS.length;
  d.missionId=idx; save(d);
  var m=MISSIONS[idx];
  var mt=document.getElementById('missionTitle');
  var md=document.getElementById('missionDesc');
  var go=document.getElementById('missionGo');
  var done=document.getElementById('missionDone');
  if(mt) mt.textContent=m.title;
  if(md) md.textContent=m.desc;
  if(go){
    go.href=m.href;
    go.onclick=function(e){
      if(m.href==='#quiz'){
        e.preventDefault();
        var b=document.getElementById('startQuiz');
        if(b) b.click();
        return;
      }
      /* XP only when opening subject (once/day) or finishing mission — not for button press */
    };
  }
  if(done){
    done.style.display='inline-flex';
    if(d.missionDone===today()){ done.textContent='Выполнено ✓'; done.disabled=true; }
    else { done.textContent='Готово ✓ (+15 XP)'; done.disabled=false; }
  }
}

var missionDoneBtn=document.getElementById('missionDone');
if(missionDoneBtn){
  missionDoneBtn.onclick=function(){
    var d=load();
    if(d.missionDone===today()){ toast('Уже засчитано сегодня'); return; }
    d.missionDone=today();
    d.xp=(d.xp||0)+15;
    var m=window.ogeAiMission||MISSIONS[(d.missionId||0)%MISSIONS.length];
    d.subj[m.subj]=Math.min(100,(d.subj[m.subj]||0)+10);
    save(d);
    var xv=document.getElementById('xpVal');
    if(xv) xv.textContent=d.xp;
    this.textContent='Выполнено ✓';
    this.disabled=true;
    renderProgress();
    confetti();
    toast('Задание дня выполнено! +15 XP');
  };
}
var missionSkip=document.getElementById('missionSkip');
if(missionSkip){
  missionSkip.onclick=function(){
    var d=load();
    d.missionId=((d.missionId||0)+1)%MISSIONS.length;
    save(d);
    showMission(true);
  };
}

var QUIZ=[
  {q:'Русский: в каком слове пишется НН?',opts:['деревяный','стеклянный','ветреный','юный'],a:1},
  {q:'Математика: чему равен корень из 144?',opts:['10','11','12','14'],a:2},
  {q:'История: в каком году началась Великая Отечественная война?',opts:['1939','1941','1945','1917'],a:1},
  {q:'Биология: какая органелла отвечает за синтез белка?',opts:['митохондрия','рибосома','лизосома','вакуоль'],a:1},
  {q:'Физика: единица силы тока?',opts:['вольт','ватт','ампер','ом'],a:2}
];
var quizAnswers=[];

var startQuizBtn=document.getElementById('startQuiz');
if(startQuizBtn){
  startQuizBtn.onclick=function(){
    quizAnswers=[];
    for(var i=0;i<QUIZ.length;i++) quizAnswers.push(null);
    var panel=document.getElementById('quizPanel');
    if(!panel) return;
    panel.classList.add('open');
    try{ panel.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){}
    var body=document.getElementById('quizBody');
    var html='';
    for(var qi=0;qi<QUIZ.length;qi++){
      var item=QUIZ[qi];
      html+='<div class="q-card" data-qi="'+qi+'"><div class="q-text">'+(qi+1)+'. '+item.q+'</div>';
      for(var oi=0;oi<item.opts.length;oi++){
        html+='<button type="button" class="q-opt" data-qi="'+qi+'" data-oi="'+oi+'">'+item.opts[oi]+'</button>';
      }
      html+='</div>';
    }
    body.innerHTML=html;
    document.getElementById('quizFooter').innerHTML='<button type="button" class="btn btn-primary" id="quizSubmit" style="width:100%">Проверить</button>';
    var opts=body.querySelectorAll('.q-opt');
    for(var oi=0;oi<opts.length;oi++){
      opts[oi].onclick=function(){
        var qi=+this.getAttribute('data-qi');
        var oiv=+this.getAttribute('data-oi');
        quizAnswers[qi]=oiv;
        var all=body.querySelectorAll('.q-opt[data-qi="'+qi+'"]');
        for(var j=0;j<all.length;j++) all[j].classList.remove('picked');
        this.classList.add('picked');
      };
    }
    document.getElementById('quizSubmit').onclick=finishQuiz;
  };
}

function finishQuiz(){
  for(var i=0;i<quizAnswers.length;i++){
    if(quizAnswers[i]===null){ toast('Ответь на все вопросы'); return; }
  }
  var score=0;
  for(var qi=0;qi<QUIZ.length;qi++){
    var item=QUIZ[qi];
    var card=document.querySelector('.q-card[data-qi="'+qi+'"]');
    if(!card) continue;
    var btns=card.querySelectorAll('.q-opt');
    for(var oi=0;oi<btns.length;oi++){
      btns[oi].disabled=true;
      if(oi===item.a) btns[oi].classList.add('correct');
      else if(oi===quizAnswers[qi]) btns[oi].classList.add('wrong');
    }
    if(quizAnswers[qi]===item.a) score++;
  }
  var d=load();
  d.xp=(d.xp||0)+score*5;
  d.quizBest=Math.max(d.quizBest||0, score);
  var bump=['russian','math','history','biology','physics'];
  for(var bi=0;bi<bump.length;bi++){
    if(quizAnswers[bi]===QUIZ[bi].a) d.subj[bump[bi]]=Math.min(100,(d.subj[bump[bi]]||0)+4);
  }
  save(d);
  var xv=document.getElementById('xpVal');
  if(xv) xv.textContent=d.xp;
  renderProgress();
  var levels=['Нужно подтянуть базу','Есть пробелы','Средний уровень','Хороший уровень','Отлично, так держать!'];
  var site='https://preparationforoge.netlify.app/';
  var shareText='Я прошёл мини-тест ОГЭ: '+score+'/5. '+(levels[score]||'')+'\nГотовься со мной: '+site;
  var tg='https://t.me/share/url?url='+encodeURIComponent(site)+'&text='+encodeURIComponent(shareText);
  document.getElementById('quizFooter').innerHTML=
    '<div class="quiz-result"><div class="score">'+score+'/5</div>'+
    '<div style="font-weight:700;margin:6px 0;color:#1e1b4b">'+(levels[score]||'')+'</div>'+
    '<div style="font-size:.85rem;color:#64748b;margin-bottom:10px">+'+ (score*5) +' XP</div>'+
    '<div class="share-row">'+
    '<button type="button" class="btn btn-primary" id="shareBtn">Поделиться с другом</button>'+
    '<a class="btn btn-soft" href="'+tg+'" target="_blank" rel="noopener">В Telegram</a>'+
    '</div></div>';
  confetti();
  var sb=document.getElementById('shareBtn');
  if(sb){
    sb.onclick=function(){
      if(navigator.share){
        navigator.share({title:'ОГЭ мини-тест', text:shareText, url:site}).catch(function(){});
      } else if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(shareText).then(function(){ toast('Текст скопирован'); }).catch(function(){ prompt('Скопируй:', shareText); });
      } else prompt('Скопируй:', shareText);
    };
  }
}

/* notify selects */
(function(){
  var hh=document.getElementById('notifyHour');
  var mm=document.getElementById('notifyMinute');
  if(!hh||!mm) return;
  hh.innerHTML=''; mm.innerHTML='';
  for(var h=0;h<24;h++){
    var o=document.createElement('option');
    o.value=h; o.textContent=(h<10?'0':'')+h;
    if(h===18) o.selected=true;
    hh.appendChild(o);
  }
  var mins=[0,5,10,15,20,25,30,35,40,45,50,55];
  for(var mi=0;mi<mins.length;mi++){
    var o2=document.createElement('option');
    o2.value=mins[mi]; o2.textContent=(mins[mi]<10?'0':'')+mins[mi];
    mm.appendChild(o2);
  }
  if(window.OgeApp && OgeApp.getNotify){
    var s=OgeApp.getNotify();
    hh.value=s.hour; mm.value=s.minute;
  }
})();

updateStreak();
renderProgress();
showMission(false);

}catch(err){
  console.error('oge main error', err);
  var w=document.querySelector('.wrap');
  if(w){
    var n=document.createElement('div');
    n.style.cssText='background:#fee2e2;color:#991b1b;padding:12px;border-radius:12px;margin:12px 0;font-size:14px';
    n.textContent='Ошибка скрипта: '+(err && err.message ? err.message : err);
    w.insertBefore(n, w.firstChild);
  }
}
})();
