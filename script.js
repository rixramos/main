// ═══════════════════════════════════════════════════════════════════
// GALAXY BACKGROUND
// ═══════════════════════════════════════════════════════════════════
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.ox = s.x = Math.random()*W; s.oy = s.y = Math.random()*H; }); });
  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  const STAR_COUNT = 280;
  const stars = Array.from({ length: STAR_COUNT }, () => {
    const x = Math.random()*window.innerWidth, y = Math.random()*window.innerHeight;
    return { ox:x,oy:y,x,y,vx:0,vy:0,r:Math.random()*1.7+0.3,alpha:Math.random()*0.6+0.3,twinkleSpeed:Math.random()*0.9+0.3,twinkleOffset:Math.random()*Math.PI*2,hue:110+Math.random()*20,mass:Math.random()*0.4+0.6 };
  });
 const NEBULAS=[
  {cx:.18,cy:.28,rx:.32,ry:.22,color:'0,255,65',alpha:.06},
  {cx:.76,cy:.65,rx:.28,ry:.20,color:'0,255,65',alpha:.05},
  {cx:.50,cy:.50,rx:.42,ry:.30,color:'0,255,65',alpha:.03},
  {cx:.86,cy:.18,rx:.20,ry:.16,color:'0,255,65',alpha:.04},
  {cx:.12,cy:.76,rx:.22,ry:.18,color:'0,255,65',alpha:.035}
];
 const ORBS=[
  {cx:.20,cy:.35,r:95,color:'0,255,65',alpha:.08},
  {cx:.80,cy:.62,r:75,color:'0,255,65',alpha:.1},
  {cx:.50,cy:.18,r:60,color:'0,255,65',alpha:.07}
];
  const shooters=[];
  function spawnShooter(){shooters.push({x:Math.random()*.65,y:Math.random()*.45,len:90+Math.random()*130,speed:.0016+Math.random()*.002,progress:0,alpha:.65+Math.random()*.35,angle:Math.PI/5+(Math.random()-.5)*.3});}
  setInterval(()=>{if(shooters.length<3)spawnShooter();},3000); spawnShooter();
  const REPEL_RADIUS=120,REPEL_FORCE=6.5,FRICTION=.88,RETURN_FORCE=.045; let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=.005;
    const bg=ctx.createLinearGradient(0,0,W*.5,H);
    bg.addColorStop(0,'#07070a'); bg.addColorStop(.5,'#080810'); bg.addColorStop(1,'#07070a');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    NEBULAS.forEach(n=>{
      const g=ctx.createRadialGradient(n.cx*W,n.cy*H,0,n.cx*W,n.cy*H,Math.max(n.rx*W,n.ry*H));
      g.addColorStop(0,`rgba(${n.color},${n.alpha})`); g.addColorStop(.5,`rgba(${n.color},${n.alpha*.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.scale(1,n.ry/n.rx); ctx.beginPath(); ctx.arc(n.cx*W,(n.cy*H)*(n.rx/n.ry),n.rx*W,0,Math.PI*2); ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });
    ORBS.forEach(o=>{
      const g=ctx.createRadialGradient(o.cx*W,o.cy*H,0,o.cx*W,o.cy*H,o.r);
      g.addColorStop(0,`rgba(${o.color},${o.alpha})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(o.cx*W,o.cy*H,o.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    });
    stars.forEach(s=>{
      const dx=mouseX-s.x,dy=mouseY-s.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<REPEL_RADIUS&&d>0){const f=(1-d/REPEL_RADIUS)*REPEL_FORCE;s.vx-=(dx/d)*f;s.vy-=(dy/d)*f;}
      s.vx+=(s.ox-s.x)*RETURN_FORCE; s.vy+=(s.oy-s.y)*RETURN_FORCE;
      s.vx*=FRICTION; s.vy*=FRICTION; s.x+=s.vx; s.y+=s.vy;
      const tw=Math.sin(t*s.twinkleSpeed+s.twinkleOffset)*.5+.5;
      const a=s.alpha*(0.6+tw*0.4);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${s.hue},80%,85%,${a})`; ctx.fill();
    });
    for(let i=shooters.length-1;i>=0;i--){
      const sh=shooters[i]; sh.progress+=sh.speed;
      const sx=sh.x*W+Math.cos(sh.angle)*sh.progress*W*1.5,sy=sh.y*H+Math.sin(sh.angle)*sh.progress*H*1.5;
      const ex=sx-Math.cos(sh.angle)*sh.len,ey=sy-Math.sin(sh.angle)*sh.len;
      const g=ctx.createLinearGradient(ex,ey,sx,sy);
      g.addColorStop(0,'rgba(0,255,65,0)'); g.addColorStop(1,`rgba(0,255,65,${sh.alpha*(1-sh.progress)})`);
      ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(sx,sy);
      ctx.strokeStyle=g; ctx.lineWidth=1.2; ctx.stroke();
      if(sh.progress>1)shooters.splice(i,1);
    }
  }
  draw();
})();

// ═══════════════════════════════════════════════════════════════════
// CINEMATIC VIDEO LOADER
// ═══════════════════════════════════════════════════════════════════
function initVideoLoader() {
  const loader   = document.getElementById('loader');
  const video    = document.getElementById('ld-video');
  const text1    = document.getElementById('ldText1');   // "ENTERING THE UNIVERSE..."
  const text2    = document.getElementById('ldText2');   // "WELCOME TO MY UNIVERSE"
  const boot1    = document.getElementById('ldBoot1');
  const boot2    = document.getElementById('ldBoot2');
  const boot3    = document.getElementById('ldBoot3');
  const boot4    = document.getElementById('ldBoot4');

  if (!loader || !video) return;

  // Play video — muted first (browser requires it), unmute on first interaction
  if (video) {
    video.muted = true;
    video.loop = true;
    video.play().catch(function() {});
    // Unmute as soon as user touches anything
    var unmute = function() {
      video.muted = false;
      video.volume = 1.0;
      document.removeEventListener('click', unmute);
      document.removeEventListener('keydown', unmute);
    };
    document.addEventListener('click', unmute);
    document.addEventListener('keydown', unmute);
  }
  startLoaderTimers();

  // All timers start AFTER user clicks enter (so they're in sync with video)
  function startLoaderTimers() {
    var bl = [boot1, boot2, boot3, boot4];
    [0, 200, 400, 650].forEach(function(d, i) {
      if (!bl[i]) return;
      setTimeout(function() { bl[i].classList.add('ld-boot-visible'); }, d);
    });
    setTimeout(function() { if (text2) text2.classList.add('ld-visible'); }, 900);
    setTimeout(launch, 2000);

    // Progress bar — grows in steps matching boot lines + launch
    var bar = document.getElementById('ld-progress-bar');
    if (bar) {
      bar.style.width = '0%';
      setTimeout(function(){ bar.style.transition='width 0.4s ease'; bar.style.width='20%'; }, 0);
      setTimeout(function(){ bar.style.width='40%'; }, 200);
      setTimeout(function(){ bar.style.width='60%'; }, 400);
      setTimeout(function(){ bar.style.width='75%'; }, 650);
      setTimeout(function(){ bar.style.transition='width 0.6s ease'; bar.style.width='88%'; }, 900);
    }
  }

}

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const TECH_LINKS={
  'Next.js':'https://nextjs.org','SQL Server':'https://www.microsoft.com/sql-server','React':'https://react.dev',' CSS':'https://developer.mozilla.org/en-US/docs/Web/CSS','Framer Motion':'https://www.framer.com/motion/','Lucide React':'https://lucide.dev/','TBD':null
};

const PROJECTS=[
  {name:'Portfolio',category:'Front-End',desc:'This portfolio — a cinematic React-powered site with custom GLSL shader, animated star field and smooth scroll interactions — built with pure HTML and CSS.',stack:['HTML','CSS','JavaScript'],demo:'#',github:'#',screenshot:'images/portfolio.png'},
  {name:'Private Project',category:'Front-End',desc:'In Development',stack:['HTML','CSS','JavaScript'],demo:'#',github:'#',screenshot:'images/proj1.png'},
  {name:'Private Project',category:'Front-End',desc:'In Development',stack:['HTML','CSS','JavaScript'],demo:'#',github:'',screenshot:'images/proj2.png'},
  {name:'Private Project',category:'Front-End',desc:'In Development',stack:['HTML','CSS','JavaScript'],demo:'#',github:'',screenshot:'images/proj3.png'},
  {name:'Private Project',category:'Front-End',desc:'In Development',stack:['HTML','CSS','JavaScript'],demo:'#',github:'',screenshot:'images/proj4.png'},
  
];

// ═══════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const curEl=document.getElementById('cur'), curDot=document.getElementById('curDot');
let mx=0,my=0,tx=0,ty=0,cursorVisible=false;
if(!isTouchDevice){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    curDot.style.left=mx+'px'; curDot.style.top=my+'px';
    if(!cursorVisible){cursorVisible=true;curEl.classList.add('visible');curDot.classList.add('visible');}
  });
  (function animCursor(){tx+=(mx-tx)*.12;ty+=(my-ty)*.12;curEl.style.left=tx+'px';curEl.style.top=ty+'px';requestAnimationFrame(animCursor);})();
}
function bindHover(){
  if(isTouchDevice) return;
  document.querySelectorAll('a,button,.nav-email,.hr-skill,.proj-card,.pd-btn,.icon-back-btn,.pd-back,.social-item,.cv-side,.pd-stack-tag,.ab-contact-email,.ab-contact-social,.proj-h-screenshot,.proj-see-all-btn,.proj-h-btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>curEl.classList.add('hover'));
    el.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));
  });
}

// ═══════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════
const rixLogo=document.getElementById('rixLogo'); let smHovered=false;
function buildLetters(text,visible){
  rixLogo.innerHTML=''; [...text].forEach((ch,i)=>{
    const s=document.createElement('span'); s.className='logo-letter'+(visible?' vis':'');
    s.textContent=ch===' '?'\u00A0':ch; s.style.transitionDelay=visible?(i*40)+'ms':'0ms'; rixLogo.appendChild(s);
  });
}
rixLogo.addEventListener('mouseenter',()=>{smHovered=true;buildLetters('John Rick Ramos',false);requestAnimationFrame(()=>requestAnimationFrame(()=>{rixLogo.querySelectorAll('.logo-letter').forEach(l=>l.classList.add('vis'));}));});
rixLogo.addEventListener('mouseleave',()=>{smHovered=false;rixLogo.querySelectorAll('.logo-letter').forEach(l=>{l.style.transitionDelay='0ms';l.classList.remove('vis');});setTimeout(()=>{if(!smHovered)buildLetters('RiX',true);},200);});

// ═══════════════════════════════════════════════════════════════════
// LAUNCH — reveal portfolio after loader
// ═══════════════════════════════════════════════════════════════════
function launch() {
  const loader = document.getElementById('loader');
  const app    = document.getElementById('app');
  const vid    = document.getElementById('ld-video');
  if (!loader) return;

  if (vid) { vid.pause(); vid.src = ''; }
  // Complete progress bar to 100%
  const bar = document.getElementById('ld-progress-bar');
  if (bar) { bar.style.transition = 'width 0.4s ease'; bar.style.width = '100%'; }

  // Fade loader out
  setTimeout(() => {
    loader.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1)';
    loader.style.opacity = '0';
  }, 300);

  setTimeout(() => {
    loader.style.display = 'none';
    if (app) { app.style.display = 'block'; app.style.opacity = '0'; }
    initCardThumbs(); buildProjectCards(); initScrollSystem();
    initScrollReveal(); initGlobe(); buildQuote(); bindHover(); initCareerLine();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (app) { app.style.transition = 'opacity 0.7s ease'; app.style.opacity = '1'; }
    }));
  }, 1150);
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function copyEmail(){navigator.clipboard.writeText('johnrick.ramos999@gmail.com').then(()=>{const b=document.getElementById('emailBtn');b.classList.add('copied');setTimeout(()=>b.classList.remove('copied'),2000);});}
function downloadCV(e){
  if(e)e.preventDefault();
  window.open('John Rick Ramos Resume.pdf', '_blank');
}
window.copyAbEmail=function(e){
  e.preventDefault();
  navigator.clipboard.writeText('johnrick.ramos999@gmail.com').then(()=>{
    const c=document.getElementById('abEmailCopied'); if(!c)return;
    c.classList.add('show'); setTimeout(()=>c.classList.remove('show'),2000);
  }).catch(()=>{});
};

// ═══════════════════════════════════════════════════════════════════
// QUOTE
// ═══════════════════════════════════════════════════════════════════
const FULL_QUOTE="I’m a results-driven Technical Support Representative who enjoys solving problems and helping users navigate technology with ease. My background includes troubleshooting technical issues, handling customer support, and working in high-volume environments where clear communication and efficiency matter. Outside of work, I’m passionate about building my own websites as a hobby, where I explore UI and UX design and bring creative ideas to life. I enjoy editing photos and experimenting with visual styles, always aiming to create clean, engaging, and user-friendly designs. I’m also constantly exploring new technologies, especially AI, to push my creativity further and develop more unique and modern digital experiences. For me, it’s not just about fixing problems, but about continuously learning, improving, and creating things that make a real impact.";
function buildQuote(){
  const el=document.getElementById('abQuoteText');
  if(!el||el.dataset.built)return; el.dataset.built='1'; el.textContent=FULL_QUOTE;
}

// ═══════════════════════════════════════════════════════════════════
// BUILD HORIZONTAL PROJECT CARDS
// ═══════════════════════════════════════════════════════════════════
function buildProjectCards(){
  const track=document.getElementById('projHscrollTrack'); if(!track)return;
  track.innerHTML='';
  PROJECTS.forEach((p,i)=>{
    const card=document.createElement('div'); card.className='proj-h-card';
    const tags=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
	const demoBtn = document.getElementById('pd-demo');
	const githubBtn = document.getElementById('pd-github');
    const demoDisabled = !p.demo || p.demo === '#';
	const githubDisabled = !p.github || p.github === '#';
	if (demoDisabled) {
  demoBtn.href = '#';
  demoBtn.onclick = () => false;
  demoBtn.classList.add('disabled');
  demoBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    Coming Soon
  `;
} else {
  demoBtn.href = p.demo;
  demoBtn.onclick = null;
  demoBtn.classList.remove('disabled');
  demoBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    Live Demo
  `;
}
if (githubDisabled) {
  githubBtn.href = '#';
  githubBtn.onclick = () => false;
  githubBtn.classList.add('disabled');
  githubBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6 2 12"/></svg>
    Private
  `;
} else {
  githubBtn.href = p.github;
  githubBtn.onclick = null;
  githubBtn.classList.remove('disabled');
  githubBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12"/></svg>
    GitHub
  `;
}
    card.innerHTML=`
      <div class="proj-h-num">${String(i+1).padStart(2,'0')}</div>
      <div class="proj-h-top">
        <div class="proj-h-category">${p.category}</div>
        <div class="proj-h-name">${p.nameStyle||(()=>{const w=p.name.split(' ');return w.length>1?w[0]+' <span style="color:var(--blue)">'+w.slice(1).join(' ')+'</span>':p.name;})()} </div>
      </div>
      <div class="proj-h-tools-label">Tools and features</div>
      <div class="proj-h-tags">${tags}</div>
      <div class="proj-h-screenshot" data-idx="${i}">
        <img src="${p.screenshot}" alt="${p.name}" onload="this.classList.add('loaded')" onerror="this.style.display='none'">
        <div class="proj-h-corner tl"></div><div class="proj-h-corner tr"></div>
        <div class="proj-h-corner bl"></div><div class="proj-h-corner br"></div>
      </div>
      <div class="proj-h-actions">
        <a class="proj-h-btn proj-h-btn-primary" href="${p.demo}" ${!demoDisabled?'target="_blank" rel="noopener"':''} ${demoDisabled?'onclick="return false;" style="opacity:.4;pointer-events:none;"':''}>
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo
        </a>
        <a class="proj-h-btn proj-h-btn-outline"
   href="${p.github}"
   ${!githubDisabled ? 'target="_blank" rel="noopener"' : ''}
   ${githubDisabled ? 'onclick="return false;" style="opacity:.4;pointer-events:none;"' : ''}>
          <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>GitHub
        </a>
      </div>
    `;
	
    const ss=card.querySelector('.proj-h-screenshot');
    ss.style.cursor='zoom-in';
    ss.onclick=()=>window.openScreenshot&&window.openScreenshot(p.screenshot);
    track.appendChild(card);
  });
  initHorizontalScroll();
  bindHover();
}

// ═══════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL
// ═══════════════════════════════════════════════════════════════════
function initHorizontalScroll(){
  const wrapper=document.getElementById('projHscrollWrapper');
  const track=document.getElementById('projHscrollTrack');
  if(!wrapper||!track)return;
  let hPos=0;
  function getMax(){ return Math.max(0,track.scrollWidth-wrapper.clientWidth); }
  wrapper.addEventListener('wheel',e=>{
    const max=getMax(); if(max<=0)return;
    if((e.deltaY>0&&hPos<max)||(e.deltaY<0&&hPos>0)){
      e.preventDefault(); hPos=Math.max(0,Math.min(max,hPos+e.deltaY*1.5));
      track.style.transform=`translateX(-${hPos}px)`;
    }
  },{passive:false});
  let tStartX=0,tStartH=0;
  wrapper.addEventListener('touchstart',e=>{tStartX=e.touches[0].clientX;tStartH=hPos;},{passive:true});
  wrapper.addEventListener('touchmove',e=>{
    const dx=tStartX-e.touches[0].clientX;
    hPos=Math.max(0,Math.min(getMax(),tStartH+dx));
    track.style.transform=`translateX(-${hPos}px)`;
  },{passive:true});
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL SYSTEM — progress bar + active nav
// ═══════════════════════════════════════════════════════════════════
// FIXED: About Me + Tech Stack + Strengths → navAbout
const SECTION_NAV_MAP = {
  'section-home':     'navHome',
  'section-whatido':  'navAbout',
  'section-about':    'navAbout',
  'section-career':   'navAbout',
  'section-techstack':'navAbout',
  'section-strengths':'navAbout',
  'section-projects': 'navProjects',
  'section-contact':  'navContact',
};

function initScrollSystem(){
  const sc=document.getElementById('scroll-container');
  const pt=document.getElementById('progress-top');
  if(!sc)return;

  sc.addEventListener('scroll',()=>{
    // Progress bar
    const max=sc.scrollHeight-sc.clientHeight;
    const pct=max>0?(sc.scrollTop/max*100):0;
    if(pt)pt.style.setProperty('--progress',pct+'%');

    // Active nav — find which section is most in view
    const scrollMid=sc.scrollTop+sc.clientHeight*0.4;
    let activeSection=null;
    Object.keys(SECTION_NAV_MAP).forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      if(el.offsetTop<=scrollMid) activeSection=id;
    });
    const activeNav=activeSection?SECTION_NAV_MAP[activeSection]:null;
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    if(activeNav){ const el=document.getElementById(activeNav); if(el)el.classList.add('active'); }
  },{passive:true});

  document.getElementById('navHome')?.classList.add('active');
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL TO SECTION — FIXED: now truly smooth
// ═══════════════════════════════════════════════════════════════════
function scrollToSection(name){
  const sc=document.getElementById('scroll-container');
  const map={
    home:'section-home',
    about:'section-whatido',
    techstack:'section-techstack',
    projects:'section-projects',
    contact:'section-contact'
  };
  const id=map[name]||('section-'+name);
  const el=document.getElementById(id);
  if(!el||!sc)return;

  const targetScrollTop = el.offsetTop;
  const startScrollTop = sc.scrollTop;
  const distance = targetScrollTop - startScrollTop;
  const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    sc.scrollTop = startScrollTop + distance * ease;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════════════════════════
// BIDIRECTIONAL SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════════
function initScrollReveal(){
  const sc=document.getElementById('scroll-container');
  const sections = [...document.querySelectorAll('.scroll-section:not(.section-home)')];
  const innerEls = [...document.querySelectorAll('.ab-big-title,.ab-quote-wrap,.ab-globe-wrap,.ab-strength-card,.wid-cards-anim')];

  // Track section visibility state
  const sectionStates = new Map(); // id -> 'above' | 'visible' | 'below'
  sections.forEach(el => sectionStates.set(el.id, 'below'));

  function updateSections() {
    const viewTop = sc.scrollTop;
    const viewBottom = viewTop + sc.clientHeight;
    const threshold = sc.clientHeight * 0.15;

    sections.forEach(el => {
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const prevState = sectionStates.get(el.id);

      // Determine new state
      let newState;
      if (elBottom < viewTop + threshold) {
        newState = 'above';
      } else if (elTop > viewBottom - threshold) {
        newState = 'below';
      } else {
        newState = 'visible';
      }

      if (newState === prevState) return;
      sectionStates.set(el.id, newState);

      // Remove all state classes first
      el.classList.remove('section-visible', 'section-exit-up', 'section-exit-down');

      if (newState === 'visible') {
        // Small delay so transition fires
        requestAnimationFrame(() => el.classList.add('section-visible'));
      } else if (newState === 'above') {
        // Was visible, now scrolled past upward — exit up
        el.classList.add('section-exit-up');
      } else if (newState === 'below') {
        // Was visible or above, now scrolled down past — reset to below
        el.classList.add('section-exit-down');
      }
    });
  }

  // Inner element intersection observer (bidirectional)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const el = e.target;
      if (e.isIntersecting) {
        // Entering view
        if (el.classList.contains('ab-strength-card')) {
          const cards = [...document.querySelectorAll('.ab-strength-card')];
          const delay = cards.indexOf(el) * 110;
          setTimeout(() => {
            el.classList.remove('ab-exit');
            el.classList.add('ab-visible');
          }, delay);
        } else {
          el.classList.remove('ab-exit');
          requestAnimationFrame(() => el.classList.add('ab-visible'));
        }
      } else {
        // Leaving view — reset for re-animation
        el.classList.remove('ab-visible');
        el.classList.add('ab-exit');
        // After exit transition, fully reset
        setTimeout(() => {
          el.classList.remove('ab-exit');
        }, 500);
      }
    });
  }, { root: sc, threshold: 0.1 });

  innerEls.forEach(el => io.observe(el));

  // Listen to scroll for section bidirectional
  sc.addEventListener('scroll', updateSections, { passive: true });
  // Initial check
  setTimeout(updateSections, 100);
}

// ═══════════════════════════════════════════════════════════════════
// FULL PROJECTS OVERLAY
// ═══════════════════════════════════════════════════════════════════
function openProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.style.display='flex'; requestAnimationFrame(()=>o.classList.add('visible'));
  document.getElementById('proj-detail-view').style.display='none';
  document.getElementById('proj-grid-view').style.display='flex';
  initCardThumbs();
}
function closeProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.classList.remove('visible'); setTimeout(()=>o.style.display='none',400);
window.closeProjectsFull=closeProjectsFull;
}
function initCardThumbs(){
  PROJECTS.forEach((p,i)=>{
    if(!p.screenshot)return;
    const img=document.getElementById('pc-ti-'+i);
    const fb=document.getElementById('pc-fb-'+i); if(!img)return;
    img.className='pc-thumb-img'; img.src=p.screenshot;
    img.onload=()=>{img.classList.add('loaded');if(fb)fb.style.display='none';};
    img.onerror=()=>{img.style.display='none';};
  });
}

function openDetail(i){
  const p=PROJECTS[i];
  document.getElementById('pd-crumb-name').textContent=p.name;
  document.getElementById('pd-index').textContent='PROJECT '+String(i+1).padStart(2,'0');
  const parts=p.name.split(' ');
  document.getElementById('pd-name').innerHTML=p.nameStyle||(()=>{const w=p.name.split(' ');return w.length>1?w[0]+' <span style="color:var(--blue)">'+w.slice(1).join(' ')+'</span>':p.name;})();
  document.getElementById('pd-desc').textContent=p.desc;
  document.getElementById('pd-stack').innerHTML=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
  document.getElementById('pd-demo').href=p.demo;
  document.getElementById('pd-github').href=p.github;
  const imgEl=document.getElementById('pd-screenshot-img'),ph=document.getElementById('pd-shot-placeholder');
  if(p.screenshot){imgEl.style.display='block';imgEl.classList.remove('loaded');imgEl.src=p.screenshot;imgEl.onload=()=>imgEl.classList.add('loaded');ph.style.display='none';imgEl.style.cursor='zoom-in';imgEl.onclick=()=>window.openScreenshot&&window.openScreenshot(p.screenshot);}
  else{imgEl.style.display='none';imgEl.src='';ph.style.display='flex';imgEl.onclick=null;}
  document.getElementById('proj-grid-view').style.display='none';
  const dv=document.getElementById('proj-detail-view');
  dv.style.display='flex'; dv.classList.remove('animating'); void dv.offsetWidth; dv.classList.add('animating');
  setTimeout(()=>dv.classList.remove('animating'),800); bindHover();
}
function closeDetail(){document.getElementById('proj-detail-view').style.display='none';document.getElementById('proj-grid-view').style.display='flex';}

// ═══════════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════════
window.openScreenshot=function(src){
  if(!src)return;
  let lb=document.getElementById('screenshotLightbox');
  if(!lb){
    lb=document.createElement('div'); lb.id='screenshotLightbox';
    lb.innerHTML=`<div class="slb-bg"></div><div class="slb-inner"><img id="slbImg" src=""><button class="slb-close" onclick="closeScreenshot()">&#10005;</button></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.slb-bg').addEventListener('click',closeScreenshot);
    if(!isTouchDevice){const cl=lb.querySelector('.slb-close');cl.addEventListener('mouseenter',()=>curEl.classList.add('hover'));cl.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));}
  }
  document.getElementById('slbImg').src=src;
  lb.classList.add('slb-open'); document.body.style.overflow='hidden';
};
window.closeScreenshot=function(){
  const lb=document.getElementById('screenshotLightbox'); if(lb)lb.classList.remove('slb-open');
  document.body.style.overflow='';
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeScreenshot();});

// ═══════════════════════════════════════════════════════════════════
// GLOBE — 3D tech stack (unchanged)
// ═══════════════════════════════════════════════════════════════════

const SKILLS = [
  { name:'C++', url:'https://isocpp.org',
    svg:`<svg viewBox="0 0 24 24"><path fill="#33ff33" d="M12.207 16.278C11.1241 17.343 9.63879 18 8 18C4.68629 18 2 15.3137 2 12C2 8.68629 4.68629 6 8 6C9.67492 6 11.1896 6.6863 12.278 7.79303L13.6923 6.37878C12.2418 4.91014 10.2272 4 8 4C3.58172 4 0 7.58172 0 12C0 16.4183 3.58172 20 8 20C10.1911 20 12.1764 19.1192 13.6212 17.6923L12.207 16.278Z"/><path fill="#33ff33" d="M15 9H13V11H11V13H13V15H15V13H17V11H15V9Z"/><path fill="#33ff33" d="M20 9H22V11H24V13H22V15H20V13H18V11H20V9Z"/></svg>` },

  { name:'HTML', url:'https://developer.mozilla.org/en-US/docs/Web/HTML',
    svg:`<svg viewBox="0 0 512 512"><path fill="#33ff33" d="M378.413,0H208.297h-13.182L185.8,9.314L57.02,138.102l-9.314,9.314v13.176v265.514c0,47.36,38.528,85.895,85.896,85.895h244.811c47.353,0,85.881-38.535,85.881-85.895V85.896C464.294,38.528,425.766,0,378.413,0z M432.497,426.105c0,29.877-24.214,54.091-54.084,54.091H133.602c-29.884,0-54.098-24.214-54.098-54.091V160.591h83.716c24.885,0,45.077-20.178,45.077-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.092V426.105zM163.164,253.19c-5.097,0-8.867,3.652-8.867,9.482v23.453c0,0.489-0.251,0.734-0.726,0.734h-26.993c-0.475,0-0.726-0.245-0.726-0.734v-23.453c0-5.831-3.771-9.482-8.868-9.482c-5.222,0-8.993,3.652-8.993,9.482v65.144c0,5.83,3.645,9.475,8.868,9.475c5.111,0,8.993-3.645,8.993-9.475v-24.305c0-0.489,0.251-0.734,0.726-0.734h26.993c0.475,0,0.726,0.244,0.726,0.734v24.305c0,5.83,3.77,9.475,8.867,9.475c5.223,0,8.993-3.645,8.993-9.475v-65.144C172.157,256.841,168.387,253.19,163.164,253.19zM235.249,253.923h-47.284c-5.46,0-8.993,3.282-8.993,8.023c0,4.615,3.533,7.897,8.993,7.897h13.978c0.488,0,0.726,0.244,0.726,0.726v57.247c0,5.711,3.771,9.475,8.882,9.475c5.223,0,8.993-3.764,8.993-9.475v-57.247c0-0.482,0.237-0.726,0.726-0.726h13.978c5.46,0,8.993-3.282,8.993-7.897C244.242,257.204,240.709,253.923,235.249,253.923zM318.253,253.19c-5.348,0-8.267,2.919-10.934,9.238l-17.26,39.862h-0.489l-17.623-39.862c-2.794-6.319-5.712-9.238-11.06-9.238c-5.948,0-9.845,4.134-9.845,10.697v64.781c0,5.467,3.408,8.623,8.268,8.623c4.622,0,8.029-3.156,8.029-8.623v-39.868h0.6l12.89,29.653c2.541,5.837,4.608,7.541,8.742,7.541c4.133,0,6.2-1.704,8.756-7.541l12.764-29.653h0.601v39.868c0,5.467,3.281,8.623,8.141,8.623c4.874,0,8.156-3.156,8.156-8.623v-64.781C327.987,257.323,324.216,253.19,318.253,253.19zM389.36,320.645h-29.408c-0.489,0-0.726-0.244-0.726-0.734v-57.24c0-5.712-3.77-9.482-8.867-9.482c-5.237,0-8.993,3.77-8.993,9.482v64.899c0,5.349,3.518,8.993,8.993,8.993h39.002c5.475,0,8.994-3.282,8.994-8.022C398.354,323.926,394.835,320.645,389.36,320.645z"/></svg>`},

  { name:'CSS', url:'https://developer.mozilla.org/en-US/docs/Web/CSS',
    svg:`<svg viewBox="0 0 512 512"><path fill="#33ff33" d="M378.413,0H208.297h-13.182L185.8,9.314L57.02,138.102l-9.314,9.314v13.176v265.514c0,47.36,38.528,85.895,85.896,85.895h244.811c47.353,0,85.881-38.535,85.881-85.895V85.896C464.294,38.528,425.766,0,378.413,0zM432.497,426.105c0,29.877-24.214,54.091-54.084,54.091H133.602c-29.884,0-54.098-24.214-54.098-54.091V160.591h83.716c24.885,0,45.077-20.178,45.077-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.092V426.105zM169.574,268.949c5.837,0,9.104,2.171,12.499,6.786c2.709,3.805,5.432,5.167,8.825,5.167c5.028,0,9.105-3.673,9.105-8.965c0-2.171-0.684-4.078-1.774-5.977c-4.622-8.288-14.802-14.669-28.655-14.669c-16.171,0-28.124,7.603-33.012,22.685c-1.899,6.11-2.57,10.865-2.57,24.989c0,14.125,0.67,18.881,2.57,24.99c4.888,15.081,16.841,22.685,33.012,22.685c13.853,0,24.033-6.382,28.655-14.67c1.09-1.899,1.774-3.805,1.774-5.976c0-5.3-4.078-8.965-9.105-8.965c-3.393,0-6.116,1.361-8.825,5.16c-3.394,4.622-6.662,6.794-12.499,6.794c-7.471,0-11.814-3.938-13.853-10.187c-1.089-3.393-1.494-6.654-1.494-19.83c0-13.175,0.406-16.436,1.494-19.829C157.76,272.887,162.103,268.949,169.574,268.949zM255.149,289.595l-4.888-0.684c-10.725-1.494-14.398-5.02-14.398-10.187c0-5.837,4.343-9.915,12.498-9.915c5.698,0,11.409,1.634,15.892,3.805c1.899,0.95,3.938,1.494,5.837,1.494c4.888,0,8.7-3.666,8.7-8.693c0-3.261-1.494-5.977-4.762-8.016c-5.432-3.394-15.612-6.11-25.806-6.11c-19.97,0-32.733,11.269-32.733,28.25c0,16.304,10.32,25.13,29.2,27.713l4.901,0.677c10.99,1.494,14.258,4.888,14.258,10.32c0,6.389-5.306,10.872-15.082,10.872c-6.787,0-12.219-1.767-19.83-5.977c-1.634-0.956-3.672-1.634-5.837-1.634c-5.166,0-8.965,3.938-8.965,8.832c0,3.254,1.634,6.382,4.748,8.42c6.116,3.799,16.031,7.876,29.074,7.876c24.032,0,36.266-12.358,36.266-29.067C284.223,300.865,274.307,292.311,255.149,289.595zM338.697,289.595l-4.888-0.684c-10.738-1.494-14.398-5.02-14.398-10.187c0-5.837,4.344-9.915,12.484-9.915c5.712,0,11.423,1.634,15.892,3.805c1.913,0.95,3.952,1.494,5.851,1.494c4.887,0,8.686-3.666,8.686-8.693c0-3.261-1.494-5.977-4.748-8.016c-5.432-3.394-15.626-6.11-25.806-6.11c-19.969,0-32.733,11.269-32.733,28.25c0,16.304,10.32,25.13,29.2,27.713l4.888,0.677c11.004,1.494,14.258,4.888,14.258,10.32c0,6.389-5.292,10.872-15.068,10.872c-6.8,0-12.232-1.767-19.829-5.977c-1.634-0.956-3.673-1.634-5.851-1.634c-5.153,0-8.965,3.938-8.965,8.832c0,3.254,1.634,6.382,4.762,8.42c6.117,3.799,16.032,7.876,29.06,7.876c24.047,0,36.266-12.358,36.266-29.067C367.758,300.865,357.843,292.311,338.697,289.595z"/></svg>` },

  { name:'JavaScript', url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    svg:`<svg viewBox="0 0 24 24"><path fill="#33ff33" d="M14.478 14.8829a4.06111 4.06111 0 0 1-2.18725-.39825 1.4389 1.4389 0 0 1-.53547-1.01019.22184.22184 0 0 0-.22662-.21942c-.31659-.00385-.63312-.003-.94965-.00043a.2113.2113 0 0 0-.23138.18628 2.33854 2.33854 0 0 0 .75305 1.84454 3.99135 3.99135 0 0 0 2.22827.8382 8.06151 8.06151 0 0 0 2.53308-.10755 3.12591 3.12591 0 0 0 1.67823-.90442 2.33824 2.33824 0 0 0 .396-2.23077 1.869 1.869 0 0 0-1.2304-1.09454c-1.28077-.4494-2.66431-.41541-3.97-.7569-.22668-.07135-.50366-.1488-.60467-.38879a.85461.85461 0 0 1 .28418-.95478 2.5576 2.5576 0 0 1 1.34875-.33581 4.07051 4.07051 0 0 1 1.88416.26959 1.43564 1.43564 0 0 1 .68677.99219.243.243 0 0 0 .2276.23565c.31433.00641.62878.00171.94311.00214a.22791.22791 0 0 0 .24732-.16772 2.43369 2.43369 0 0 0-1.18665-2.106 5.8791 5.8791 0 0 0-3.2182-.49243V8.08341a3.50546 3.50546 0 0 0-2.17615.87438 2.1746 2.1746 0 0 0-.43438 2.26264 1.92964 1.92964 0 0 0 1.21838 1.06177c1.27649.46106 2.67554.31311 3.96442.72082.25116.08521.54364.21552.6206.49506a.9907.9907 0 0 1-.26965.94616A2.97065 2.97065 0 0 1 14.478 14.8829zm5.81891-8.44537q-3.73837-2.114-7.47845-4.22418a1.67742 1.67742 0 0 0-1.63733 0Q7.4556 4.31715 3.72968 6.42075a1.54242 1.54242 0 0 0-.8042 1.34271V16.2377a1.55266 1.55266 0 0 0 .8352 1.355c.71351.38837 1.40674.81629 2.13318 1.17884a3.06373 3.06373 0 0 0 2.73822.07525 2.1275 2.1275 0 0 0 .99482-1.92114c.00555-2.79669.00085-5.59351.00213-8.39026a.21981.21981 0 0 0-.20727-.25415c-.31739-.00513-.63526-.003-.95264-.00085a.20935.20935 0 0 0-.228.21368c-.00427 2.77875.00086 5.55829-.00256 8.33746a.94053.94053 0 0 1-.609.88373 1.53242 1.53242 0 0 1-1.23993-.16595q-.99152-.56-1.983-1.11988a.23714.23714 0 0 1-.13464-.23529q0-4.19383 0-8.38726a.2589.2589 0 0 1 .157-.2602Q8.1423 5.4553 11.85419 3.35953a.258.258 0 0 1 .29163.00043Q15.859 5.452 19.57184 7.5455a.262.262 0 0 1 .15613.26142Q19.72733 12 19.72712 16.19376a.242.242 0 0 1-.13294.23828q-3.65643 2.06753-7.31677 4.12909c-.11658.06494-.25458.16943-.39093.09076-.6391-.36176-1.27039-.73755-1.90735-1.10273a.20589.20589 0 0 0-.22968-.01379 5.21834 5.21834 0 0 1-.88208.41162c-.13806.05591-.30792.07184-.40295.19989a1.31566 1.31566 0 0 0 .43127.31061q1.11741.647 2.236 1.29285a1.62967 1.62967 0 0 0 1.65539.046q3.7261-2.101 7.45185-4.20392a1.55627 1.55627 0 0 0 .83563-1.35474V7.76346A1.53956 1.53956 0 0 0 20.29694 6.43753z"/></svg>` },

  { name:'PHP', url:'https://www.php.net',
    svg:`<svg viewBox="0 0 512 512"><path fill="#33ff33" d="M401.054,224c3.714,4.115,4.595,11.181,2.653,21.19c-2.029,10.425-5.935,17.862-11.723,22.32c-5.793,4.458-14.602,6.687-26.432,6.687h-17.849l10.957-56.37h20.103C389.913,217.827,397.34,219.886,401.054,224zM149.754,217.827h-20.103l-10.958,56.37h17.848c11.827,0,20.639-2.229,26.432-6.687c5.789-4.458,9.694-11.896,11.723-22.32c1.942-10.01,1.06-17.075-2.653-21.19C168.33,219.886,160.903,217.827,149.754,217.827zM511.5,256c0,74.229-114.393,134.403-255.5,134.403S0.5,330.229,0.5,256c0-74.228,114.393-134.403,255.5-134.403S511.5,181.772,511.5,256zM198.542,265.286c3.04-5.448,5.203-11.461,6.483-18.037c3.102-15.967,0.761-28.403-7.024-37.313c-7.781-8.91-20.165-13.363-37.136-13.363h-56.423L78.265,331.261h29.342l6.958-35.805h25.134c11.087,0,20.21-1.164,27.372-3.497c7.161-2.329,13.669-6.233,19.528-11.719C191.514,275.72,195.493,270.738,198.542,265.286zM301.814,295.456l12.181-62.682c2.479-12.747,0.619-21.971-5.572-27.664c-6.196-5.688-17.449-8.537-33.768-8.537h-25.933l6.961-35.81h-29.11l-26.182,134.692h29.11l14.996-77.165h23.267c7.448,0,12.317,1.232,14.604,3.698c2.287,2.467,2.773,7.091,1.455,13.869l-11.581,59.598H301.814zM427.011,209.937c-7.78-8.91-20.164-13.363-37.135-13.363h-56.424l-26.178,134.688h29.343l6.957-35.805h25.135c11.086,0,20.21-1.164,27.371-3.497c7.161-2.329,13.669-6.233,19.528-11.719c4.92-4.521,8.896-9.502,11.943-14.954c3.044-5.448,5.202-11.461,6.483-18.037C437.137,231.282,434.796,218.846,427.011,209.937z"/></svg>` },

  { name:'MySQL', url:'https://www.mysql.com',
    svg:`<svg viewBox="0 0 548.29 548.291"><path fill="#33ff33" d="M276.043 244.216c-24.575 0-38.741 24.087-38.741 53.862-.241 30.228 14.407 53.382 38.5 53.382 24.323 0 38.512-22.92 38.512-54.091 0-29.066-13.709-53.153-38.27-53.153zM486.2 196.116h-13.164V132.59c0-.399-.064-.795-.116-1.2-.021-2.52-.824-4.997-2.551-6.96L364.656 3.677c-.031-.031-.064-.044-.085-.075-.629-.704-1.364-1.29-2.141-1.796-.231-.154-.462-.283-.704-.419-.672-.365-1.386-.672-2.121-.893-.199-.052-.377-.134-.576-.186C358.229.118 357.4 0 356.562 0H96.757C84.893 0 75.256 9.649 75.256 21.502v174.613H62.093c-16.967 0-30.733 13.756-30.733 30.733v159.812c0 16.961 13.766 30.731 30.733 30.731h13.163V526.79c0 11.854 9.637 21.501 21.501 21.501h354.777c11.853 0 21.502-9.647 21.502-21.501V417.392H486.2c16.977 0 30.729-13.771 30.729-30.731V226.849c0-16.977-13.753-30.733-30.729-30.733zM96.757 21.502h249.053v110.006c0 5.943 4.818 10.751 10.751 10.751h94.973v53.861H96.757V21.502zM353.033 376.96l-10.394 27.884c-22.666-6.619-41.565-13.479-62.828-22.445-3.527-1.418-7.317-2.132-11.094-2.362-35.909-2.352-69.449-28.819-69.449-80.778 0-47.711 30.236-83.623 77.71-83.623 48.675 0 75.351 36.854 75.351 80.317 0 36.142-16.766 61.638-37.785 71.091v.945c12.284 3.539 25.975 6.378 38.489 8.971zM72.912 370.116l7.328-29.764c9.69 4.96 24.554 9.915 39.917 9.915 16.525 0 25.271-6.84 25.271-17.228 0-9.928-7.56-15.597-26.691-22.442-26.457-9.217-43.696-23.858-43.696-47.014 0-27.163 22.68-47.948 60.231-47.948 17.954 0 31.184 3.791 40.623 8.03l-8.021 29.061c-6.375-3.076-17.711-7.564-33.3-7.564-15.599 0-23.163 7.079-23.163 15.357 0 10.15 8.977 14.646 29.533 22.447 28.108 10.394 41.332 25.023 41.332 47.464 0 26.699-20.557 49.365-64.253 49.365-18.278 0-36.223-4.725-45.21-9.669zM451.534 520.962H96.757v-103.57h354.777v103.57zM475.387 377.428h-99.455V218.231h36.158v128.97h63.297v30.227z"/></svg>` },

  { name:'Git', url:'https://git-scm.com',
    svg:`<svg viewBox="0 0 48 48"><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M4.21 22.12a2.87 2.87 0 0 0 0 3.77L22.12 43.8a2.87 2.87 0 0 0 3.77 0l17.9-17.91a2.85 2.85 0 0 0 0-3.77L25.89 4.21A2.68 2.68 0 0 0 24 3.51a2.66 2.66 0 0 0-1.88.71Z"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M26.33 17.85l3.82 3.82"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M17.4 8.92l4.27 4.27"/><circle fill="none" stroke="#33ff33" stroke-width="1.92" cx="24" cy="32.41" r="3.3"/><circle fill="none" stroke="#33ff33" stroke-width="1.92" cx="24" cy="15.52" r="3.3"/><circle fill="none" stroke="#33ff33" stroke-width="1.92" cx="32.48" cy="24" r="3.3"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M24 29.11V18.82"/></svg>` },

  { name:'GitHub', url:'https://github.com',
    svg:`<svg viewBox="0 0 20 20"><path fill="#33ff33" d="M10 0C4.477 0 0 4.59 0 10.253c0 4.529 2.862 8.371 6.833 9.728.507.101.687-.219.687-.492 0-.338-.012-1.442-.012-2.814 0-.956.32-1.58.679-1.898-2.227-.254-4.567-1.121-4.567-5.059 0-1.12.388-2.034 1.03-2.752-.104-.259-.447-1.302.098-2.714 0 0 .838-.275 2.747 1.051A9.79 9.79 0 0 1 10 4.958c.85.004 1.706.118 2.505.345 1.909-1.326 2.747-1.051 2.747-1.051.545 1.412.202 2.455.098 2.714.642.718 1.03 1.632 1.03 2.752 0 3.928-2.335 4.808-4.556 5.067.286.256.545.708.635 1.371.57.262 2.018.715 2.91-.852 0 0 .529-.985 1.533-1.057 0 0 .975-.013.068.623 0 0-.655.315-1.11 1.5 0 0-.587 1.83-3.369 1.21.005.857.014 1.665.014 1.909 0 .271.184.588.683.493C17.138 18.624 20 14.782 20 10.253 20 4.59 15.523 0 10 0z"/></svg>` },

  { name:'Visual Studio', url:'https://visualstudio.microsoft.com', 
    svg:`<svg viewBox="0 0 32 32"><path fill="#33ff33" d="M6 2h20c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V6C2 3.8 3.8 2 6 2z"/><path fill="##00ff41" d="M26 24l-4.9 2-8.1-8-5.1 4-2-1V11l2-1 5.1 4 8-8L26 8V24zM15.7 16l5.3 4.1v-8.3L15.7 16zM7.9 19.1L11 16l-3-3.1z"/></svg>` },

  { name:'VB.Net', url:'https://learn.microsoft.com/en-us/dotnet/visual-basic/',
    svg:`<svg viewBox="0 0 20 20"><path fill="#33ff33" d="M3 0L3 20L17 20L17 19L16 19L4 19L4 1L12 1L12 5L16 5L16 12L17 12L17 4L13 0L12 0L3 0zM13 1.35L15.65 4L13 4zM10 13v2a.5.5 0 0 0 .07.26l1.5 2.5a.5.5 0 0 0 .86 0l1.5-2.5A.5.5 0 0 0 14 15v-2h-1v1.86l-1 1.67-1-1.67V13h-1zM15 13v5h2.5a1.5 1.5 0 0 0 0-3 1.5 1.5 0 0 0-2.5-2H15zm1 1h1a.5.5 0 0 1 0 1h-1v-1zm0 2h1.5a.5.5 0 0 1 0 1H16v-1z"/></svg>` },
  
  { name:'Next.JS', url:'https://nextjs.org',
    svg:`<svg viewBox="-3.2 -3.2 38.4 38.4"><path fill="#33ff33" d="M23.749 30.005c-.119.063-.109.083.005.025.037-.015.068-.036.095-.061 0-.021 0-.021-.1.036zm.24-.13c-.057.047-.057.047.011.016.036-.021.068-.041.068-.047 0-.027-.016-.021-.079.031zm.156-.094c-.057.047-.057.047.011.016.037-.021.068-.043.068-.048 0-.025-.016-.02-.079.032zm.158-.093c-.057.047-.057.047.009.015.037-.02.068-.041.068-.047 0-.025-.016-.02-.077.032zm.213-.141c-.109.073-.147.12-.047.068.067-.041.181-.131.161-.131-.043.016-.079.043-.115.063zM14.953.011c-.073.005-.292.025-.484.041-4.548.412-8.803 2.86-11.5 6.631-1.491 2.067-2.459 4.468-2.824 6.989-.129.88-.145 1.14-.145 2.333 0 1.192.016 1.448.145 2.328.871 6.011 5.147 11.057 10.943 12.927 1.043.333 2.136.563 3.381.704.484.052 2.577.052 3.061 0 2.152-.24 3.969-.771 5.767-1.688.276-.14.328-.177.291-.208-.88-1.161-1.744-2.323-2.609-3.495l-2.557-3.453-3.203-4.745c-1.068-1.588-2.14-3.172-3.229-4.744-.011 0-.025 2.109-.031 4.681-.011 4.505-.011 4.688-.068 4.792-.057.125-.151.229-.276.287-.099.047-.188.057-.661.057h-.541l-.141-.088c-.088-.057-.161-.136-.208-.229l-.068-.141.005-6.271.011-6.271.099-.125c.063-.077.141-.14.229-.187.131-.063.183-.073.724-.073.635 0 .74.025.907.208 1.296 1.932 2.588 3.869 3.859 5.812 2.079 3.152 4.917 7.453 6.312 9.563l2.537 3.839.125-.083c1.219-.813 2.328-1.781 3.285-2.885 2.016-2.308 3.324-5.147 3.767-8.177.129-.88.145-1.141.145-2.333 0-1.193-.016-1.448-.145-2.328-.871-6.011-5.147-11.057-10.943-12.928-1.084-.343-2.199-.577-3.328-.697-.303-.031-2.371-.068-2.631-.041zM21.5 9.688c.151.072.265.208.317.364.027.084.032 1.823.027 5.74l-.011 5.624-.989-1.52-.995-1.521v-4.083c0-2.647.011-4.131.025-4.204.047-.167.161-.307.313-.395.124-.063.172-.068.667-.068.463 0 .541.005.645.063z"/></svg>` },

  { name:'Photoshop', url:'https://www.adobe.com/products/photoshop.html',
    svg:`<svg viewBox="0 0 512 512"><path fill="#33ff33" d="M454.613,0H57.387C25.707,0,0,25.707,0,57.387v397.227C0,486.293,25.707,512,57.387,512h397.227c31.68,0,57.387-25.707,57.387-57.387V57.387C512,25.707,486.293,0,454.613,0zM490.667,454.613c0,19.947-16.107,36.053-36.053,36.053H57.387c-19.947,0-36.053-16.107-36.053-36.053V57.387c0-19.947,16.107-36.053,36.053-36.053h397.227c19.947,0,36.053,16.107,36.053,36.053V454.613zM242.88,166.72c-12.48-11.84-31.467-17.707-56.213-17.707c-16.107-0.107-32.107,1.387-48,4.267v216.853h26.667V281.6c5.44,1.28,11.733,1.6,18.773,1.6c24.747,0,47.36-8.107,61.013-24.427c10.133-11.093,15.573-26.347,15.573-46.187C260.693,193.067,253.973,177.067,242.88,166.72zM184.64,261.333c-7.68,0-14.187-0.32-19.307-1.92V173.12c7.467-1.387,14.933-2.027,22.507-1.92c29.867,0,46.933,16,46.933,43.307C234.773,244.693,215.467,261.333,184.64,261.333zM335.04,278.613c-18.667-8.747-26.347-14.613-26.347-26.987c0-11.413,8.32-21.12,24.107-21.12c10.133,0,20.053,2.987,28.587,8.427l6.72-20.16c-8-4.907-20.267-9.173-35.093-9.173c-30.507,0-50.453,19.84-50.453,45.227c0,18.88,12.587,33.92,38.293,44.907c19.307,8.747,26.347,16.32,26.347,29.333c0,13.653-9.28,23.467-27.947,23.467c-12.907,0-26.347-5.547-33.707-10.453l-6.72,20.8c9.6,6.187,24.427,10.453,39.893,10.453c33.387,0,54.613-18.24,54.613-47.253C373.333,303.04,359.147,288.96,335.04,278.613z"/></svg>` },

  { name:'Premiere Pro', url:'https://premierepro.net/',
    svg:`<svg viewBox="0 0 512 512"><path fill="#33ff33" d="M454.613,0H57.387C25.707,0,0,25.707,0,57.387v397.227C0,486.293,25.707,512,57.387,512h397.227c31.68,0,57.387-25.707,57.387-57.387V57.387C512,25.707,486.293,0,454.613,0zM490.667,454.613c0,19.947-16.107,36.053-36.053,36.053H57.387c-19.947,0-36.053-16.107-36.053-36.053V57.387c0-19.947,16.107-36.053,36.053-36.053h397.227c19.947,0,36.053,16.107,36.053,36.053V454.613zM253.44,166.4c-12.267-11.413-31.36-17.067-56.213-17.067c-16.107-0.107-32.107,1.28-47.893,4.053v209.28H176v-85.44c5.44,1.28,11.733,1.6,18.773,1.6c24.747,0,47.36-7.893,60.907-23.573c10.133-10.667,15.573-25.493,15.573-44.587C271.253,191.787,264.533,176.427,253.44,166.4zM195.307,257.067c-7.68,0-14.08-0.32-19.307-1.92V171.84c7.36-1.387,14.933-2.027,22.507-1.92c29.867,0,46.827,15.36,46.827,41.813C245.333,241.067,226.133,257.067,195.307,257.067zM326.293,238.933h-0.96l-1.28-28.8h-23.467c0.64,13.227,1.28,28.693,1.28,45.12v107.413h26.667v-81.173c0-4.48,0.32-8.96,0.96-13.44c3.52-20.16,17.067-34.88,35.733-34.88c2.667-0.107,5.44,0.107,8.107,0.64v-26.24c-2.347-0.427-4.693-0.64-7.04-0.64C348.8,206.933,332.693,219.733,326.293,238.933z"/></svg>` },

  { name:'Lightroom', url:'https://www.adobe.com/products/photoshop-lightroom.html',
    svg:`<svg viewBox="0 0 48 48"><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M40.5 5.5H7.5a2 2 0 0 0-2 2v33a2 2 0 0 0 2 2h33a2 2 0 0 0 2-2V7.5a2 2 0 0 0-2-2Z"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M14.05 14.04v19.92h9.94"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M29 26a5 5 0 0 1 5-5"/><path fill="none" stroke="#33ff33" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" d="M28.97 21.01v12.95"/></svg>` },
  
  { name:'Canva', url:'https://www.canva.com', 
    svg:`<svg viewBox="0 0 192 192"><path fill="none" stroke="#33ff33" stroke-width="12" stroke-linejoin="round" stroke-miterlimit="10" d="M95.2 170c-11.6 0-22-3.1-30.9-9.1-8.8-6-15.4-14.6-19.7-25.6-2.5-6.4-4-13.4-4.7-21.4-.8-9.5-.2-19.2 1.9-28.7 3.3-15.3 10-28.5 19.8-39.5 9.7-10.8 21.2-18.1 34.3-21.5 5.6-1.5 11.2-2.2 16.5-2.2 6.4 0 12.7 1.1 18.7 3.3 8.9 3.3 15 9 17.9 17 1.4 3.7 1.8 7.6 1.4 12-.6 6.2-2.6 11.7-6 16.4-3.9 5.4-8.6 8.7-14.3 10.1-1 .3-2.1.4-3.3.4-.5 0-.9 0-1.4-.1-1.7-.2-3.2-.9-4.2-2.2-1-1.3-1.4-3-1.2-4.7.3-2 1.1-3.7 1.9-5.1l.3-.6c1.6-3.2 3.1-6.2 3.9-9.4 1.3-5.4 1.3-9.5-.1-13.3-1.5-4-4.3-6.5-8.5-7.5-1.6-.4-3.2-.6-4.8-.6-3.6 0-7.4.9-11.4 2.7C93.4 44 86.7 50 81 58.7c-3.9 6-6.9 12.7-9.1 20.5-1.6 5.6-2.6 11.5-3.2 17.6-.3 2.9-.5 6.3-.5 9.6.1 9.7 1.5 17.4 4.5 24.2 3.3 7.6 7.8 12.9 13.9 16.3 4.1 2.3 8.7 3.5 13.6 3.5.8 0 1.7 0 2.6-.1 10.4-.8 19.6-5.5 28-14.3 4.3-4.5 7.9-9.7 11-15.9.5-.9 1-1.9 1.8-2.7 1-1.1 2.3-1.7 3.7-1.7 1.7 0 3.2.9 4.2 2.5 1.2 2 1.1 4.2.9 5.6-.6 4.1-2.1 8.1-4.6 12.8-7.2 12.9-17.1 22.4-29.4 28.3-6.3 3-13.1 4.7-20.1 5-1.1.1-2.1.1-3.1.1z"/></svg>` },
	
  { name:'Notepad++', url:'https://notepad-plus-plus.org/', 
	svg:`<svg viewBox="0 0 24 24"><path fill="none" stroke="#33ff33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 4H7.2C6.08 4 5.52 4 5.092 4.218a2 2 0 0 0-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.52 20 6.08 20 7.197 20h9.606c1.118 0 1.677 0 2.105-.218a2 2 0 0 0 .874-.874C20 18.48 20 17.921 20 16.803V14M16 5l-6 6v3h3l6-6M16 5l3-3 3 3-3 3M16 5l3 3"/></svg>` },

  { name:'Node.JS', url:'https://nodejs.org',
    svg:`<svg viewBox="0 0 32 32"><path fill="#33ff33" d="M21.3 6c-.157 0-.3.126-.3.301v5.496l-1.246-.727a.503.503 0 0 0-.508 0l-2.994 1.746a.503.503 0 0 0-.252.436v3.496c0 .18.096.345.252.435l2.994 1.746c.156.09.352.09.508 0l2.994-1.746A.503.503 0 0 0 23 16.748V7.23a.503.503 0 0 0-.248-.431l-1.303-.758A.365.365 0 0 0 21.3 6zM11.5 11c-.088 0-.176.023-.254.07l-2.994 1.746A.503.503 0 0 0 8 13.252v3.496c0 .18.096.345.252.435l2.994 1.746c.157.09.35.09.508 0l2.994-1.746a.503.503 0 0 0 .252-.435v-3.496a.503.503 0 0 0-.252-.436l-2.994-1.746A.503.503 0 0 0 11.5 11zM27.5 11c-.088 0-.176.023-.254.07l-2.994 1.746a.503.503 0 0 0-.252.436v3.496c0 .18.096.345.252.435l2.904 1.756a.503.503 0 0 0 .51 0l1.428-.83a.26.26 0 0 0 0-.387L26 15.904v-1.795l1.5-.873 1.5.873v1.25c0 .167.14.193.234.137.378-.222 1.518-.883 1.518-.883A.503.503 0 0 0 31 14.182v-.93a.503.503 0 0 0-.252-.436l-2.994-1.746A.503.503 0 0 0 27.5 11zM3.5 11.004c-.088 0-.176.023-.254.069l-2.994 1.744A.503.503 0 0 0 0 13.254v4.463c0 .218.236.353.424.244l1.328-.773A.503.503 0 0 0 2 16.756v-2.643l1.5-.875 1.5.875v2.643c0 .178.095.341.248.431l1.328.773c.188.11.424-.026.424-.244v-4.463a.503.503 0 0 0-.252-.436L3.754 11.072a.503.503 0 0 0-.254-.068zM19.5 13.236l1.5.875V15v.889l-1.5.875-1.5-.875v-1.778l1.5-.875zM27.5 14.004l-.857.5v.998l.857.498.857-.498v-.998l-.857-.5zM15.406 17.998c-.103 0-.207.025-.297.076l-2.812 1.625a.503.503 0 0 0-.297.512v3.246c0 .209.117.406.297.512l.74.422c.355.175.486.176.647.176.53 0 .832-.317.832-.877v-3.207c0-.049-.038-.084-.082-.084h-.355c-.049 0-.084.04-.084.084v3.207c0 .243-.257.492-.676.283l-.77-.443a.503.503 0 0 1-.043-.074v-3.246c0-.029.014-.063.043-.078l2.813-1.621a.503.503 0 0 1 .088-.01.503.503 0 0 1 .088.01l2.815 1.621c.029.015.043.044.043.079v3.246c0 .034-.019.063-.043.078l-2.815 1.627a.503.503 0 0 1-.088.01.503.503 0 0 1-.088-.01l-.719-.428c-.019-.01-.049-.016-.068-.006-.199.117-.239.132-.424.195-.049.015-.115.045.026.123l.934.555c.093.049.195.078.297.078.107 0 .211-.029.293-.082l2.813-1.627a.503.503 0 0 0 .297-.512v-3.246a.503.503 0 0 0-.297-.512l-2.813-1.625a.503.503 0 0 0-.293-.076zM19.793 19.496a.54.54 0 0 0-.539.539.54.54 0 0 0 .539.541.54.54 0 0 0 .539-.541.54.54 0 0 0-.539-.539zm0 .086c.254 0 .459.2.459.453 0 .248-.206.453-.459.459a.456.456 0 0 1-.451-.459c0-.253.203-.453.451-.453zm-.197.146v.607h.115v-.242h.108c.044 0 .055.019.065.053 0 .005.019.163.024.192h.125c-.014-.029-.024-.112-.029-.162-.014-.078-.019-.132-.102-.137.044-.015.117-.039.117-.151 0-.161-.14-.16-.213-.16h-.209zm.115.098h.098c.03 0 .088 0 .088.083 0 .034-.015.089-.094.088h-.092zm-3.551.496c-.803 0-1.279.342-1.279.906 0 .618.477.783 1.246.861.92.092.992.224.992.404 0 .316-.254.447-.848.447-.745 0-.909-.185-.963-.555a.086.086 0 0 0-.084-.068h-.365c-.044 0-.082.035-.082.084 0 .472.257 1.037 1.488 1.037.903 0 1.414-.35 1.414-.964 0-.608-.409-.77-1.275-.887-.876-.117-.963-.176-.963-.381 0-.17.072-.393.719-.393.579 0 .795.127.883.516a.086.086 0 0 0 .084.063h.365c.024 0 .044-.009.058-.023.015-.019.024-.039.019-.063-.058-.672-.501-.984-1.402-.984z"/></svg>` },

];

function renderSkills() {
  const container = document.getElementById('skills');
  if (!container) return;

  container.innerHTML = SKILLS.map(skill => `
    <a class="skill-item" href="${skill.url}" target="_blank">
      <div class="skill-icon">${skill.svg}</div>
      <span>${skill.name}</span>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderSkills);

function initCareerLine(){
  const sc=document.getElementById('scroll-container');
  const section=document.getElementById('section-career');
  const fill=document.getElementById('careerLineFill');
  const dot=document.getElementById('careerLineDot');
  if(!sc||!section||!fill||!dot)return;
  const entries=[...section.querySelectorAll('.career-entry')];
  const titleEls=[...section.querySelectorAll('.career-title-1,.career-title-2,.career-title-ul')];

  // Set transitions
  [...titleEls,...entries].forEach(el=>{
    el.style.transition='opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)';
  });

  function update(){
    const secTop=section.offsetTop,secH=section.offsetHeight,viewH=sc.clientHeight,st=sc.scrollTop;
    const pct=Math.max(0,Math.min(1,(st-(secTop-viewH*.7))/((secTop+secH-viewH*.3)-(secTop-viewH*.7))));

    fill.style.height=(pct*100)+'%';
    dot.style.top=(pct*100)+'%';

    // Section is visible when pct between 0.03 and 0.97
    const visible=pct>0.03&&pct<0.97;

    titleEls.forEach((el,i)=>{
      el.style.transitionDelay=visible?(i*0.08)+'s':'0s';
      el.style.opacity=visible?'1':'0';
      el.style.transform=visible?'translateY(0)':'translateY(20px)';
    });

    entries.forEach((e,i)=>{
      e.style.transitionDelay=visible?(0.1+i*0.07)+'s':'0s';
      e.style.opacity=visible?'1':'0';
      e.style.transform=visible?'translateY(0)':'translateY(16px)';
    });
  }

  // Init hidden
  [...titleEls,...entries].forEach(el=>{ el.style.opacity='0'; el.style.transform='translateY(16px)'; });

  sc.addEventListener('scroll',update,{passive:true});
  update();
}

function initGlobe(){
  const canvas=document.getElementById('globeCanvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function setSize(){canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight;}
  setSize(); window.addEventListener('resize',setSize);
  const ICON_SIZE=128;
  function fibSphere(n){const pts=[],G=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-(i/(n-1))*2,r=Math.sqrt(1-y*y),t=G*i;pts.push([Math.cos(t)*r,y,Math.sin(t)*r]);}return pts;}
  function renderIcons(size){return SKILLS.map(sk=>{const oc=document.createElement('canvas');oc.width=oc.height=size;const c=oc.getContext('2d');const svgStr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${sk.svg}</svg>`;const blob=new Blob([svgStr],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.src=url;img.onload=()=>{c.drawImage(img,0,0,size,size);URL.revokeObjectURL(url);};return{img,name:sk.name,color:sk.color,url:sk.url};});}
  const icons=renderIcons(ICON_SIZE),pts=fibSphere(SKILLS.length);
  let rotY=0,rotX=0.3,isDragging=false,lastMX=0,lastMY=0,velX=0,velY=0.005,hoveredIdx=-1;
  canvas.addEventListener('mousedown',e=>{isDragging=true;lastMX=e.clientX;lastMY=e.clientY;velX=0;velY=0;});
  window.addEventListener('mouseup',()=>isDragging=false);
  window.addEventListener('mousemove',e=>{if(!isDragging)return;const dx=e.clientX-lastMX,dy=e.clientY-lastMY;velY=-dx*0.01;velX=-dy*0.01;rotY+=velY;rotX+=velX;lastMX=e.clientX;lastMY=e.clientY;});
  let lastTX=0,lastTY=0;
  canvas.addEventListener('touchstart',e=>{isDragging=true;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;velX=0;velY=0;});
  canvas.addEventListener('touchend',()=>isDragging=false);
  canvas.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-lastTX,dy=e.touches[0].clientY-lastTY;velY=-dx*0.012;velX=-dy*0.012;rotY+=velY;rotX+=velX;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;e.preventDefault();},{passive:false});
  canvas.addEventListener('mousemove',e=>{if(isDragging){hoveredIdx=-1;return;}const rect=canvas.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;hoveredIdx=-1;const cx=canvas.width/2,cy=canvas.height/2,R=Math.min(canvas.width,canvas.height)*0.48;pts.forEach(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);if(d<0)return;const px=cx+sx*R,py=cy+sy*R;if(Math.hypot(mx-px,my-py)<28){hoveredIdx=i;canvas.style.cursor='pointer';}});if(hoveredIdx===-1)canvas.style.cursor='grab';});
  canvas.addEventListener('click',e=>{if(hoveredIdx>=0&&SKILLS[hoveredIdx].url)window.open(SKILLS[hoveredIdx].url,'_blank');});
  function proj(x,y,z){const cy=Math.cos(rotY),sy=Math.sin(rotY);let x1=x*cy-z*sy,z1=x*sy+z*cy;const cx=Math.cos(rotX),sx2=Math.sin(rotX);let y1=y*cx-z1*sx2,z2=y*sx2+z1*cx;return{sx:x1,sy:y1,d:z2};}
  function drawGrid(cx,cy,R){ctx.save();for(let lat=0;lat<10;lat++){const phi=(lat/10)*Math.PI,yr=Math.cos(phi),xr=Math.sin(phi);ctx.beginPath();let first=true;for(let j=0;j<=80;j++){const t=(j/80)*Math.PI*2;const{sx,sy,d}=proj(xr*Math.cos(t),yr,xr*Math.sin(t));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(0,255,65,${0.08+(d+1)/2*0.1})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}for(let lng=0;lng<16;lng++){const theta=(lng/16)*Math.PI*2;ctx.beginPath();let first=true;for(let j=0;j<=40;j++){const phi=(j/40)*Math.PI;const{sx,sy,d}=proj(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(0,255,65,${0.07+(d+1)/2*0.09})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}const grd=ctx.createRadialGradient(cx,cy,R*0.85,cx,cy,R*1.15);grd.addColorStop(0,'rgba(0,255,65,0)');grd.addColorStop(0.5,'rgba(0,255,65,0.04)');grd.addColorStop(1,'rgba(0,255,65,0)');ctx.beginPath();ctx.arc(cx,cy,R*1.1,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.restore();}
  function drawSkills(cx,cy,R){const items=pts.map(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);return{sx,sy,d,i};}).sort((a,b)=>a.d-b.d);items.forEach(({sx,sy,d,i})=>{if(d<-0.1)return;const t=(d+1)/2;if(t<0.05)return;const alpha=Math.pow(t,1.2),scale=0.5+t*0.5;const px=cx+sx*R,py=cy+sy*R;const isHov=(i===hoveredIdx),iconR=R*0.085*scale*(isHov?1.25:1);ctx.save();ctx.globalAlpha=alpha;if(isHov){const grd=ctx.createRadialGradient(px,py,0,px,py,iconR*3);grd.addColorStop(0,'rgba(0,255,65,0.35)');grd.addColorStop(1,'rgba(0,255,65,0)');ctx.beginPath();ctx.arc(px,py,iconR*3,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();}ctx.beginPath();ctx.arc(px,py,iconR,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color+'18';ctx.strokeStyle=isHov?'rgba(0,255,65,0.9)':SKILLS[i].color+'66';ctx.lineWidth=(isHov?2:1.2)*scale;ctx.fill();ctx.stroke();const ic=icons[i];if(ic.img.complete&&ic.img.naturalWidth){const s=iconR*1.35;ctx.drawImage(ic.img,px-s/2,py-s/2,s,s);}else{ctx.beginPath();ctx.arc(px,py,iconR*0.5,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color;ctx.fill();}const fs=Math.max(9,R*0.048*scale*(isHov?1.1:1));ctx.fillStyle=isHov?'#5bf56a':'#ffffff';ctx.font=`${isHov?'600':'400'} ${fs}px Outfit,sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=4;ctx.fillText(SKILLS[i].name,px,py+iconR+3*scale);ctx.shadowBlur=0;ctx.restore();});}
  let raf;
  function loop(){raf=requestAnimationFrame(loop);const w=canvas.width,h=canvas.height;if(!w||!h)return;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*0.48;if(!isDragging){rotY+=velY;velY+=(-0.005-velY)*0.02;velX*=0.95;rotX+=velX;rotX+=(0.3-rotX)*0.01;}drawGrid(cx,cy,R);drawSkills(cx,cy,R);}
  loop();
}
function initCareerDotTrail() {
  const dots = document.querySelectorAll('.career-line-dot');
  const scrollContainer = document.getElementById('scroll-container');

  if (!dots.length || !scrollContainer) return;

  scrollContainer.addEventListener('scroll', () => {
    dots.forEach(dot => {
      const rect = dot.getBoundingClientRect();
      const center = window.innerHeight / 2;

      const distance = Math.abs(rect.top - center);

      // intensity based on distance to center
      let intensity = 1 - (distance / window.innerHeight);
      intensity = Math.max(0.2, Math.min(1, intensity));

      // apply dynamic scale
      dot.style.transform = `scale(${0.8 + intensity * 0.6})`;

      // trail height + opacity
      const trail = dot.querySelector('::after');
      dot.style.setProperty('--trail-scale', intensity);
      dot.style.setProperty('--trail-opacity', intensity);
    });
  });
}



// ═══════════════════════════════════════════════════════════════════
// START — called after all functions are defined
// ═══════════════════════════════════════════════════════════════════
initVideoLoader();

document.addEventListener('DOMContentLoaded', renderTechStack);
