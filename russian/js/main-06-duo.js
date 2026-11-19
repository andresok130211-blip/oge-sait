function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  container.innerHTML='';
  const bank=[
['Подлежащее отвечает на','где?','кто? что?','зачем?',2],
['НЕ с глаголом обычно','через дефис','слитно','раздельно',3],
['Сложное предложение содержит','1 основу','0 основ','2 и более основ',3],
['Причастие отвечает на','что сделать?','что делая?','какой?',3],
['Деепричастие отвечает на','какой?','что делая?','чей?',2],
['Основа предложения — это','подлежащее и сказуемое','только обстоятельство','только дополнение',1],
['Обращение на письме','не выделяется','только в начале','выделяется запятыми',3],
['Вводное «конечно»','выделяется запятыми','не выделяется','только тире',1],
['Прямая речь оформляется','кавычками и знаками','только скобками','без знаков',1],
['НН в слове «деревянный»','да, НН','без Н','одна Н',1],
['НН в слове «стеклянный»','одна Н','без Н','да, НН',3],
['НН в слове «оловянный»','одна Н','без Н','да, НН',3],
['Краткое причастие «решена»','без Н','одна Н','НН',2],
['Приставка ПРЕ- часто значит','приближение','очень / пере-','неполноту',2],
['Приставка ПРИ- часто значит','очень','приближение / присоединение','пере-',2],
['Однородные члены связываются','только точкой','только тире','запятыми / союзами',3],
['СПП — это','простое','сложноподчинённое','бессоюзное только',2],
['Союз «что» часто начинает','вводное','обращение','придаточное',3],
['«Не» с существительным слитно, если','всегда раздельно','всегда слитно','можно заменить синонимом без не',3],
['Тире между подлежащим и сказуемым, если','всегда','никогда','оба — существительные в им.п.',3],
['Причастный оборот после слова','обычно обособляется','только в начале','никогда',1],
['Деепричастный оборот','не обособляется','только в конце','обычно обособляется',3],
['Сказуемое обозначает','что говорится о подлежащем','только место','только время',1],
['Дополнение отвечает на вопросы','как?','кто? что? в им.п.','косвенных падежей',3],
['Определение отвечает на','где?','какой? чей?','что делать?',2],
['Обстоятельство отвечает на','кто? что?','чей?','где? когда? как?',3],
['Сложносочинённое с союзом «и»','запятая часто нужна между частями','запятая никогда','только точка с запятой',1],
['Междометие «ах» на письме','часто выделяется','только кавычки','не выделяется',1],
['Частица «ли» пишется','раздельно','через дефис','слитно',1],
['«По-русски» пишется','слитно','через дефис','раздельно',2],
['Проверочное слово нужно для','всегда для приставки','безударной гласной в корне','только для суффикса',2],
['«Безударная гласная в корне» — тема','синтаксиса только','пунктуации','орфографии',3],
['Изложение на ОГЭ — это','сжатый пересказ','сочинение-рассуждение','диктант',1],
['В сжатом изложении важно','добавить своё мнение','увеличить объём вдвое','сохранить микротемы',3],
['Тема текста — это','заголовок только','последнее предложение','о чём текст',3],
['Идея текста — это','главная мысль автора','список героев','дата написания',1],
['Антоним — это','однокоренное','близкое по смыслу','слово с противоположным значением',3],
['Синоним — это','иностранное','противоположное','близкое по смыслу слово',3],
['Фразеологизм — это','имя собственное','устойчивое выражение','любое предложение',2],
['«Водить за нос» значит','помогать','гулять','обманывать',3],
['Склонение связано с','временем глагола','изменением по падежам','числом только',2],
['Спряжение связано с','существительным','числительным','глаголом',3],
['1 лицо ед.ч. глагола — форма','ты (идёшь)','он (идёт)','я (иду)',3],
['Инфинитив — это','форма падежа','форма времени','начальная форма глагола',3],
['Совершенный вид глагола','что сделать?','какой?','что делать?',1],
['Несовершенный вид','чей?','что сделать?','что делать?',3],
['«Ться» / «тся» в глаголе','всегда ться','всегда тся','вопрос: есть ли ь в вопросе',3],
['Запятая перед «чтобы»','только в начале текста','часто нужна (придаточное)','никогда',2],
['Однородные определения','могут разделяться запятой','только тире','никогда не разделяются',1],
['«А» как союз сочинительный','может связывать основы','только частица','только вводное',1]
];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){
      const mod=document.createElement('div');
      mod.className='duo-module';
      mod.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';
      container.appendChild(mod);
      track=document.createElement('div');
      track.className='duo-track';
      container.appendChild(track);
    }
    const id='dn'+i;
    const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');
    wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');
    btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0) btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['⭐','📘','✏️','🧠','🔥','✅'][i%6];
    btn.onclick=function(){ openDuoLesson(this,'panel-'+id); };
    const label=document.createElement('div');
    label.className='duo-label';
    label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');
    panel.className='duo-lesson-panel';
    panel.id='panel-'+id;
    let quiz='';
    // unique set per lesson: start offset depends on lesson index
    for(let k=0;k<10;k++){
      const it=bank[(i*7+k*3)%bank.length];
      quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';
    }
    const startBtn=document.createElement('button');
    startBtn.className='duo-start-btn';
    startBtn.textContent='Готово ✓';
    startBtn.onclick=(function(nodeId){ return function(){ completeDuoNode(this, nodeId, 12); }; })(id);
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div>';
    panel.appendChild(startBtn);
    wrap.appendChild(btn);
    wrap.appendChild(label);
    wrap.appendChild(panel);
    track.appendChild(wrap);
    const line=document.createElement('div');
    line.className='duo-line';
    track.appendChild(line);
  }
  const fw=document.createElement('div');
  fw.className='duo-node-wrap';
  const fb=document.createElement('button');
  fb.className='duo-node locked';
  fb.dataset.unlock='dn199';
  fb.textContent='🏆';
  fb.onclick=function(){ openDuoLesson(this,'panel-dnfinal'); };
  const fl=document.createElement('div');
  fl.className='duo-label';
  fl.textContent='Финал 50';
  const fp=document.createElement('div');
  fp.className='duo-lesson-panel';
  fp.id='panel-dnfinal';
  let fq='';
  for(let k=0;k<50;k++){
    const it=bank[(k*5+11)%bank.length];
    fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';
  }
  fp.innerHTML='<h4>Итог — 50</h4><div class="quiz-box">'+fq+'</div>';
  const finBtn=document.createElement('button');
  finBtn.className='duo-start-btn';
  finBtn.textContent='Готово ✓';
  finBtn.onclick=function(){ completeDuoNode(this,'dnfinal',100); };
  fp.appendChild(finBtn);
  fw.appendChild(fb); fw.appendChild(fl); fw.appendChild(fp);
  container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(function(n){
    if(typeof completed!=='undefined' && completed['duo-'+n.dataset.unlock]){
      n.classList.remove('locked');
      n.classList.add('active');
    }
  });
  document.querySelectorAll('.q-item').forEach(function(q){ delete q.dataset.bound; }); if(typeof bindQuizzes==='function') bindQuizzes();
}

