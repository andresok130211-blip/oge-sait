function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['I ___ to school every day','go','goes','am go',1],
    ['She ___ TV now','is watching','watch','watches',1],
    ['Yesterday they ___ a museum','visited','visit','have visited',1],
    ['I have ___ done it','already','yesterday','ago',1],
    ['___ apple','an','a','the the',1],
    ['___ sun is bright','The','A','An'],
    ['Do you ___ coffee?','like','likes','liking',1],
    ['He ___ not play football','does','do','is',1],
    ['There ___ two cats','are','is','have',1],
    ['How ___ milk?','much','many','long',1],
    ['good → better →','best','gooder','more good',1],
    ['go – ___ – gone','went','goed','goes',1],
    ['see – saw –','seen','seed','saw',1],
    ['I ___ 15 years old','am','have','has',1],
    ['Dear Tom___',' ,',' .',' !',1],
    ['Best ___ ,','wishes','wish','wishing',1],
    ['interested ___ music','in','on','at',1],
    ['good ___ English','at','in','on',1],
    ['Markers of Past Simple?','yesterday, ago','already, yet','now, look',1],
    ['Present Perfect uses','have/has + V3','V2 only','am + V1',1],
    ['Not stated means','not in the text','false','true',1],
    ['We ___ friends since 2020','have been','are','was',1],
    ['___ Alps','The','A','—',1],
    ['She ___ to London last year','went','has gone','go',1],
    ['Look! They ___','are running','run','runs',1],
    ['many + nouns are','countable','uncountable','verbs',1],
    ['will is often for','future decision','habit','past',1],
    ['take – ___ – taken','took','taked','taking',1]
  ];
  bank[5]=['___ sun is bright','The','A','An',1];
  bank[14]=['Dear Tom needs','comma','point only','nothing',1];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>MODULE '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i;const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['🇬🇧','⏱️','📰','📖','✉️','🎤'][i%6];
    btn.onclick=function(){openDuoLesson(this,'panel-'+id)};
    const label=document.createElement('div');label.className='duo-label';label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');panel.className='duo-lesson-panel';panel.id='panel-'+id;
    let quiz='';
    for(let k=0;k<10;k++){const it=bank[(i*3+k)%bank.length];quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\''+id+'\',12)">Готово ✓</button>';
    wrap.appendChild(btn);wrap.appendChild(label);wrap.appendChild(panel);track.appendChild(wrap);
    track.appendChild(Object.assign(document.createElement('div'),{className:'duo-line'}));
  }
  const fw=document.createElement('div');fw.className='duo-node-wrap';
  const fb=document.createElement('button');fb.className='duo-node locked';fb.dataset.unlock='dn199';fb.textContent='🏆';
  fb.onclick=function(){openDuoLesson(this,'panel-dnfinal')};
  const fl=document.createElement('div');fl.className='duo-label';fl.textContent='Финал 50';
  const fp=document.createElement('div');fp.className='duo-lesson-panel';fp.id='panel-dnfinal';
  let fq='';for(let k=0;k<50;k++){const it=bank[k%bank.length];fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
  fp.innerHTML='<h4>Final — 50 questions</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Done ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}
