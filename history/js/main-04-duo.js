function openDuoLesson(btn,panelId){
  if(btn.classList.contains('locked'))return;
  document.querySelectorAll('.duo-lesson-panel').forEach(p=>p.classList.remove('show'));
  const panel=document.getElementById(panelId);if(panel)panel.classList.toggle('show')
}
function completeDuoNode(btn,id,pts){
  if(!completed['duo-'+id]){
    completed['duo-'+id]=true;localStorage.setItem('oge_history_completed',JSON.stringify(completed));
    xp+=pts;localStorage.setItem('oge_history_xp',xp);document.getElementById('xpCount').textContent=xp;
    document.getElementById('xpGain').textContent=pts;document.getElementById('overlay').classList.add('show');document.getElementById('xpPopup').classList.add('show');
    setTimeout(()=>{document.getElementById('overlay').classList.remove('show');document.getElementById('xpPopup').classList.remove('show')},1200)
  }
  const node=btn.closest('.duo-node-wrap').querySelector('.duo-node');
  if(node){node.classList.remove('active');node.classList.add('done');node.textContent='✓'}
  document.querySelectorAll('.duo-node.locked[data-unlock="'+id+'"]').forEach(n=>{n.classList.remove('locked');n.classList.add('active')});
  btn.closest('.duo-lesson-panel').classList.remove('show');bindQuizzes()
}
document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{
  if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');if(!n.classList.contains('chest'))n.classList.add('active')}
});

// ===================== ГЕНЕРАЦИЯ 30 ВАРИАНТОВ =====================

function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Рюрик — год?','862','988','1240',1],['Крещение Руси?','988','862','1223',1],
    ['Калка?','1223','1380','1480',1],['Невская битва?','1240','1242','1380',1],
    ['Ледовое?','1242','1240','1223',1],['Куликово?','1380','1480','1240',1],
    ['Угра?','1480','1380','1547',1],['Венчание Ивана IV?','1547','1552','1565',1],
    ['Опричнина с?','1565','1547','1480',1],['Романовы с?','1613','1598','1703',1],
    ['Петербург?','1703','1721','1709',1],['Полтава?','1709','1703','1812',1],
    ['Империя с?','1721','1703','1613',1],['Отечественная?','1812','1853','1914',1],
    ['Декабристы?','1825','1812','1861',1],['Отмена крепостного?','1861','1825','1905',1],
    ['Ярлык — это?','Грамота хана','Налог','Флот',1],['Кто на Неве?','Александр Невский','Пётр I','Кутузов',1],
    ['Куликово — князь?','Дмитрий Донской','Иван III','Иван IV',1],['Северная война с?','Швецией','Францией','Японией',1]
  ];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i; const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);btn.textContent=['📜','⚔️','👑','⚓','⭐'][i%5];
    btn.onclick=function(){openDuoLesson(this,'panel-'+id)};
    const label=document.createElement('div');label.className='duo-label';label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');panel.className='duo-lesson-panel';panel.id='panel-'+id;
    let quiz='';
    for(let k=0;k<10;k++){const it=bank[(i*3+k)%bank.length];quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\''+id+'\',12)">Готово ✓</button>';
    wrap.appendChild(btn);wrap.appendChild(label);wrap.appendChild(panel);track.appendChild(wrap);
    const line=document.createElement('div');line.className='duo-line';track.appendChild(line);
  }
  const fw=document.createElement('div');fw.className='duo-node-wrap';
  const fb=document.createElement('button');fb.className='duo-node locked';fb.dataset.unlock='dn199';fb.textContent='🏆';
  fb.onclick=function(){openDuoLesson(this,'panel-dnfinal')};
  const fl=document.createElement('div');fl.className='duo-label';fl.textContent='Финал 50';
  const fp=document.createElement('div');fp.className='duo-lesson-panel';fp.id='panel-dnfinal';
  let fq='';for(let k=0;k<50;k++){const it=bank[k%bank.length];fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
  fp.innerHTML='<h4>Итоговый тест — 50 вопросов</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(typeof completed!=='undefined'&&completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  if(typeof bindQuizzes==='function')bindQuizzes();
}

