function switchTab(n){['main','duo','hard','vars'].forEach(function(t){var el=document.getElementById('path-'+t);if(el)el.classList.toggle('hidden',t!==n)});document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('active',t.dataset.tab===n)});document.querySelectorAll('.bnav-item').forEach(function(t){var name=t.dataset.tab;if(!name&&t.getAttribute('onclick')){var m=t.getAttribute('onclick').match(/switchTab\('(\w+)'\)/);name=m&&m[1]}if(name)t.classList.toggle('active',name===n)});window.scrollTo({top:0,behavior:'smooth'})}
function setActiveBnav(b){document.querySelectorAll('.bnav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active')}
function toggleUnit(h){h.parentElement.classList.toggle('open')}

