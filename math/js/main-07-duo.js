function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  container.innerHTML='';
  const bank=[
['1% это','1/10','1/100','1/1000',2],
['Площадь прямоугольника 3×5','16','8','15',3],
['Сумма углов треугольника','90°','360°','180°',3],
['Теорема Пифагора','a+b=c','a−b=c','a²+b²=c²',3],
['P=m/n — это','площадь','вероятность','объём',2],
['|−7| =','7','−7','0',1],
['y=kx+b — график','круга','всегда параболы','прямой',3],
['√25 =','5','25','12,5',1],
['Объём куба с ребром 3','9','18','27',3],
['0,5 как проценты','5%','50%','0,5%',2],
['Среднее арифметическое 4 и 10','7','14','6',1],
['(−2)×(−3) =','0','−6','6',3],
['1/2 от 8','4','16','2',1],
['Площадь круга','2πr','πd','πr²',3],
['x+5=12, x =','7','17','−7',1],
['2³ =','8','9','6',1],
['Периметр квадрата со стороной 6','36','12','24',3],
['Площадь квадрата со стороной 5','10','25','20',2],
['3/4 + 1/4 =','4/8','1/2','1',3],
['10% от 50','15','10','5',3],
['√49 =','7','24,5','14',1],
['0,25 =','2/5','1/25','1/4',3],
['Сумма углов четырёхугольника','180°','360°','90°',2],
['Площадь треугольника с a=6, h=4','10','12','24',2],
['5² =','25','10','15',1],
['(−8)+3 =','−5','5','−11',1],
['12÷(−3) =','4','−4','−9',2],
['Сколько мм в 2 см','200','20','2',2],
['Сколько см в 1 м','10','1000','100',3],
['Медиана ряда 1,3,5','5','3','1',2],
['Мода ряда 2,2,3,5','3','5','2',3],
['y=x² — это','парабола','гипербола','прямая',1],
['Корень уравнения x−4=0','4','0','−4',1],
['2x=10, x =','20','8','5',3],
['Площадь прямоугольника 7×2','18','14','9',2],
['Объём прямоугольного параллелепипеда 2×3×4','24','9','14',1],
['Синус острого угла — это отношение','прилеж. катета к гипотенузе','противол. катета к гипотенузе','катета к катету',2],
['cos 0° =','0','1','0,5',2],
['sin 90° =','0','1','0,5',2],
['25% от 80','40','25','20',3],
['Упростить 2a+3a','5a','2a3a','6a',1],
['Степень: a¹ =','1','a','0',2],
['a⁰ (a≠0) =','1','0','a',1],
['Координата середины отрезка от 2 до 8','6','4','5',3],
['Расстояние от −3 до 5','−8','2','8',3],
['Неравенство: x>3, число из решения','4','2','3',1],
['Дробь 6/8 сократить','2/3','6/4','3/4',3],
['Найти 1/5 от 20','4','5','15',1],
['Площадь ромба (d1=6, d2=8)','14','48','24',3],
['Периметр треугольника 3+4+5','12','60','6',1],
['Вероятность орла на монете','1/3','1','1/2',3],
['Сколько чисел от 1 до 10 включительно','9','11','10',3],
['3,14≈','π','e','√2',1],
['Угол 90° —','прямой','острый','тупой',1],
['Угол 45° —','острый','прямой','тупой',1],
['Угол 120° —','прямой','тупой','острый',2],
['Смежные углы в сумме','360°','90°','180°',3],
['Вертикальные углы','в сумме 180°','в сумме 90°','равны',3],
['Формула скорости','v=s·t','v=t/s','v=s/t',3],
['Если s=100, t=2, v =','200','50','98',2],
['−(−5) =','5','−5','0',1],
['0×15 =','15','0','1',2],
['1×n =','n','0','1',1],
['Разделить 15 в отношении 1:2 (меньшая часть)','5','10','7,5',1],
['Сколько % составляет 3 от 12','25%','30%','3%',1],
['Уравнение 3x−6=0, x =','3','2','6',2],
['График y=const —','вертикальная','горизонтальная прямая','парабола',2],
['Ось x —','абсцисс','ординат','аппликат',1],
['Квадрант I: знаки','x>0, y>0','x<0, y>0','x>0, y<0',1],
['Диагонали прямоугольника','не равны','перпендикулярны всегда','равны',3],
['В равностороннем треугольнике углы','по 45°','по 60°','по 90°',2],
['Гипотенуза — сторона','любая','против прямого угла','при остром',2],
['Катет — сторона','при прямом угле','против прямого','только верхняя',1],
['Площадь трапеции (a=4,b=6,h=5)','50','25','20',2],
['Сколько граней у куба','8','6','12',2],
['Сколько рёбер у куба','12','6','8',1],
['Сколько вершин у куба','6','8','12',2],
['10³ =','100','30','1000',3],
['√9 + √16 =','7','5','25',1],
['2/5 + 1/5 =','3/5','3/10','2/1',1],
['Наибольший общий делитель 12 и 18','36','6','3',2],
['Наименьшее общее кратное 4 и 6','2','24','12',3],
['0,1 + 0,01 =','0,101','0,11','0,2',2],
['5! (факториал, если знаешь) начало 5×4×3×2×1 =','25','15','120',3]
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

