(function(){var LAB={"8-5":{t:'Расставь коэффициенты в уравнении',f:function(r){
var E=[[[['H₂',{H:2}],['O₂',{O:2}]],[['H₂O',{H:2,O:1}]],[2,1,2]],[[['Fe',{Fe:1}],['O₂',{O:2}]],[['Fe₂O₃',{Fe:2,O:3}]],[4,3,2]],[[['CH₄',{C:1,H:4}],['O₂',{O:2}]],[['CO₂',{C:1,O:2}],['H₂O',{H:2,O:1}]],[1,2,1,2]],[[['N₂',{N:2}],['H₂',{H:2}]],[['NH₃',{N:1,H:3}]],[1,3,2]],[[['Al',{Al:1}],['O₂',{O:2}]],[['Al₂O₃',{Al:2,O:3}]],[4,3,2]]],ei=0,co;
function draw(){var e=E[ei],all=e[0].concat(e[1]),nl=e[0].length,tot=[{},{}];
all.forEach(function(s,i){var side=i<nl?0:1;for(var a in s[1])tot[side][a]=(tot[side][a]||0)+s[1][a]*co[i]});
var els={};tot.forEach(function(t){for(var a in t)els[a]=1});var ok=true,rows='';
Object.keys(els).forEach(function(a){var l=tot[0][a]||0,rr=tot[1][a]||0,eq=l===rr;if(!eq)ok=false;rows+='<span style="margin-right:12px">'+a+': '+l+' '+(eq?'=':'≠')+' '+rr+' '+(eq?'✅':'❌')+'</span>'});
var h='<p>Нажимай + и −, чтобы число атомов слева и справа стало равным.</p><div class="lrow" style="align-items:center">';
all.forEach(function(s,i){if(i===nl)h+='<b>→</b>';else if(i>0)h+='<b>+</b>';h+='<span class="lcoef"><button class="lb sm" data-i="'+i+'" data-d="-1">−</button><b>'+co[i]+'</b><button class="lb sm" data-i="'+i+'" data-d="1">+</button> '+s[0]+'</span>'});
h+='</div><div class="lnote">'+rows+'</div>'+(ok?'<div class="lbig">Уравнение уравнено! 🎉</div><button class="lb" id="n">Следующее</button>':'');r.innerHTML=h;
r.querySelectorAll('button[data-i]').forEach(function(b){b.onclick=function(){var i=+b.dataset.i;co[i]=Math.max(1,Math.min(9,co[i]+ +b.dataset.d));draw()}});
var n=r.querySelector('#n');if(n)n.onclick=function(){ei=(ei+1)%E.length;co=E[ei][0].concat(E[ei][1]).map(function(){return 1});draw()}}
co=E[0][0].concat(E[0][1]).map(function(){return 1});draw()}},"8-12":{t:'Строение атома: электроны по слоям',f:function(r){
var EL=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar'],NM=['Водород','Гелий','Литий','Бериллий','Бор','Углерод','Азот','Кислород','Фтор','Неон','Натрий','Магний','Алюминий','Кремний','Фосфор','Сера','Хлор','Аргон'];
r.innerHTML='<p>Двигай ползунок — меняй порядковый номер элемента.</p><canvas width="300" height="240" style="width:100%;max-width:300px;display:block;margin:auto;background:#0f172a;border-radius:10px"></canvas><div class="lr">Z = <b id="zv"></b><input id="z" type="range" min="1" max="18" step="1" value="11"></div><div id="m1" class="lbig" style="font-size:1.05rem"></div><div id="m2" class="lnote"></div>';
var c=r.querySelector('canvas'),g=c.getContext('2d');
function sh(z){var s=[],l=[2,8,8];for(var i=0;i<3&&z>0;i++){var n=Math.min(z,l[i]);s.push(n);z-=n}return s}
function draw(){var z=+r.querySelector('#z').value,s=sh(z);r.querySelector('#zv').textContent=z+' — '+EL[z-1];
g.clearRect(0,0,300,240);var cx=150,cy=120;g.fillStyle='#ef4444';g.beginPath();g.arc(cx,cy,12,0,7);g.fill();g.fillStyle='#fff';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('+'+z,cx,cy+4);
s.forEach(function(n,i){var R=34+i*26;g.strokeStyle='#475569';g.lineWidth=1;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();for(var k=0;k<n;k++){var a=k/n*6.2832-1.57;g.fillStyle='#38bdf8';g.beginPath();g.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),4.5,0,7);g.fill()}});g.textAlign='left';
r.querySelector('#m1').textContent=NM[z-1]+' ('+EL[z-1]+'): электроны по слоям '+s.join(', ');
var out=s[s.length-1],full=(z===2||out===8);
r.querySelector('#m2').textContent='Слоёв (период): '+s.length+'. Электронов на внешнем слое: '+out+(z===2?' (у гелия слой завершён при 2)':'')+'. '+(full?'Внешний слой завершён — это благородный газ, он почти не вступает в реакции.':(z<=2||s.length&&out<=3?'Мало электронов на внешнем слое — металл охотно их отдаёт.':'Много электронов на внешнем слое — неметалл охотно принимает недостающие.'))}
r.querySelector('#z').oninput=draw;draw()}}};
var DRILLS={"sc8-chemistry-1":{"c":[],"k":[["Признаки химической реакции","выделение газа, осадок, изменение цвета, запаха, тепло и свет"]]},"sc8-chemistry-2":{"c":[],"k":[["Атом","частица элемента, молекула — частица вещества"],["Элемент","вид атомов с одинаковым зарядом ядра"]]},"sc8-chemistry-3":{"c":[],"k":[["H ","I, O — II, Na и K — I, Ca и Mg — II, Al — III"]]},"sc8-chemistry-4":{"c":[],"k":[["M_r","сумма A_r с учётом индексов"]]},"sc8-chemistry-5":{"c":[],"k":[["Реагенты","исходные вещества, продукты — образовавшиеся"]]},"sc8-chemistry-6":{"c":[],"k":[["Замещение","A + BC = AC + B"],["Обмен","AB + CD = AD + CB"]]},"sc8-chemistry-7":{"c":[],"k":[["Воздух","около 21% O₂ и 78% N₂ по объёму"]]},"sc8-chemistry-8":{"c":[],"k":[["H₂","самый лёгкий газ"],["Получение","металл (до H) + кислота"],["Горение","2H₂ + O₂ = 2H₂O"]]},"sc8-chemistry-10":{"c":[],"k":[["Оксид","два элемента, один из них — кислород"]]},"sc8-chemistry-13":{"c":[],"k":[["Ковалентная неполярная","одинаковые атомы неметаллов"],["Ковалентная полярная","разные неметаллы"],["Ионная","металл + неметалл"]]},"sc9-chemistry-1":{"c":[{"s":"Вещества, которые ток не проводят (сахар, спирт, кислород), называют _____.","a":1,"o":["анионы","неэлектролитами","электролитической диссоциацией","основания"]},{"s":"Распад электролита на ионы при растворении в воде или плавлении называют _____ (С.","a":1,"o":["катионы","электролитической диссоциацией","электролиты","основания"]}],"k":[["Электролиты","Вещества, растворы или расплавы которых проводят электрический ток."]]},"sc9-chemistry-2":{"c":[{"s":"Реакции ионного обмена идут _____, если образуется нерастворимое вещество (осадок), газ или слабый электролит (чаще всего вода).","a":3,"o":["полное ионное","молекулярное","сокращённое ионное","до конца"]}],"k":[["Молекулярное","Обычная запись формул."],["Полное ионное","Сильные растворимые электролиты записывают в виде ионов, а осадки, газы, воду и слабые электролиты оставляют молекулами."],["Сокращённое ионное","Из полного убирают одинаковые ионы в обеих частях («ионы-наблюдатели»)."]]},"sc9-chemistry-3":{"c":[],"k":[["Степень окисления","Условный заряд атома в соединении, если считать все связи ионными."],["Окисление","Отдача электронов, степень окисления повышается."],["Восстановление","Присоединение электронов, степень окисления понижается."]]},"sc9-chemistry-4":{"c":[],"k":[["Галогены","F, Cl, Br, I; в молекулах по два атома"]]},"sc9-chemistry-5":{"c":[],"k":[["O₂ и O₃","аллотропные модификации кислорода"],["H₂S","ядовитый газ с запахом тухлых яиц"]]},"sc9-chemistry-6":{"c":[],"k":[["HNO₃","сильный окислитель"],["Фосфор","белый и красный — аллотропные модификации"]]},"sc9-chemistry-7":{"c":[],"k":[["Алмаз и графит","аллотропные модификации углерода"],["CO","ядовитый угарный газ, CO₂ — углекислый"],["SiO₂","оксид кремния, основа песка"]]},"sc9-chemistry-8":{"c":[{"s":"Химическая активность металлов описывается _____: Li, K, Ba, Ca, Na, Mg, Al, Zn, Fe, Ni, Sn, Pb, (H), Cu, Hg, Ag, Pt, Au.","a":1,"o":["сталь","рядом активности","амфотерны","коррозия"]}],"k":[["Металлы","восстановители, отдают электроны"]]},"sc9-chemistry-9":{"c":[{"s":"Его оксид и гидроксид _____: реагируют и с кислотами, и со щелочами.","a":0,"o":["амфотерны","сталь","рядом активности","коррозия"]}],"k":[["CaO","негашёная известь"]]},"sc9-chemistry-10":{"c":[],"k":[["Коррозия","Самопроизвольное разрушение металлов под действием окружающей среды."],["Протектор","более активный металл"]]},"sc9-chemistry-11":{"c":[{"s":"Простейшие органические вещества — _____.","a":1,"o":["кислотным дождям","углеводороды","органические вещества"]}],"k":[["Органические вещества","Соединения углерода (кроме простейших: CO, CO₂, карбонатов, угольной кислоты и некоторых других)."],["C₂H₅OH","спирт, CH₃COOH — кислота"]]}};

var DR=window.DRILL||{};
function drill(r,d,title){
  var tab=d.c.length?'c':'k';
  function head(){var h='<div class="lrow">';if(d.c.length)h+='<button class="lb'+(tab==='c'?' on':'')+'" data-t="c">Пропуски</button>';if(d.k.length)h+='<button class="lb'+(tab==='k'?' on':'')+'" data-t="k">Карточки</button>';return h+'</div>'}
  function bind(){r.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){tab=b.dataset.t;tab==='c'?cl():kd()}})}
  var i,sc,ki=0,fl=0;
  function cl(){i=0;sc=0;q()}
  function q(){
    if(i>=d.c.length){r.innerHTML=head()+'<div class="lbig">Готово: '+sc+' из '+d.c.length+'</div><button class="lb" id="a">Ещё раз</button>';bind();r.querySelector('#a').onclick=cl;return}
    var x=d.c[i];
    r.innerHTML=head()+'<p>Выбери слово, которое пропущено.</p><div class="lbig" style="font-weight:400;text-align:left;font-size:1.05rem">'+x.s.replace('_____','<mark id="bl">_____</mark>')+'</div><div class="lrow">'+x.o.map(function(o,k){return '<button class="lb" data-k="'+k+'">'+o+'</button>'}).join('')+'</div><div class="lnote" id="fb"></div>';bind();
    var done=0,first=1;
    r.querySelectorAll('[data-k]').forEach(function(b){b.onclick=function(){if(done)return;
      if(+b.dataset.k===x.a){done=1;if(first)sc++;b.style.background='#16a34a';b.style.color='#fff';r.querySelector('#bl').textContent=x.o[x.a];
        r.querySelector('#fb').innerHTML='Верно! <button class="lb" id="n">Дальше →</button>';r.querySelector('#n').onclick=function(){i++;q()}}
      else{first=0;b.style.background='#dc2626';b.style.color='#fff';b.disabled=true;r.querySelector('#fb').textContent='Не то, попробуй ещё.'}}})
  }
  function kd(){
    var c=d.k[ki];
    r.innerHTML=head()+'<p>Нажми на карточку, чтобы перевернуть. '+(ki+1)+' из '+d.k.length+'</p><button id="cd" class="lchip" style="width:100%;min-height:110px;font-weight:'+(fl?'400':'700')+';text-align:center">'+(fl?c[1]:c[0])+'</button><div class="lrow"><button class="lb" id="pv">← Назад</button><button class="lb" id="nx">Дальше →</button></div>';bind();
    r.querySelector('#cd').onclick=function(){fl=!fl;kd()};
    r.querySelector('#pv').onclick=function(){ki=(ki+d.k.length-1)%d.k.length;fl=0;kd()};
    r.querySelector('#nx').onclick=function(){ki=(ki+1)%d.k.length;fl=0;kd()}
  }
  tab==='c'?cl():kd()
}

var m=document.createElement("div");m.id="lab";m.innerHTML='<div class="lc"><div class="lh"><b></b><button class="lx" aria-label="Закрыть">✕</button></div><div class="lbody"></div></div>';document.body.appendChild(m);
function close(){m.style.display="none"}m.querySelector(".lx").onclick=close;m.onclick=function(e){if(e.target===m)close()};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".vb-lab,.vb-drill");if(!b)return;var r=m.querySelector(".lbody");r.innerHTML="";r.removeAttribute("data-l");if(b.classList.contains("vb-drill")){var L=b.closest(".lesson"),id=L.dataset.lesson;m.querySelector(".lh b").textContent="Тренажёр: "+L.querySelector("h4").textContent;drill(r,DRILLS[id])}else{var mm=/^sc(\d+)-[a-z]+-(\d+)$/.exec(b.closest(".lesson").dataset.lesson),A=LAB[mm[1]+"-"+mm[2]];m.querySelector(".lh b").textContent=A.t;A.f(r)}m.style.display="flex"});
})();