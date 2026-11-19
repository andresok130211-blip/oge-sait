function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['1 байт = ? бит','8','16','2',1],['Двоичные цифры?','0 и 1','0–9','A–F only',1],
    ['1010₂ = ?₁₀','10','5','12',1],['НЕ 1 =','0','1','2',1],
    ['1 И 0 =','0','1','2',1],['1 ИЛИ 0 =','1','0','2',1],
    ['Алгоритм конечен?','Да','Нет','Случайно',1],['if — это?','Ветвление','Цикл','Файл',1],
    ['* в маске','любая последовательность','один символ','папка',1],['? в маске','один символ','любая длина','бит',1],
    ['Формула в таблице с','=','#','?',1],['1 Кбайт ≈','1024 байт','8 бит','10 бит',1],
    ['a = a + 1','увеличить на 1','удалить','сравнить',1],['Цикл нужен чтобы','повторять','удалить ПК','сменить IP',1],
    ['ОЗУ — память','оперативная','только диск','бумага',1],['IP-адрес','адрес в сети','имя файла','байт',1],
    ['Конъюнкция','И','ИЛИ','НЕ',1],['Дизъюнкция','ИЛИ','И','НЕ',1],
    ['111₂ =','7','3','8',1],['log₂8 =','3','8','2',1],
    ['Ромб на схеме часто','условие','конец','файл',1],['Пароль должен быть','сложным','12345','как у всех',1],
    ['Фишинг','мошенничество','антивирус','процессор',1],['Сортировка','упорядочивает','удаляет лист','меняет IP',1],
    ['$A$1','абсолютная ссылка','маска','цикл',1],['Процессор','выполняет команды','только охлаждает','только рисует',1],
    ['0 ИЛИ 0','0','1','2',1],['1 И 1','1','0','2',1]
  ];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i;const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['🔢','💾','🔗','📐','💻','📁'][i%6];
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
