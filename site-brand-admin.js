/* Site identity, local developer account, grade rewards and admin panel. */
(() => {
  'use strict';
  const BRAND = '먼작귀 성격 테스트';
  const ADMIN_ID = 'admin1010';
  const ADMIN_PASSWORD = '10108080';
  const ACCOUNT_KEY = 'chiikawa-local-accounts-v1';
  const REWARD_KEY = 'chiikawa-grade-rewards-v1';
  const grades = {
    chiikawa:'SSS', usagi:'SSS', hachiware:'SSS', rakko:'SS', shisa:'SS',
    kurimanju:'S', anoko:'S', pochetteArmor:'A', kani:'A', ramenArmor:'B',
    laborArmor:'B', momonga:'C', dekatsuyo:'H'
  };
  const rewards = { H:150, SSS:500, SS:70, S:50, A:30, B:20, C:10 };
  const gradeNames = { H:'시크릿 먼작귀', SSS:'레전드 먼작귀', SS:'인기쟁이', S:'일잘러', A:'유능한 친구', B:'평범한 하루', C:'수상한 친구' };
  const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const hashPassword = async (password, salt) => {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:enc.encode(salt), iterations:160000, hash:'SHA-256' }, key, 256);
    return [...new Uint8Array(bits)].map(v=>v.toString(16).padStart(2,'0')).join('');
  };
  async function ensureAdminAccount() {
    const accounts = safeRead(ACCOUNT_KEY, []);
    if (!Array.isArray(accounts)) return;
    const salt = `local-admin-${crypto.getRandomValues(new Uint32Array(2)).join('-')}`;
    const admin = { id:ADMIN_ID, nickname:'개발자', salt, passwordHash:await hashPassword(ADMIN_PASSWORD,salt), iterations:160000, isAdmin:true };
    const existing=accounts.findIndex(a=>a.id===ADMIN_ID);
    if(existing<0) accounts.push(admin); else accounts[existing]={...accounts[existing],...admin};
    const oldAdmin=accounts.find(a=>a.id==='1234'); if(oldAdmin)oldAdmin.isAdmin=false;
    accounts.forEach(a=>{if(!a.userId)a.userId=crypto.randomUUID();});
    safeWrite(ACCOUNT_KEY, accounts);
  }
  const norm = s => (s||'').replace(/\s/g,'').toLowerCase();
  const aliases = {
    chiikawa:['치이카와','chiikawa'], hachiware:['하치와레','hachiware'], usagi:['우사기','usagi'],
    momonga:['모몽가','momonga'], rakko:['랏코','라ッ코','rakko'], shisa:['시사','시사우','shisa'],
    kurimanju:['쿠리만쥬','쿠라만쥬','kurimanju'], anoko:['아노코','anoko'], kani:['카니','kani'],
    pochetteArmor:['포셰트갑옷씨','포셰트의요정','pochettearmor'], ramenArmor:['라멘갑옷씨','라멘의갑옷씨','ramenarmor'],
    laborArmor:['노동갑옷씨','노동의갑옷씨','laborarmor'], dekatsuyo:['데카츠요','dekatsuyo']
  };
  function identify(text) { const t=norm(text); return Object.entries(aliases).find(([,names])=>names.some(n=>t.includes(norm(n))))?.[0] || ''; }
  function svgLogo() { return `<img class="site-brand-logo" src="image/logo.png" alt="" onerror="this.hidden=true">`; }
  function installBrand() {
    document.title = BRAND;
    const meta=document.querySelector('meta[name="apple-mobile-web-app-title"]'); if(meta)meta.content=BRAND;
    if(!document.querySelector('link[data-site-favicon]')) { const l=document.createElement('link'); l.rel='icon'; l.href='image/favicon.ico'; l.dataset.siteFavicon=''; document.head.append(l); }
    const title=document.querySelector('h1');
    title?.querySelectorAll('.site-brand-logo').forEach(img=>img.remove());
    document.querySelectorAll('body *').forEach(el=>{
      if(el.children.length===0 && el.textContent.trim()==='ち' && !el.dataset.logoApplied){el.dataset.logoApplied='1';el.textContent='';el.insertAdjacentHTML('afterbegin',svgLogo());el.classList.add('site-logo-mark');}
    });
  }
  function currentUser() { return window.currentLocalUser || window.localUser || null; }
  function isAdmin() { const u=currentUser(); return !!u && u.id===ADMIN_ID; }
  function ensureUserIds() {
    const users=safeRead(ACCOUNT_KEY,[]); if(!Array.isArray(users))return;
    let changed=false; users.forEach(u=>{if(!u.userId){u.userId=crypto.randomUUID();changed=true;}});
    if(changed)safeWrite(ACCOUNT_KEY,users);
  }
  function toast(message) {
    let el=document.querySelector('.site-notice-toast'); if(!el){ el=document.createElement('div'); el.className='site-notice-toast'; el.setAttribute('role','status'); document.body.append(el); }
    el.textContent=message; el.classList.add('visible'); clearTimeout(el._timer); el._timer=setTimeout(()=>el.classList.remove('visible'),2600);
  }
  function addAdminMenu() {
    const menu=document.querySelector('.site-menu, #site-menu, [data-site-menu]'); if(!menu) return;
    const old=menu.querySelector('[data-admin-entry]');
    if(!isAdmin()){old?.remove();return;}
    if(old)return;
    const item=document.createElement('button'); item.type='button'; item.className='menu-item admin-menu-entry'; item.dataset.adminEntry='';
    item.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5h16v14H4Zm3-3h10M7 12h10M7 8h5"/></svg><span>관리자 패널</span>';
    item.addEventListener('click',()=>{ if(!isAdmin()){toast('관리자 계정으로 로그인해 주세요.');return;} showAdminPanel(); });
    menu.append(item);
  }
  function showAdminPanel() {
    let modal=document.querySelector('.admin-panel-modal'); if(modal){modal.remove();return;}
    modal=document.createElement('div'); modal.className='admin-panel-modal'; modal.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="admin-heading"><button class="admin-close" aria-label="닫기">×</button><p class="eyebrow">LOCAL ADMIN</p><h2 id="admin-heading">관리자 패널</h2><p>현재 브라우저에 저장된 테스트 보상 데이터입니다.</p><div class="admin-stat"><span>계정 수</span><b>${safeRead(ACCOUNT_KEY,[]).length}</b></div><div class="admin-stat"><span>수령 기록</span><b>${Object.keys(safeRead(REWARD_KEY,{})).length}</b></div><button type="button" class="user-json-export">user.json 내보내기</button><p class="admin-note">브라우저 저장 계정을 비밀번호 해시와 함께 내보냅니다. 비밀번호 원문은 저장하지 않습니다.</p></section>`;
    modal.querySelector('.user-json-export').addEventListener('click',()=>{const data=safeRead(ACCOUNT_KEY,[]).map(a=>({userId:a.userId||crypto.randomUUID(),id:a.id,nickname:a.nickname,passwordHash:a.passwordHash,salt:a.salt,iterations:a.iterations,isAdmin:a.id===ADMIN_ID}));const blob=new Blob([JSON.stringify({users:data},null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='user.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.admin-close'))modal.remove();}); document.body.append(modal);
  }
  function rewardOnCollectionClick(e) {
    const card=e.target.closest('.collection-card, .character-card, [data-character], .encyclopedia-card');
    if(!card || card.closest('.theme-list, .theme-grid'))return;
    const name=card.innerText||card.getAttribute('aria-label')||'';
    let id=card.dataset.character||card.dataset.id||''; if(!grades[id])id=identify(name); if(!id)return;
    const locked=/잠김|미획득|locked/i.test(card.innerText||'') || card.classList.contains('locked'); if(locked)return;
    const user=currentUser(); if(!user)return;
    const receipts=safeRead(REWARD_KEY,{}); const key=`${user.id}:${id}`; if(receipts[key])return;
    const grade=grades[id]; if(!grade)return;
    receipts[key]={grade,amount:rewards[grade],at:Date.now()}; safeWrite(REWARD_KEY,receipts);
    const accountKey=`chiikawa-user-game-v1:${user.id}`; let game={};
    try { game=typeof window.readGame==='function' ? (window.readGame()||{}) : safeRead(accountKey, safeRead('chiikawa-site-rewards-v1',{})); } catch { game=safeRead(accountKey,{}); }
    game.gems=(Number(game.gems)||Number(game.jewels)||0)+rewards[grade]; game.jewels=game.gems;
    try { if(typeof window.writeGame==='function') window.writeGame(game); else safeWrite(accountKey,game); } catch { safeWrite(accountKey,game); }
    toast(`${gradeNames[grade]} 도감 보수 ${rewards[grade]} 보석을 받았어요!`);
  }
  function decorateCards() {
    document.querySelectorAll('.collection-card, .character-card, [data-character], .encyclopedia-card').forEach(card=>{
      if(card.dataset.gradeDecorated)return;
      let id=card.dataset.character||card.dataset.id||''; if(!grades[id])id=identify(card.innerText||''); const grade=grades[id]; if(!grade)return;
      card.dataset.gradeDecorated='1'; const badge=document.createElement('span'); badge.className=`character-grade-badge grade-${grade.toLowerCase()}`; badge.textContent=`${grade} · ${gradeNames[grade]} · ${rewards[grade]} 보석`;
      card.append(badge);
    });
  }
  function init() {
    ensureAdminAccount(); ensureUserIds(); installBrand(); addAdminMenu(); decorateCards();
    document.addEventListener('submit', async event=>{
      const form=event.target; if(!(form instanceof HTMLFormElement))return;
      const passwordFields=[...form.querySelectorAll('input[type="password"]')]; if(passwordFields.length!==1)return;
      const idField=form.querySelector('input[name*="id" i], input[autocomplete="username"], input:not([type="password"]):not([type="checkbox"])');
      if(idField?.value?.trim()!==ADMIN_ID || passwordFields[0].value!==ADMIN_PASSWORD)return;
      if(form.dataset.adminSeedRetry==='ready'){delete form.dataset.adminSeedRetry;return;}
      event.preventDefault(); event.stopImmediatePropagation();
      try { await ensureAdminAccount(); ensureUserIds(); form.dataset.adminSeedRetry='ready'; form.requestSubmit(); }
      catch { toast('개발자 계정 준비에 실패했어요. localhost에서 다시 열어 주세요.'); }
    },true);
    document.addEventListener('click',rewardOnCollectionClick);
    new MutationObserver(()=>{installBrand();addAdminMenu();decorateCards();}).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('storage',()=>{addAdminMenu();decorateCards();});
    window.setInterval(ensureUserIds,1500);
    document.addEventListener('auth:changed',()=>{addAdminMenu();decorateCards();});
    window.siteGradeRewards={grades,rewards,gradeNames};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
