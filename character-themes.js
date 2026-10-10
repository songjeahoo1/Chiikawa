const characterGrades={
 chiikawa:{grade:'SSS',label:'레전드 먼작귀'},usagi:{grade:'SSS',label:'레전드 먼작귀'},hachiwari:{grade:'SSS',label:'레전드 먼작귀'},
 rakko:{grade:'SS',label:'인기쟁이'},shisa:{grade:'SS',label:'인기쟁이'},
 kurimanju:{grade:'S',label:'일잘러'},anoko:{grade:'S',label:'일잘러'},
 pouch:{grade:'A',label:'유능한 친구'},kani:{grade:'A',label:'유능한 친구'},
 ramenArmor:{grade:'B',label:'평범한 하루'},laborArmor:{grade:'B',label:'평범한 하루'},
 momonga:{grade:'C',label:'수상한 친구'},dekatsuyo:{grade:'C',label:'수상한 친구'}
};
for(const c of chars){const g=characterGrades[c.id];if(g){c.grade=g.grade;c.gradeLabel=g.label}}
const gradeDescriptions=[['SSS','레전드 먼작귀','세계관급 존재감, 압도적인 개성'],['SS','인기쟁이','매력과 존재감이 확실한 캐릭터'],['S','일잘러','믿음직하고 호감 가는 캐릭터'],['A','유능한 친구','개성도 있고 매력도 있는 캐릭터'],['B','평범한 하루','친근하고 일상적인 매력'],['C','수상한 친구','어딘가 이상하지만 미워할 수 없는 존재']];
const themePalettes={
 chiikawa:{paper:'#fff3f5',ink:'#603f49',pink:'#e89aad',blue:'#f2c7d1',yellow:'#ffdfb3'},hachiwari:{paper:'#eff8ff',ink:'#354e60',pink:'#92c7e7',blue:'#a9d7ef',yellow:'#ffe6a7'},usagi:{paper:'#fffbe9',ink:'#564b2d',pink:'#f2c765',blue:'#b7dcb9',yellow:'#ffe078'},momonga:{paper:'#f7f0ff',ink:'#4e3d59',pink:'#d39adf',blue:'#c5b4ee',yellow:'#f8d8c0'},kurimanju:{paper:'#f7efe7',ink:'#514137',pink:'#c7956b',blue:'#d8c5b4',yellow:'#ead6a0'},rakko:{paper:'#edf8f4',ink:'#354d49',pink:'#9ecbb8',blue:'#9bd9d0',yellow:'#f1d48d'},shisa:{paper:'#fff4e9',ink:'#62453b',pink:'#e9a17d',blue:'#a7d7c5',yellow:'#f3ce79'},anoko:{paper:'#f3f1fa',ink:'#454258',pink:'#b6aacd',blue:'#aebfd7',yellow:'#e5d5a1'},pouch:{paper:'#fff0ef',ink:'#5f3d3a',pink:'#eb9c98',blue:'#d7b0b9',yellow:'#f7d09a'},kani:{paper:'#eff9f8',ink:'#38514f',pink:'#eaa8b5',blue:'#93d2cf',yellow:'#f1dda4'},laborArmor:{paper:'#eff2f5',ink:'#3f4850',pink:'#9cabb9',blue:'#a9c0cf',yellow:'#e0ce9b'},ramenArmor:{paper:'#fff8e8',ink:'#59492c',pink:'#e0b943',blue:'#c6d6b4',yellow:'#f4d366'},dekatsuyo:{paper:'#f7f0cb',ink:'#433b20',pink:'#d9be55',blue:'#b2c17a',yellow:'#f0d869'}
};
const tierMap={SSS:'grade-sss',SS:'grade-ss',S:'grade-s',A:'grade-a',B:'grade-b',C:'grade-c'};
const baseApplyTheme=applyTheme;
function themeImage(id){return id==='dekatsuyo'?dekatsuyoImage:characterImages[id]||''}
function paintFloatingCharacter(id){let layer=document.querySelector('#theme-floats');if(!layer){layer=document.createElement('div');layer.id='theme-floats';layer.className='theme-floats';layer.setAttribute('aria-hidden','true');document.body.prepend(layer)}const src=themeImage(id);if(!src){layer.innerHTML='';layer.dataset.theme='default';return}layer.dataset.theme=id;layer.innerHTML=`<img class="float-character float-one" src="${src}" alt=""><img class="float-character float-two" src="${src}" alt=""><img class="float-character float-three" src="${src}" alt="">`}
applyTheme=function(id){const g=readGame();if(id!=='default'&&!g.unlocked.includes(id))return;g.theme=id;writeGame(g);const p=themePalettes[id]||themePalettes.chiikawa;for(const [key,val] of Object.entries({paper:id==='default'?'#fff9f0':p.paper,ink:id==='default'?'#514a46':p.ink,pink:id==='default'?'#f5b8c8':p.pink,blue:id==='default'?'#b8ddf2':p.blue,yellow:id==='default'?'#ffe6a7':p.yellow}))document.documentElement.style.setProperty(`--${key}`,val);document.documentElement.dataset.theme=id;paintFloatingCharacter(id)};
function addGradeBadge(el,id){const g=characterGrades[id];if(!g||el.querySelector('.grade-badge'))return;const badge=document.createElement('span');badge.className=`grade-badge ${tierMap[g.grade]}`;badge.textContent=g.grade;badge.title=`${g.grade} · ${g.label}`;el.append(badge)}
const baseRenderMenu=renderMenu;
renderMenu=function(view){baseRenderMenu(view);if(view==='collection'){const root=document.querySelector('#site-menu-content');root.insertAdjacentHTML('afterbegin',`<section class="grade-legend"><h3>캐릭터 등급</h3><div>${gradeDescriptions.map(([g,l,d])=>`<p><b class="grade-badge ${tierMap[g]}">${g}</b><span><strong>${l}</strong><small>${d}</small></span></p>`).join('')}</div></section>`);root.querySelectorAll('[data-character]').forEach(b=>addGradeBadge(b,b.dataset.character))}};
const baseShowCharacter=showCharacter;
showCharacter=function(id){baseShowCharacter(id);const detail=document.querySelector('.character-detail');if(detail){const h=detail.querySelector('h3');if(h){const g=characterGrades[id];if(g)h.insertAdjacentHTML('afterend',`<span class="grade-badge detail-grade ${tierMap[g.grade]}">${g.grade} · ${g.label}</span>`)}}};
const savedTheme=readGame().theme||'default';applyTheme(savedTheme);
