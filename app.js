const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const themes = [
  ['void', 'Void', '#a985ff', '#6d3cff'], ['crimson', 'Crimson Flame', '#ff526f', '#be163e'],
  ['violet', 'Violet Spirit', '#b08cff', '#623be1'], ['cyan', 'Cyan Energy', '#54dcff', '#1970cf'],
  ['sakura', 'Sakura', '#ff92c6', '#bd4c86'], ['azure', 'Azure Flame', '#4a9eff', '#2746cb'],
  ['golden', 'Golden Aura', '#ffd36c', '#bd741b'], ['shadow', 'Shadow', '#9c9aac', '#312f42'],
  ['inferno', 'Inferno', '#ff703d', '#bb2215'], ['moonlight', 'Moonlight', '#d4e6ff', '#6675a8']
];
const settings = JSON.parse(localStorage.getItem('yokai-settings') || '{}');
const save = () => localStorage.setItem('yokai-settings', JSON.stringify(settings));
const setTheme = (theme) => {
  const current = themes.find(([id]) => id === theme) || themes[2];
  document.body.dataset.theme = current[0]; document.documentElement.style.setProperty('--a', current[2]); document.documentElement.style.setProperty('--b', current[3]);
  settings.theme = current[0]; save(); $$('.theme-grid button').forEach(b => b.classList.toggle('selected', b.dataset.theme === current[0]));
};
$('#themeGrid').innerHTML = themes.map(([id, name, color]) => `<button data-theme="${id}" style="--theme:${color}">${name}</button>`).join('');
$('#themeGrid').addEventListener('click', (e) => { const button = e.target.closest('button'); if (button) setTheme(button.dataset.theme); });
setTheme(settings.theme || 'violet');

const glyphs = ['魂', '月', '虚', '光', '夢', '火', '水', '空', '縁', '影', '∞', '◈'];
$('#glyphLayer').innerHTML = glyphs.map((glyph, i) => `<span class="glyph" style="left:${(i * 17 + 6) % 96}%;top:${(i * 31 + 4) % 90}%;--d:${9 + i % 6}s;--r:${i * 17}deg">${glyph}</span>`).join('');
document.addEventListener('pointermove', (event) => { $('#cursorAura').style.left = `${event.clientX}px`; $('#cursorAura').style.top = `${event.clientY}px`; });

const ambient = $('#ambientToggle'), motion = $('#motionToggle'), density = $('#density');
ambient.checked = !!settings.ambient; motion.checked = !!settings.reduced; density.value = settings.density ?? 1;
const updateEffects = () => { document.body.classList.toggle('ambient', ambient.checked); document.body.classList.toggle('reduced', motion.checked); $('#densityOutput').textContent = ['Minimal', 'Balanced', 'Rich'][density.value]; settings.ambient = ambient.checked; settings.reduced = motion.checked; settings.density = density.value; save(); };
[ambient, motion, density].forEach(el => el.addEventListener('input', updateEffects)); updateEffects();

$('#appearanceTrigger').onclick = () => $('#appearance').classList.add('open');
$('#openNotifications').onclick = () => $('#notifications').classList.add('open');
$$('[data-close]').forEach(button => button.onclick = () => $(`#${button.dataset.close}`).classList.remove('open'));
const modal = $('#searchModal'); $('#openSearch').onclick = () => modal.showModal();
document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); modal.showModal(); $('#searchInput').focus(); } });
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

function openPage(page, updateHash = true) { if (!document.getElementById(page)) return; $$('.page-panel').forEach(panel => panel.classList.toggle('active', panel.id === page)); $$('nav button').forEach(item => item.classList.toggle('active', item.dataset.page === page)); document.body.dataset.page = page; if (updateHash && location.hash !== `#${page}`) location.hash = page; window.scrollTo({ top: 0, behavior: 'smooth' }); }
$$('[data-page]').forEach(button => button.addEventListener('click', () => openPage(button.dataset.page)));
window.addEventListener('hashchange', () => openPage(location.hash.slice(1), false));
openPage(location.hash.slice(1) || 'home', false);
$('#enterOrbit').onclick = () => openPage('characters');
$('#watchAtmosphere').onclick = () => { ambient.checked = !ambient.checked; updateEffects(); toast(ambient.checked ? 'AMBIENT MODE AWAKENED' : 'AMBIENT MODE RESTORED'); };
$('#createSoul').onclick = () => toast('SOUL FORGE WILL OPEN WHEN YOUR PROFILE IS CONNECTED');
$('#createSoulAlt').onclick = () => toast('SOUL FORGE WILL OPEN WHEN YOUR PROFILE IS CONNECTED');
$('#writeReview').onclick = () => toast('REVIEW COMPOSER IS READY FOR YOUR PROFILE');
$('#createClub').onclick = () => toast('CLUB FORGE IS READY FOR YOUR PROFILE');
$('#editProfile').onclick = () => $('#appearance').classList.add('open');
$('#chatForm').addEventListener('submit', (event) => { event.preventDefault(); const input = event.currentTarget.querySelector('input'); const text = input.value.trim(); if (!text) return; const message = document.createElement('div'); message.className = 'message mine'; message.textContent = text; event.currentTarget.before(message); input.value = ''; setTimeout(() => { const reply = document.createElement('div'); reply.className = 'message them'; reply.textContent = 'I hear you. Let that thought rest here for a while.'; event.currentTarget.before(reply); }, 500); });
$('#aiForm').addEventListener('submit', (event) => { event.preventDefault(); const input = event.currentTarget.querySelector('input'); if (!input.value.trim()) return; const answer = document.querySelector('.terminal-answer'); answer.textContent = `> The archive is listening: “${input.value.trim()}”`; input.value = ''; });

const originalQuotes = [
  ['The quietest step can still change a world.', '静かな一歩でも、世界を変えられる。', 'YOKAI ORIGINAL · Courage'],
  ['Keep a light for the self you have not met yet.', 'まだ出会っていない自分のために、灯りを残せ。', 'YOKAI ORIGINAL · Hope'],
  ['A horizon is only a promise to keep moving.', '地平線は、進み続けるための約束だ。', 'YOKAI ORIGINAL · Dreams']
];
let lastInteraction = 0;
function interact(x, y) { if (Date.now() - lastInteraction < 550 || document.body.classList.contains('reduced')) return; lastInteraction = Date.now(); const layer = $('#interactionLayer'); const ripple = document.createElement('i'); ripple.className = 'ripple'; ripple.style.left = `${x}px`; ripple.style.top = `${y}px`; layer.append(ripple); for (let i = 0; i < (density.value === '2' ? 8 : 5); i++) { const spark = document.createElement('i'); spark.className = 'spark'; spark.style.left = `${x}px`; spark.style.top = `${y}px`; spark.style.setProperty('--tx', `${(Math.random() - .5) * 90}px`); spark.style.setProperty('--ty', `${(Math.random() - .5) * 90}px`); layer.append(spark); setTimeout(() => spark.remove(), 850); } if (Math.random() < .18) quote(x, y); setTimeout(() => ripple.remove(), 1300); }
function quote(x, y) { const [english, japanese, source] = originalQuotes[Math.floor(Math.random() * originalQuotes.length)]; const card = document.createElement('article'); card.className = 'quote'; card.style.left = `${Math.max(12, Math.min(innerWidth - 280, x - 70))}px`; card.style.top = `${Math.max(80, Math.min(innerHeight - 170, y - 100))}px`; card.innerHTML = `<q>${english}</q><span class="jp">「${japanese}」</span><small>— ${source}</small>`; $('#interactionLayer').append(card); setTimeout(() => card.remove(), 4100); }
document.addEventListener('pointerdown', (event) => { if (!event.target.closest('button,input,dialog,.appearance,.notifications')) interact(event.clientX, event.clientY); });

$$('.soul').forEach(soul => soul.addEventListener('click', (event) => { event.stopPropagation(); const name = soul.dataset.character; $('#entryName').textContent = name; $('#entryMark').textContent = soul.querySelector('b').textContent; const entry = $('#chatEntry'); entry.classList.add('show'); entry.setAttribute('aria-hidden', 'false'); setTimeout(() => { entry.classList.remove('show'); entry.setAttribute('aria-hidden', 'true'); toast(`${name}'S WORLD IS READY — CHAT CHANNEL OPEN`); }, 1800); }));
let logoTaps = 0; $('#logo').onclick = () => { logoTaps++; if (logoTaps === 5) { toast('THE VOID REMEMBERS.'); logoTaps = 0; } setTimeout(() => logoTaps = 0, 2400); };
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2700); }
