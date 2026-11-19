function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Z атома —?','число протонов','только нейтроны','масса в кг',1],
    ['n = m/M','количество вещества','скорость','площадь',1],
    ['Vₘ н.у.','22,4 л/моль','1 л/моль','100',1],
    ['NaOH —?','щёлочь','кислота','кислый оксид',1],
    ['H₂SO₄ —?','кислота','основание','основный оксид',1],
    ['Ионная связь','металл+неметалл','только H₂','только O₂',1],
    ['Окисление','отдача e⁻','приём e⁻','только нагрев',1],
    ['Восстановление','приём e⁻','отдача e⁻','испарение',1],
    ['Алканы','CₙH₂ₙ₊₂','CₙH₂ₙ','CₙH₂ₙ₋₂',1],
    ['w =','m(в-ва)/m(смеси)','только V','только Z',1],
    ['CO₂ + известковая вода','мутнеет','синеет','горит',1],
    ['M(H₂O)≈','18','2','32',1],
    ['Период —','горизонталь','вертикаль','круг',1],
    ['Группа —','вертикаль','строка','диагональ',1],
    ['Катализатор','ускоряет','съедает продукт','меняет Z',1],
    ['Фенолфталеин+щёлочь','малиновый','бесцветный всегда','зелёный',1],
    ['100₂ в химии?','не путать с химией: Z≠A','равно Z','равно n',1],
    ['Гомолог +?','CH₂','O₂','Na',1],
    ['Обмен если','осадок/газ/вода','всегда','никогда',1],
    ['Электроны в нейтральном атоме','=Z','=A','=n',1],
    ['Степень окисления простого','0','+1 всегда','−2 всегда',1],
    ['n = V/22,4','газы н.у.','любые твёрдые','металлы куском',1],
    ['При разбавлении n в-ва','то же','0','всегда ×2',1],
    ['Ag⁺+Cl⁻','белый осадок','газ H₂','малиновый',1],
    ['Металлы в таблице','слева/внизу','справа вверху','только газы',1],
    ['Коэффициенты','баланс атомов','случай','красота',1],
    ['−COOH','карбоксильная','алкан','ион Na',1],
    ['Избыток','не лимитирует','лимитирует всегда','удаляет уравнение',1]
  ];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i;const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['⚛️','🧪','🔥','🧮','💧','🌿'][i%6];
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
  fp.innerHTML='<h4>Итог — 50</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}
