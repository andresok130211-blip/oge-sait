function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Единица силы?','Ньютон','Джоуль','Ватт',1],['v=s/t при?','Равномерном','Только падении','Покое',1],
    ['F=ma?','II Ньютона','Ома','Гука',1],['Давление?','F/S','s/t','q/t',1],
    ['Ek=?','mv²/2','mgh','IUt',1],['Ep=?','mgh','mv²/2','q/t',1],
    ['Q=cmΔt?','Нагрев','Плавление','Кипение',1],['Плавление Q?','λm','cmΔt','IUt',1],
    ['I=U/R?','Ом','Ньютон','Гука',1],['Последовательно R?','Складываются','1/R сумма','U сумма тока',1],
    ['Параллельно U?','Одинаково','Складывается','Ноль',1],['P=IU?','Мощность','Заряд','Путь',1],
    ['Угол падения?','= отражения','=90 всегда','=0',1],['D=1/F?','Опт. сила','Ток','Давление',1],
    ['ν=1/T?','Частота','Сила','Заряд',1],['λ=v/ν?','Длина волны','Период','Масса',1],
    ['Звук в вакууме?','Нет','Да','Громче',1],['Протон где?','В ядре','В линзе','Только в проводе',1],
    ['α-частица?','Ядро гелия','Электрон','Фотон',1],['Фотоэффект?','Выбивание e светом','Кипение','Ом'],
    ['g≈?','10 м/с²','10 м/с','10 Н',1],['Единица U?','Вольт','Ампер','Ом',1],
    ['Единица R?','Ом','Ватт','Паскаль',1],['Работа тока?','IUt','mgh','s/t',1],
    ['Горизонт s(t)?','Покой','Ускорение','Падение',1],['Кипение на графике?','Плато','Прямая вверх','Точка'],
    ['Собирающая линза?','Толще в центре','Тоньше в центре','Плоская',1],['γ-лучи?','ЭМ излучение','Протоны','Молекулы',1]
  ];
  // fix last incomplete
  bank[19]=['Фотоэффект?','Выбивание e светом','Кипение','Закон Ома',1];
  bank[25]=['Кипение на графике?','Плато','Прямая вверх','Точка',1];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i; const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['⚙️','🌡️','⚡','🔦','🌊','⚛️'][i%6];
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
  fp.innerHTML='<h4>Итоговый тест — 50 вопросов</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}


