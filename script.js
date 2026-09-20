/* ==========================================================================
   CampusSphere – AI Student Success & Peer Study Hub
   script.js
 
   1. Constants and seed data
   2. State and persistence
   3. Utilities (DOM helpers, formatting, toasts, modals)
   4. Dashboard stats, insights and activity feed
   5. Analytics charts (Chart.js)
   6. Focus timer
   7. AI notes summarizer (client-side extractive simulator)
   8. Peer skill-exchange finder
   9. Navigation, global events and bootstrap
   ========================================================================== */
 
'use strict';
 
/* ==========================================================================
   1. CONSTANTS AND SEED DATA
   ========================================================================== */
 
const STORAGE_KEY = 'campussphere-state-v1';
 
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
 
const SUBJECTS = ['Data Structures', 'Calculus', 'Machine Learning', 'UI Design'];
const SUBJECT_COLORS = {
  'Data Structures': '#6366f1',
  'Calculus': '#8b5cf6',
  'Machine Learning': '#d946ef',
  'UI Design': '#38bdf8'
};
 
// Every skill belongs to one category so the peer finder can filter by chip
const SKILL_CATEGORY = {
  'Python': 'Programming',
  'JavaScript': 'Programming',
  'Data Structures': 'Programming',
  'Java': 'Programming',
  'React': 'Programming',
  'Calculus': 'Math',
  'Linear Algebra': 'Math',
  'Statistics': 'Math',
  'Machine Learning': 'AI & ML',
  'Deep Learning': 'AI & ML',
  'NLP': 'AI & ML',
  'UI Design': 'Design',
  'Figma': 'Design',
  'Public Speaking': 'Communication',
  'IELTS Prep': 'Communication'
};
const CATEGORIES = ['All', 'Programming', 'Math', 'AI & ML', 'Design', 'Communication'];
const CATEGORY_ICONS = {
  'All': 'fa-layer-group',
  'Programming': 'fa-code',
  'Math': 'fa-calculator',
  'AI & ML': 'fa-brain',
  'Design': 'fa-palette',
  'Communication': 'fa-microphone'
};
 
// The signed-in student. Used to compute peer match scores.
const ME = {
  name: 'Alex Morgan',
  teaches: ['Python', 'Data Structures', 'JavaScript', 'React'],
  wants: ['Calculus', 'Machine Learning', 'UI Design', 'Public Speaking']
};
 
const PEERS = [
  {
    id: 1, name: 'Priya Nair', major: 'Computer Science', year: 2, gradient: 'from-indigo-500 to-violet-500',
    teaches: ['Calculus', 'Linear Algebra'], wants: ['Python', 'Data Structures'],
    available: true, rating: 4.9, sessions: 42,
    bio: 'Math tutor who loves turning tough proofs into simple pictures. Looking for help getting comfortable with Python.',
    slots: ['Mon 6:00 PM', 'Wed 7:30 PM', 'Sat 11:00 AM']
  },
  {
    id: 2, name: 'Rohan Mehta', major: 'AI and Data Science', year: 3, gradient: 'from-fuchsia-500 to-pink-500',
    teaches: ['Machine Learning', 'Statistics'], wants: ['JavaScript', 'React'],
    available: true, rating: 4.8, sessions: 37,
    bio: 'Built three ML projects for campus clubs. Wants to ship a web front end for his models.',
    slots: ['Tue 5:30 PM', 'Thu 8:00 PM', 'Sun 10:00 AM']
  },
  {
    id: 3, name: 'Sofia Alvarez', major: 'Interaction Design', year: 4, gradient: 'from-sky-500 to-indigo-500',
    teaches: ['UI Design', 'Figma'], wants: ['Python', 'Public Speaking'],
    available: false, rating: 4.9, sessions: 58,
    bio: 'Design lead for the student app studio. Happy to review your mockups and teach wireframing.',
    slots: ['Wed 4:00 PM', 'Fri 3:00 PM']
  },
  {
    id: 4, name: 'Kabir Singh', major: 'Electronics', year: 2, gradient: 'from-emerald-500 to-teal-500',
    teaches: ['Deep Learning', 'Python'], wants: ['Calculus', 'Linear Algebra'],
    available: true, rating: 4.6, sessions: 19,
    bio: 'Runs the robotics club vision team. Needs a calculus refresher for backpropagation.',
    slots: ['Mon 8:00 PM', 'Thu 6:00 PM']
  },
  {
    id: 5, name: 'Mei Lin', major: 'Computer Science', year: 3, gradient: 'from-amber-500 to-orange-500',
    teaches: ['Public Speaking', 'IELTS Prep'], wants: ['Data Structures', 'Machine Learning'],
    available: true, rating: 4.7, sessions: 31,
    bio: 'Debate champion who coaches interview and presentation skills. Wants to level up on algorithms.',
    slots: ['Tue 7:00 PM', 'Sat 2:00 PM', 'Sun 4:00 PM']
  },
  {
    id: 6, name: 'Daniel Okafor', major: 'Information Technology', year: 1, gradient: 'from-violet-500 to-purple-600',
    teaches: ['React', 'JavaScript'], wants: ['Machine Learning', 'UI Design'],
    available: false, rating: 4.5, sessions: 12,
    bio: 'Self-taught front-end developer building his first full-stack app.',
    slots: ['Fri 6:30 PM', 'Sat 9:00 AM']
  },
  {
    id: 7, name: 'Ananya Rao', major: 'Mathematics', year: 4, gradient: 'from-rose-500 to-fuchsia-500',
    teaches: ['Statistics', 'Calculus'], wants: ['Deep Learning', 'Python'],
    available: true, rating: 4.9, sessions: 64,
    bio: 'Teaching assistant for first-year calculus. Curious about applying statistics to neural networks.',
    slots: ['Mon 5:00 PM', 'Wed 6:00 PM', 'Fri 5:00 PM']
  },
  {
    id: 8, name: 'Lucas Meyer', major: 'Computer Science', year: 3, gradient: 'from-cyan-500 to-blue-600',
    teaches: ['NLP', 'Java'], wants: ['UI Design', 'Figma'],
    available: true, rating: 4.4, sessions: 15,
    bio: 'Research assistant in a language technology lab. Wants to make his demos look less like terminals.',
    slots: ['Tue 6:00 PM', 'Thu 7:00 PM']
  }
];
 
const SAMPLE_NOTES = `Machine learning is a branch of artificial intelligence in which computers learn patterns from data instead of following hand-written rules. In supervised learning, a model is trained on labeled examples so it can predict the label for new, unseen inputs. Neural networks are a popular supervised learning model made of layers of connected units called neurons. Each neuron multiplies its inputs by weights, adds a bias, and passes the result through an activation function such as ReLU or sigmoid. During training, the network makes a prediction and a loss function measures how far that prediction is from the true label. Backpropagation then uses the chain rule from calculus to compute how much each weight contributed to the loss. Gradient descent updates the weights in the direction that reduces the loss, and the learning rate controls the size of each step. If the learning rate is too high, training can overshoot and diverge, while a rate that is too low makes learning painfully slow. Overfitting happens when a model memorizes the training data and performs poorly on new data. Techniques such as dropout, regularization, and early stopping help a network generalize better. Splitting data into training, validation, and test sets lets students measure real performance honestly. Finally, feature scaling and clean data often matter more than picking a fancier model.`;
 
// Words ignored when scoring sentences and extracting keywords
const STOPWORDS = new Set((
  'a about above after again all also am an and any are as at be because been before being below between both but by ' +
  'can could did do does doing down during each few for from further had has have having he her here hers him his how ' +
  'i if in into is it its just me more most my no nor not of off on once only or other our out over own same she should ' +
  'so some such than that the their them then there these they this those through to too under until up very was we were ' +
  'what when where which while who whom why will with would you your yours often instead use used uses using like may ' +
  'might must one two three via per finally happens help helps lets makes make made called popular such matter'
).split(' '));
 
const SUMMARY_STEPS = [
  'Reading your notes',
  'Extracting key concepts',
  'Ranking the most important sentences',
  'Composing your summary'
];
 
const TONE_CLASSES = {
  indigo: 'bg-indigo-500/15 text-indigo-300',
  violet: 'bg-violet-500/15 text-violet-300',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300'
};
 
/* ==========================================================================
   2. STATE AND PERSISTENCE
   ========================================================================== */
 
// Builds a fresh demo state. Timestamps are relative so the activity feed always looks recent.
function createDefaultState() {
  const now = Date.now();
  const hour = 3600 * 1000;
  return {
    goal: 30,
    lastWeekTotal: 19.5,
    hours: {
      'Data Structures': [1.5, 1, 1, 1.5, 1, 2, 0.5],
      'Calculus': [1, 0.5, 1.5, 1, 1, 0, 0.5],
      'Machine Learning': [0.5, 1, 0.5, 0, 1.5, 1, 1],
      'UI Design': [0, 0.5, 0.5, 1, 0, 1, 0.5]
    },
    notesCount: 14,
    connectionsBase: 3,
    requests: {},
    library: [
      {
        id: 1, title: 'Graph traversal: BFS vs DFS', savedAt: now - 26 * hour, format: 'bullets',
        points: [
          'Breadth-first search explores a graph level by level using a queue, which finds the shortest path in unweighted graphs.',
          'Depth-first search follows one branch as far as possible using a stack or recursion before backtracking.',
          'Both algorithms run in O(V + E) time, so the right choice depends on the problem you are solving.'
        ],
        keywords: ['Queue', 'Stack', 'Graph']
      },
      {
        id: 2, title: 'Limits and continuity in calculus', savedAt: now - 50 * hour, format: 'bullets',
        points: [
          'A limit describes the value a function approaches as its input gets closer to a point.',
          'A function is continuous at a point when the limit exists and equals the function value there.',
          'The squeeze theorem traps a tricky function between two simpler ones that share the same limit.'
        ],
        keywords: ['Limit', 'Continuity', 'Function']
      }
    ],
    activity: [
      { icon: 'fa-clock', tone: 'sky', text: 'Logged 1.5 h of Data Structures', ts: now - 3 * hour },
      { icon: 'fa-handshake', tone: 'violet', text: 'Session with Priya Nair confirmed', ts: now - 5 * hour },
      { icon: 'fa-file-lines', tone: 'indigo', text: 'Summarized "Graph traversal: BFS vs DFS"', ts: now - 26 * hour }
    ]
  };
}
 
// Checks that saved data has the shape the app expects before trusting it
function isValidState(s) {
  return Boolean(
    s && typeof s === 'object' && s.hours &&
    SUBJECTS.every(sub => Array.isArray(s.hours[sub]) && s.hours[sub].length === 7 &&
      s.hours[sub].every(n => typeof n === 'number' && isFinite(n))) &&
    Array.isArray(s.library) && Array.isArray(s.activity) &&
    s.requests && typeof s.requests === 'object' && typeof s.notesCount === 'number'
  );
}
 
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) return Object.assign(createDefaultState(), parsed);
    }
  } catch (err) {
    // Storage blocked or corrupted: fall back to demo data
  }
  return createDefaultState();
}
 
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage unavailable (private mode): the app still works for this session
  }
}
 
let state = loadState();
 
/* ==========================================================================
   3. UTILITIES
   ========================================================================== */
 
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const round1 = n => Math.round(n * 10) / 10;
const round2 = n => Math.round(n * 100) / 100;
 
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}
 
// Monday = 0 ... Sunday = 6
function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}
 
// "1.5 h" or "25 min"
function fmtDuration(hours) {
  const mins = Math.round(hours * 60);
  return mins < 60 ? `${mins} min` : `${round1(hours)} h`;
}
 
function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}
 
function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
 
function countWords(text) {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}
 
// Smoothly counts a number element up or down to a new value
function animateNumber(el, to, decimals = 0) {
  if (!el) return;
  const from = parseFloat(el.dataset.value || '0') || 0;
  el.dataset.value = String(to);
  cancelAnimationFrame(el._raf);
  const start = performance.now();
  const duration = 600;
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (from + (to - from) * eased).toFixed(decimals);
    if (t < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
 
/* ----- Toasts ----- */
function showToast(message, type = 'success') {
  const root = $('#toastRoot');
  if (!root) return;
  const icons = { success: 'fa-circle-check', info: 'fa-circle-info', error: 'fa-triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${escapeHtml(message)}</span>`;
  root.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 320);
  }, 3400);
}
 
/* ----- Modals ----- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.classList.add('overflow-hidden');
  const focusTarget = $('input:not([type="hidden"]), select, textarea', modal);
  if (focusTarget) setTimeout(() => focusTarget.focus(), 60);
}
 
function closeModal(modal) {
  modal.classList.remove('is-open');
  if (!$('.modal.is-open')) document.body.classList.remove('overflow-hidden');
}
 
function closeAllModals() {
  $$('.modal.is-open').forEach(closeModal);
}
 
/* ----- Clipboard ----- */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fall through to the legacy approach
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
  area.remove();
  return ok;
}
 
/* ==========================================================================
   4. DASHBOARD STATS, INSIGHTS AND ACTIVITY FEED
   ========================================================================== */
 
function dayTotals() {
  return DAYS_SHORT.map((_, i) => SUBJECTS.reduce((sum, sub) => sum + state.hours[sub][i], 0));
}
 
function subjectTotals() {
  return SUBJECTS.map(sub => state.hours[sub].reduce((a, b) => a + b, 0));
}
 
function weekTotal() {
  return subjectTotals().reduce((a, b) => a + b, 0);
}
 
function renderGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  $('#greeting').textContent = greeting;
}
 
function renderStats() {
  const total = weekTotal();
  const pct = Math.min(100, Math.round((total / state.goal) * 100));
 
  animateNumber($('#statHours'), round1(total), 1);
  animateNumber($('#statGoal'), pct, 0);
  animateNumber($('#statNotes'), state.notesCount, 0);
  animateNumber($('#statPeers'), state.connectionsBase + Object.keys(state.requests).length, 0);
  $('#statGoalBar').style.width = `${pct}%`;
 
  // Trend versus last week
  const delta = state.lastWeekTotal > 0 ? ((total - state.lastWeekTotal) / state.lastWeekTotal) * 100 : 0;
  const trend = $('#statHoursTrend');
  const up = delta >= 0;
  trend.className = `trend ${up ? 'trend-up' : 'trend-down'}`;
  trend.innerHTML = `<i class="fa-solid ${up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i> ${up ? '+' : ''}${Math.round(delta)}% vs last week`;
 
  // Weekly goal card
  $('#goalTarget').textContent = state.goal;
  $('#goalBar').style.width = `${pct}%`;
  $('#goalText').textContent = `${round1(total)} of ${state.goal} hours (${pct}%)`;
  const remaining = Math.max(0, state.goal - total);
  const daysLeft = 7 - todayIndex();
  $('#goalHint').textContent = remaining === 0
    ? 'Goal reached. Great work this week!'
    : `${round1(remaining)} hours to go, about ${round1(remaining / daysLeft)} hours a day for the rest of the week.`;
 
  // Insights
  if (total <= 0) {
    $('#insightBestDay').textContent = '–';
    $('#insightTopSubject').textContent = '–';
    $('#insightAvg').textContent = '–';
    return;
  }
  const days = dayTotals();
  const subjects = subjectTotals();
  const bestDay = days.indexOf(Math.max(...days));
  const topSubject = subjects.indexOf(Math.max(...subjects));
  $('#insightBestDay').textContent = `${DAYS_LONG[bestDay]} (${round1(days[bestDay])} h)`;
  $('#insightTopSubject').textContent = SUBJECTS[topSubject];
  $('#insightAvg').textContent = `${round1(total / 7)} h`;
}
 
function addActivity(icon, tone, text) {
  state.activity.unshift({ icon, tone, text, ts: Date.now() });
  state.activity = state.activity.slice(0, 6);
}
 
function renderActivity() {
  const list = $('#activityList');
  list.innerHTML = state.activity.map(item => `
    <li class="flex items-start gap-3">
      <span class="icon-badge shrink-0 ${TONE_CLASSES[item.tone] || TONE_CLASSES.indigo}" style="width:2.2rem;height:2.2rem;font-size:.9rem;">
        <i class="fa-solid ${escapeHtml(item.icon)}"></i>
      </span>
      <div>
        <p class="text-sm leading-snug text-slate-200">${escapeHtml(item.text)}</p>
        <p class="mt-0.5 text-xs text-slate-500">${timeAgo(item.ts)}</p>
      </div>
    </li>`).join('');
}
 
// Records study time and refreshes stats, charts and the activity feed
function logStudy(subject, dayIdx, hours, source) {
  state.hours[subject][dayIdx] = round2(state.hours[subject][dayIdx] + hours);
  const text = source === 'timer'
    ? `Completed a ${fmtDuration(hours)} focus session on ${subject}`
    : `Logged ${fmtDuration(hours)} of ${subject}`;
  addActivity(source === 'timer' ? 'fa-bullseye' : 'fa-clock', 'sky', text);
  saveState();
  renderStats();
  renderActivity();
  updateCharts();
  showToast(`${fmtDuration(hours)} of ${subject} added to ${DAYS_LONG[dayIdx]}.`);
}
 
function handleLogSubmit(event) {
  event.preventDefault();
  const subject = $('#logSubject').value;
  const dayIdx = Number($('#logDay').value);
  const hours = parseFloat($('#logHours').value);
 
  if (!SUBJECTS.includes(subject) || !(dayIdx >= 0 && dayIdx <= 6)) {
    showToast('Pick a subject and a day.', 'error');
    return;
  }
  if (!Number.isFinite(hours) || hours < 0.25 || hours > 12) {
    showToast('Enter study time between 0.25 and 12 hours.', 'error');
    $('#logHours').focus();
    return;
  }
 
  logStudy(subject, dayIdx, hours, 'manual');
  closeModal($('#logModal'));
  $('#logHours').value = '1';
}
 
/* ==========================================================================
   5. ANALYTICS CHARTS (Chart.js)
   ========================================================================== */
 
let trendChart = null;
let subjectChart = null;
 
function initCharts() {
  if (typeof Chart === 'undefined') {
    // Chart.js CDN failed to load (offline). Explain instead of leaving blank boxes.
    ['trendChart', 'subjectChart'].forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas && canvas.parentElement) {
        canvas.parentElement.innerHTML = '<p class="grid h-full place-items-center text-center text-sm text-slate-400">Charts could not load. Check your internet connection and refresh.</p>';
      }
    });
    return;
  }
 
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
  Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.12)';
 
  const tooltip = {
    backgroundColor: 'rgba(12, 18, 38, 0.96)',
    borderColor: 'rgba(129, 140, 248, 0.45)',
    borderWidth: 1,
    padding: 12,
    titleColor: '#e0e7ff',
    bodyColor: '#cbd5e1'
  };
 
  trendChart = new Chart($('#trendChart'), {
    type: 'bar',
    data: {
      labels: DAYS_SHORT,
      datasets: SUBJECTS.map(sub => ({
        label: sub,
        data: [...state.hours[sub]],
        backgroundColor: SUBJECT_COLORS[sub],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 38
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } },
        tooltip: {
          ...tooltip,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${round2(ctx.parsed.y)} h`,
            footer: items => `Total: ${round1(items.reduce((sum, i) => sum + i.parsed.y, 0))} h`
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { callback: value => `${value}h` } }
      }
    }
  });
 
  subjectChart = new Chart($('#subjectChart'), {
    type: 'doughnut',
    data: {
      labels: SUBJECTS,
      datasets: [{
        data: subjectTotals().map(round2),
        backgroundColor: SUBJECTS.map(sub => SUBJECT_COLORS[sub]),
        borderColor: 'rgba(12, 18, 38, 0.9)',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 14 } },
        tooltip: {
          ...tooltip,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              return ` ${ctx.label}: ${round1(ctx.parsed)} h (${Math.round((ctx.parsed / total) * 100)}%)`;
            }
          }
        }
      }
    }
  });
}
 
// Pushes the latest state into both charts with an animated transition
function updateCharts() {
  if (trendChart) {
    trendChart.data.datasets.forEach((dataset, i) => {
      dataset.data = [...state.hours[SUBJECTS[i]]];
    });
    trendChart.update();
  }
  if (subjectChart) {
    subjectChart.data.datasets[0].data = subjectTotals().map(round2);
    subjectChart.update();
  }
}
 
/* ==========================================================================
   6. FOCUS TIMER
   ========================================================================== */
 
const RING_CIRCUMFERENCE = 2 * Math.PI * 70;
const timer = { total: 25 * 60, remaining: 25 * 60, running: false, endAt: 0, intervalId: null };
const BASE_TITLE = document.title;
 
function fmtClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
 
function renderTimer() {
  $('#timerDisplay').textContent = fmtClock(timer.remaining);
  $('#timerRing').style.strokeDashoffset = String(RING_CIRCUMFERENCE * (timer.remaining / timer.total));
 
  const elapsed = timer.total - timer.remaining;
  $('#timerStatus').textContent = timer.running ? 'Focusing. Stay with it!' : (elapsed > 0 ? 'Paused' : 'Ready to focus');
  $('#timerStart').innerHTML = timer.running
    ? '<i class="fa-solid fa-pause"></i> Pause'
    : `<i class="fa-solid fa-play"></i> ${elapsed > 0 ? 'Resume' : 'Start'}`;
 
  // Presets can only change while the timer is stopped
  $$('#timerPresets .chip').forEach(chip => { chip.disabled = timer.running; });
  document.title = timer.running ? `${fmtClock(timer.remaining)} Focus | CampusSphere` : BASE_TITLE;
}
 
function stopTimerInterval() {
  if (timer.intervalId) clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.running = false;
}
 
function tickTimer() {
  timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
  if (timer.remaining === 0) {
    finishTimer(true);
    return;
  }
  renderTimer();
}
 
function toggleTimer() {
  if (timer.running) {
    timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
    stopTimerInterval();
  } else {
    if (timer.remaining <= 0) return;
    timer.running = true;
    timer.endAt = Date.now() + timer.remaining * 1000;
    timer.intervalId = setInterval(tickTimer, 250);
  }
  renderTimer();
}
 
function resetTimer() {
  stopTimerInterval();
  timer.remaining = timer.total;
  renderTimer();
}
 
function setTimerPreset(minutes) {
  if (timer.running) return;
  timer.total = minutes * 60;
  timer.remaining = timer.total;
  $$('#timerPresets .chip').forEach(chip => chip.classList.toggle('active', Number(chip.dataset.min) === minutes));
  renderTimer();
}
 
// Ends the session and logs the time that was actually focused
function finishTimer(auto = false) {
  if (timer.running) {
    timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
  }
  const elapsed = timer.total - timer.remaining;
  if (!auto && elapsed < 60) {
    showToast('Focus for at least one minute before logging a session.', 'info');
    return;
  }
  stopTimerInterval();
  const subject = $('#timerSubject').value;
  const hours = round2(elapsed / 3600);
  timer.remaining = timer.total;
  renderTimer();
  if (hours > 0) logStudy(subject, todayIndex(), hours, 'timer');
}
 
/* ==========================================================================
   7. AI NOTES SUMMARIZER (client-side extractive simulator)
   ========================================================================== */
 
let summarizing = false;
let lastResult = null; // { title, format, points, keywords, saved }
 
// Cleans raw notes into a list of sentences (bullets and line breaks count as boundaries)
function splitSentences(text) {
  const normalized = text
    .replace(/\r/g, '')
    .split(/\n+/)
    .map(line => line.trim().replace(/^(?:[-*\u2022]|\d+[.)])\s+/, '').trim())
    .filter(Boolean)
    .map(line => (/[.!?]["')\]]*$/.test(line) ? line : `${line}.`))
    .join(' ')
    .replace(/\s+/g, ' ');
  const parts = normalized.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) || [];
  return parts.map(s => s.trim()).filter(s => s.split(' ').length >= 5);
}
 
// Lowercase content words with a tiny plural stemmer
function tokenize(sentence) {
  const words = sentence.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
  return words
    .filter(word => !STOPWORDS.has(word))
    .map(word => (word.length > 4 && word.endsWith('s') && !/(ss|is|us)$/.test(word) ? word.slice(0, -1) : word));
}
 
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
 
// Scores sentences by word frequency and returns the top ones in their original order
function summarize(text, length, format) {
  const sentences = splitSentences(text);
  const frequency = {};
  sentences.forEach(sentence => tokenize(sentence).forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  }));
  const maxFrequency = Math.max(1, ...Object.values(frequency));
 
  const scored = sentences.map((sentence, index) => {
    const words = tokenize(sentence);
    const base = words.reduce((sum, word) => sum + frequency[word] / maxFrequency, 0) / Math.sqrt(words.length || 1);
    const positionBoost = index === 0 ? 1.25 : (index === sentences.length - 1 ? 1.1 : 1);
    return { sentence, index, score: base * positionBoost };
  });
 
  const targets = { brief: 2, standard: 4, detailed: 6 };
  const target = Math.max(1, Math.min(targets[length] || 4, Math.ceil(sentences.length * 0.6)));
  const picked = scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, target)
    .sort((a, b) => a.index - b.index)
    .map(item => capitalize(item.sentence));
 
  const keywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 6)
    .map(([word]) => capitalize(word));
 
  const fallback = ['this topic', 'the main idea', 'a real example'];
  const k = index => (keywords[index] || fallback[index]).toLowerCase();
  const questions = [
    `How would you explain "${k(0)}" to a classmate in two sentences?`,
    `What is the relationship between ${k(1)} and ${k(2)}?`,
    `Where would you apply ${k(3)} in a real project or exam question?`
  ];
 
  const originalWords = countWords(text);
  const summaryWords = countWords(picked.join(' '));
  const reduction = Math.max(0, Math.round((1 - summaryWords / originalWords) * 100));
  const minutesSaved = Math.max(1, Math.ceil((originalWords - summaryWords) / 200));
 
  return {
    points: format === 'bullets' ? picked : [picked.join(' ')],
    keywords,
    questions,
    originalWords,
    summaryWords,
    reduction,
    minutesSaved
  };
}
 
function makeTitle(text) {
  const firstLine = text.trim().split(/\n/)[0].replace(/^(?:[-*\u2022]|\d+[.)])\s+/, '');
  const words = firstLine.split(/\s+/).slice(0, 6).join(' ').replace(/[.,;:!?]+$/, '');
  return words.length < firstLine.length ? `${words}...` : words;
}
 
function setSummaryView(view) {
  $('#summaryEmpty').classList.toggle('hidden', view !== 'empty');
  $('#summaryLoading').classList.toggle('hidden', view !== 'loading');
  $('#summaryResult').classList.toggle('hidden', view !== 'result');
}
 
function renderLoadingSteps(activeIndex) {
  $('#loadingSteps').innerHTML = SUMMARY_STEPS.map((label, i) => {
    const status = i < activeIndex ? 'done' : (i === activeIndex ? 'active' : 'pending');
    const icon = status === 'done'
      ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>'
      : status === 'active'
        ? '<i class="fa-solid fa-circle-notch fa-spin text-indigo-300"></i>'
        : '<i class="fa-regular fa-circle"></i>';
    return `<li class="step-row step-${status}">${icon}<span>${label}</span></li>`;
  }).join('');
  $('#loadingBar').style.width = `${Math.round((activeIndex / SUMMARY_STEPS.length) * 100)}%`;
}
 
function renderSummaryResult(result, format) {
  $('#summaryStats').innerHTML = `
    <span class="tag tag-match"><i class="fa-solid fa-compress"></i>${result.originalWords} words to ${result.summaryWords}</span>
    <span class="tag"><i class="fa-solid fa-scissors"></i>${result.reduction}% shorter</span>
    <span class="tag"><i class="fa-solid fa-hourglass-half"></i>About ${result.minutesSaved} min of reading saved</span>`;
 
  const body = $('#summaryBody');
  if (format === 'bullets') {
    body.innerHTML = `<ul class="space-y-3">${result.points.map((point, i) => `
      <li class="reveal-item flex gap-3" style="animation-delay:${i * 120}ms">
        <span class="bullet-dot"></span><span>${escapeHtml(point)}</span>
      </li>`).join('')}</ul>`;
  } else {
    body.innerHTML = `<p class="reveal-item">${escapeHtml(result.points[0])}</p>`;
  }
 
  $('#keywordList').innerHTML = result.keywords
    .map(word => `<span class="tag tag-match">${escapeHtml(word)}</span>`).join('');
  $('#questionList').innerHTML = result.questions.map((q, i) => `
    <li class="reveal-item flex gap-3 rounded-xl bg-white/5 px-4 py-3" style="animation-delay:${(i + 3) * 120}ms">
      <i class="fa-solid fa-circle-question mt-0.5 text-violet-300"></i><span>${escapeHtml(q)}</span>
    </li>`).join('');
}
 
function setGenerateLoading(isLoading) {
  const btn = $('#generateBtn');
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing your notes...'
    : '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate summary';
}
 
function setResultActions(enabled, saved = false) {
  $('#copyBtn').disabled = !enabled;
  const saveBtn = $('#saveBtn');
  saveBtn.disabled = !enabled || saved;
  saveBtn.innerHTML = saved
    ? '<i class="fa-solid fa-circle-check"></i> Saved'
    : '<i class="fa-solid fa-bookmark"></i> Save';
}
 
async function runSummary() {
  if (summarizing) return;
  const text = $('#notesInput').value.trim();
  const words = countWords(text);
 
  if (words < 40) {
    showToast(`Add at least 40 words of notes (you have ${words}).`, 'error');
    $('#notesInput').focus();
    return;
  }
 
  const length = $('#summaryLength').value;
  const format = $('#summaryFormat').value;
 
  summarizing = true;
  setGenerateLoading(true);
  setResultActions(false);
  setSummaryView('loading');
 
  // Simulated multi-step AI pipeline so the interface feels alive
  for (let i = 0; i < SUMMARY_STEPS.length; i++) {
    renderLoadingSteps(i);
    await sleep(520);
  }
  renderLoadingSteps(SUMMARY_STEPS.length);
  await sleep(250);
 
  const result = summarize(text, length, format);
  lastResult = { title: makeTitle(text), format, points: result.points, keywords: result.keywords, saved: false };
 
  renderSummaryResult(result, format);
  setSummaryView('result');
  setResultActions(true);
  setGenerateLoading(false);
  summarizing = false;
 
  state.notesCount += 1;
  addActivity('fa-file-lines', 'indigo', `Summarized "${lastResult.title}"`);
  saveState();
  renderStats();
  renderActivity();
  showToast('Summary ready. Copy it or save it to your library.');
}
 
async function copySummary() {
  if (!lastResult) return;
  const text = lastResult.format === 'bullets'
    ? lastResult.points.map(p => `- ${p}`).join('\n')
    : lastResult.points.join('\n');
  const ok = await copyText(`${lastResult.title}\n\n${text}`);
  showToast(ok ? 'Summary copied to clipboard.' : 'Copy failed. Select the text and copy it manually.', ok ? 'success' : 'error');
}
 
function saveSummary() {
  if (!lastResult || lastResult.saved) return;
  state.library.unshift({
    id: Date.now(),
    title: lastResult.title,
    savedAt: Date.now(),
    format: lastResult.format,
    points: lastResult.points,
    keywords: lastResult.keywords.slice(0, 3)
  });
  lastResult.saved = true;
  addActivity('fa-bookmark', 'fuchsia', `Saved "${lastResult.title}" to your library`);
  saveState();
  setResultActions(true, true);
  renderLibrary();
  renderActivity();
  showToast('Saved to your library.');
}
 
function renderLibrary() {
  $('#libraryCount').textContent = state.library.length;
  const list = $('#libraryList');
  if (state.library.length === 0) {
    list.innerHTML = `
      <div class="rounded-2xl border border-dashed border-white/15 p-8 text-center">
        <p class="font-semibold">Nothing saved yet</p>
        <p class="mt-1 text-sm text-slate-400">Generate a summary and choose Save to keep it here.</p>
      </div>`;
    return;
  }
  list.innerHTML = state.library.map(item => {
    const content = item.format === 'bullets'
      ? `<ul class="mt-3 space-y-2 text-sm text-slate-300">${item.points.map(p => `<li class="flex gap-3"><span class="bullet-dot"></span><span>${escapeHtml(p)}</span></li>`).join('')}</ul>`
      : `<p class="mt-3 text-sm text-slate-300">${escapeHtml(item.points.join(' '))}</p>`;
    return `
      <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="font-display font-semibold">${escapeHtml(item.title)}</h4>
            <p class="text-xs text-slate-500">Saved ${formatDate(item.savedAt)}</p>
          </div>
          <div class="flex gap-2">
            <button class="btn-ghost btn-sm" data-action="copy-saved" data-id="${item.id}" aria-label="Copy summary"><i class="fa-solid fa-copy"></i></button>
            <button class="btn-ghost btn-sm" data-action="delete-saved" data-id="${item.id}" aria-label="Delete summary"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        ${content}
        <div class="mt-3 flex flex-wrap gap-2">${(item.keywords || []).map(k => `<span class="tag tag-match">${escapeHtml(k)}</span>`).join('')}</div>
      </article>`;
  }).join('');
}
 
async function copySavedSummary(id) {
  const item = state.library.find(entry => entry.id === id);
  if (!item) return;
  const body = item.format === 'bullets' ? item.points.map(p => `- ${p}`).join('\n') : item.points.join('\n');
  const ok = await copyText(`${item.title}\n\n${body}`);
  showToast(ok ? 'Summary copied to clipboard.' : 'Copy failed. Select the text and copy it manually.', ok ? 'success' : 'error');
}
 
function deleteSavedSummary(id) {
  state.library = state.library.filter(entry => entry.id !== id);
  saveState();
  renderLibrary();
  showToast('Summary removed from your library.', 'info');
}
 
/* ==========================================================================
   8. PEER SKILL-EXCHANGE FINDER
   ========================================================================== */
 
const filters = { query: '', category: 'All', availableOnly: false, sort: 'match' };
let connectPeerId = null;
let messageEdited = false;
 
// Match score: peers who teach what you want and want what you teach rank highest
function computeMatch(peer) {
  const wantsHit = peer.teaches.filter(skill => ME.wants.includes(skill));
  const teachHit = peer.wants.filter(skill => ME.teaches.includes(skill));
  const score = Math.min(98, 30 + wantsHit.length * 24 + teachHit.length * 14 + (peer.available ? 4 : 0));
  return { score, wantsHit, teachHit };
}
PEERS.forEach(peer => { peer.match = computeMatch(peer); });
 
const findPeer = id => PEERS.find(peer => peer.id === id);
const initials = name => name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
 
function getFilteredPeers() {
  const query = filters.query.trim().toLowerCase();
  const list = PEERS.filter(peer => {
    if (filters.availableOnly && !peer.available) return false;
    if (filters.category !== 'All' && !peer.teaches.some(skill => SKILL_CATEGORY[skill] === filters.category)) return false;
    if (query) {
      const haystack = [peer.name, peer.major, peer.bio, ...peer.teaches, ...peer.wants].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
  const sorters = {
    match: (a, b) => b.match.score - a.match.score,
    rating: (a, b) => b.rating - a.rating || b.sessions - a.sessions,
    sessions: (a, b) => b.sessions - a.sessions
  };
  return list.sort(sorters[filters.sort] || sorters.match);
}
 
function skillTags(skills, matched, matchClass) {
  return skills.map(skill => matched.includes(skill)
    ? `<span class="tag ${matchClass}"><i class="fa-solid fa-bolt"></i>${escapeHtml(skill)}</span>`
    : `<span class="tag">${escapeHtml(skill)}</span>`).join('');
}
 
function peerCardHtml(peer, animate, index) {
  const requested = Boolean(state.requests[peer.id]);
  const m = peer.match;
  const mutual = m.wantsHit.length > 0 && m.teachHit.length > 0;
  const delay = animate ? `style="animation-delay:${Math.min(index, 8) * 60}ms"` : '';
  return `
    <article class="glass glow-hover flex flex-col p-5 ${animate ? 'reveal-item' : ''}" ${delay}>
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${peer.gradient} font-bold">${initials(peer.name)}</span>
          <div>
            <h3 class="font-display font-semibold leading-tight">${escapeHtml(peer.name)}</h3>
            <p class="text-xs text-slate-400">${escapeHtml(peer.major)}, year ${peer.year}</p>
          </div>
        </div>
        <div class="match-ring" style="background:conic-gradient(#a78bfa ${m.score * 3.6}deg, rgba(255,255,255,.09) 0)" title="${m.score}% match">
          <span>${m.score}%</span>
        </div>
      </div>
 
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span class="inline-flex items-center gap-1.5">
          <i class="fa-solid fa-circle text-[.45rem] ${peer.available ? 'text-emerald-400' : 'text-slate-500'}"></i>${peer.available ? 'Available now' : 'Busy this week'}
        </span>
        <span><i class="fa-solid fa-star text-amber-400"></i> ${peer.rating.toFixed(1)} (${peer.sessions} sessions)</span>
        ${mutual ? '<span class="font-semibold text-violet-300"><i class="fa-solid fa-arrows-rotate"></i> Mutual match</span>' : ''}
      </div>
 
      <p class="mt-4 text-xs font-semibold text-slate-400">Can teach</p>
      <div class="mt-1.5 flex flex-wrap gap-1.5">${skillTags(peer.teaches, m.wantsHit, 'tag-match')}</div>
 
      <p class="mt-3 text-xs font-semibold text-slate-400">Wants to learn</p>
      <div class="mt-1.5 flex flex-wrap gap-1.5">${skillTags(peer.wants, m.teachHit, 'tag-want')}</div>
 
      <div class="mt-auto grid grid-cols-2 gap-2 pt-5">
        <button class="btn-ghost btn-sm" data-action="profile" data-id="${peer.id}"><i class="fa-solid fa-user"></i> Profile</button>
        <button class="${requested ? 'btn-ghost' : 'btn-primary'} btn-sm" data-action="connect" data-id="${peer.id}" ${requested ? 'disabled' : ''}>
          ${requested ? '<i class="fa-solid fa-circle-check"></i> Requested' : '<i class="fa-solid fa-handshake"></i> Connect'}
        </button>
      </div>
    </article>`;
}
 
function renderPeers(animate = false) {
  const list = getFilteredPeers();
  $('#peerGrid').innerHTML = list.map((peer, i) => peerCardHtml(peer, animate, i)).join('');
  $('#peerEmpty').classList.toggle('hidden', list.length > 0);
  $('#peerGrid').classList.toggle('hidden', list.length === 0);
  $('#peerCount').textContent = `Showing ${list.length} of ${PEERS.length} peers`;
}
 
function renderCategoryChips() {
  $('#categoryChips').innerHTML = CATEGORIES.map(category => `
    <button class="chip ${filters.category === category ? 'active' : ''}" data-category="${escapeHtml(category)}">
      <i class="fa-solid ${CATEGORY_ICONS[category]}"></i>${escapeHtml(category)}
    </button>`).join('');
}
 
function renderMyProfileLine() {
  $('#myProfileLine').innerHTML = `
    <i class="fa-solid fa-bolt text-indigo-300"></i> You can teach <span class="text-slate-200">${ME.teaches.map(escapeHtml).join(', ')}</span>
    and want to learn <span class="text-slate-200">${ME.wants.map(escapeHtml).join(', ')}</span>.`;
}
 
function resetPeerFilters() {
  filters.query = '';
  filters.category = 'All';
  filters.availableOnly = false;
  filters.sort = 'match';
  $('#peerSearch').value = '';
  $('#peerSort').value = 'match';
  const toggle = $('#availableToggle');
  toggle.classList.remove('active');
  toggle.setAttribute('aria-checked', 'false');
  renderCategoryChips();
  renderPeers();
}
 
/* ----- Peer profile modal ----- */
function openProfile(id) {
  const peer = findPeer(id);
  if (!peer) return;
  const m = peer.match;
  const requested = Boolean(state.requests[peer.id]);
  $('#profileBody').innerHTML = `
    <div class="flex items-center gap-4">
      <span id="profileTitle" class="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${peer.gradient} text-xl font-bold">${initials(peer.name)}</span>
      <div>
        <h3 class="font-display text-2xl font-bold">${escapeHtml(peer.name)}</h3>
        <p class="text-sm text-slate-400">${escapeHtml(peer.major)}, year ${peer.year}</p>
      </div>
    </div>
 
    <div class="mt-5 grid grid-cols-3 gap-3 text-center">
      <div class="rounded-xl bg-white/5 p-3"><p class="font-display text-xl font-bold">${m.score}%</p><p class="text-xs text-slate-400">Match</p></div>
      <div class="rounded-xl bg-white/5 p-3"><p class="font-display text-xl font-bold">${peer.rating.toFixed(1)}</p><p class="text-xs text-slate-400">Rating</p></div>
      <div class="rounded-xl bg-white/5 p-3"><p class="font-display text-xl font-bold">${peer.sessions}</p><p class="text-xs text-slate-400">Sessions</p></div>
    </div>
 
    <p class="mt-5 text-sm leading-relaxed text-slate-300">${escapeHtml(peer.bio)}</p>
 
    <p class="mt-5 text-xs font-semibold text-slate-400">Can teach</p>
    <div class="mt-1.5 flex flex-wrap gap-1.5">${skillTags(peer.teaches, m.wantsHit, 'tag-match')}</div>
    <p class="mt-4 text-xs font-semibold text-slate-400">Wants to learn</p>
    <div class="mt-1.5 flex flex-wrap gap-1.5">${skillTags(peer.wants, m.teachHit, 'tag-want')}</div>
    <p class="mt-4 text-xs font-semibold text-slate-400">Open time slots</p>
    <div class="mt-1.5 flex flex-wrap gap-1.5">${peer.slots.map(slot => `<span class="tag"><i class="fa-regular fa-clock"></i>${escapeHtml(slot)}</span>`).join('')}</div>
 
    <button class="${requested ? 'btn-ghost' : 'btn-primary'} mt-6 w-full" data-action="connect" data-id="${peer.id}" ${requested ? 'disabled' : ''}>
      ${requested ? '<i class="fa-solid fa-circle-check"></i> Request sent' : '<i class="fa-solid fa-handshake"></i> Request a session'}
    </button>`;
  openModal('profileModal');
}
 
/* ----- Connect modal ----- */
function defaultConnectMessage(peer, skill) {
  const firstName = peer.name.split(' ')[0];
  const offer = peer.match.teachHit[0] || ME.teaches[0];
  return `Hi ${firstName}, I would love to learn ${skill} from you. In return I can help you with ${offer}. Does one of your open slots work?`;
}
 
function openConnect(id) {
  const peer = findPeer(id);
  if (!peer || state.requests[peer.id]) return;
  connectPeerId = peer.id;
  messageEdited = false;
 
  $('#connectAvatar').textContent = initials(peer.name);
  $('#connectAvatar').className = `grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${peer.gradient} font-bold`;
  $('#connectTitle').textContent = `Request a session with ${peer.name.split(' ')[0]}`;
  $('#connectPeerMeta').textContent = `${peer.major}, ${peer.match.score}% match`;
 
  const orderedSkills = [...peer.match.wantsHit, ...peer.teaches.filter(s => !peer.match.wantsHit.includes(s))];
  $('#connectSkill').innerHTML = orderedSkills.map(skill => `<option value="${escapeHtml(skill)}">${escapeHtml(skill)}</option>`).join('');
  $('#connectSlot').innerHTML = peer.slots.map(slot => `<option value="${escapeHtml(slot)}">${escapeHtml(slot)}</option>`).join('');
  $('#connectMessage').value = defaultConnectMessage(peer, orderedSkills[0]);
  openModal('connectModal');
}
 
function handleConnectSubmit(event) {
  event.preventDefault();
  const peer = findPeer(connectPeerId);
  if (!peer) return;
  const skill = $('#connectSkill').value;
  const slot = $('#connectSlot').value;
  const message = $('#connectMessage').value.trim();
 
  if (message.length < 10) {
    showToast('Write a short message so your peer knows what you need.', 'error');
    $('#connectMessage').focus();
    return;
  }
 
  state.requests[peer.id] = { skill, slot, message, ts: Date.now() };
  addActivity('fa-handshake', 'violet', `Requested ${skill} help from ${peer.name}`);
  saveState();
  closeModal($('#connectModal'));
  renderPeers();
  renderStats();
  renderActivity();
  showToast(`Request sent to ${peer.name}. Proposed time: ${slot}.`);
}
 
/* ==========================================================================
   9. NAVIGATION, GLOBAL EVENTS AND BOOTSTRAP
   ========================================================================== */
 
function populateSelects() {
  const subjectOptions = SUBJECTS.map(sub => `<option value="${escapeHtml(sub)}">${escapeHtml(sub)}</option>`).join('');
  $('#logSubject').innerHTML = subjectOptions;
  $('#timerSubject').innerHTML = subjectOptions;
  $('#logDay').innerHTML = DAYS_LONG.map((day, i) => `<option value="${i}">${day}</option>`).join('');
  $('#logDay').value = String(todayIndex());
}
 
function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = $$('.nav-link[data-section]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.dataset.section === entry.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['dashboard', 'analytics', 'notes', 'peers'].forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
 
function bindEvents() {
  /* --- Mobile menu --- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  menuToggle.addEventListener('click', () => {
    const opening = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !opening);
    mobileMenu.classList.toggle('flex', opening);
    menuToggle.setAttribute('aria-expanded', String(opening));
  });
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
 
  /* --- Modals: open, close, backdrop, Escape --- */
  $$('[data-open-modal]').forEach(btn => btn.addEventListener('click', () => {
    openModal(btn.dataset.openModal);
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
  }));
  $$('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-close-modal]')) closeModal(modal);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllModals();
  });
 
  /* --- Log session form --- */
  $('#logForm').addEventListener('submit', handleLogSubmit);
  $('#logQuick').addEventListener('click', event => {
    const chip = event.target.closest('[data-hours]');
    if (chip) $('#logHours').value = chip.dataset.hours;
  });
 
  /* --- Focus timer --- */
  $('#timerStart').addEventListener('click', toggleTimer);
  $('#timerReset').addEventListener('click', resetTimer);
  $('#timerFinish').addEventListener('click', () => finishTimer(false));
  $('#timerPresets').addEventListener('click', event => {
    const chip = event.target.closest('[data-min]');
    if (chip) setTimerPreset(Number(chip.dataset.min));
  });
 
  /* --- AI summarizer --- */
  const notesInput = $('#notesInput');
  notesInput.addEventListener('input', () => {
    const words = countWords(notesInput.value);
    $('#wordCount').textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
  });
  $('#sampleBtn').addEventListener('click', () => {
    notesInput.value = SAMPLE_NOTES;
    notesInput.dispatchEvent(new Event('input'));
    showToast('Sample notes loaded. Press Generate summary.', 'info');
  });
  $('#clearNotesBtn').addEventListener('click', () => {
    notesInput.value = '';
    notesInput.dispatchEvent(new Event('input'));
    if (!summarizing) {
      lastResult = null;
      setSummaryView('empty');
      setResultActions(false);
    }
    notesInput.focus();
  });
  $('#generateBtn').addEventListener('click', runSummary);
  $('#copyBtn').addEventListener('click', copySummary);
  $('#saveBtn').addEventListener('click', saveSummary);
 
  /* --- Peer finder: live filters --- */
  $('#peerSearch').addEventListener('input', event => {
    filters.query = event.target.value;
    renderPeers();
  });
  $('#peerSort').addEventListener('change', event => {
    filters.sort = event.target.value;
    renderPeers();
  });
  $('#availableToggle').addEventListener('click', event => {
    filters.availableOnly = !filters.availableOnly;
    event.currentTarget.classList.toggle('active', filters.availableOnly);
    event.currentTarget.setAttribute('aria-checked', String(filters.availableOnly));
    renderPeers();
  });
  $('#categoryChips').addEventListener('click', event => {
    const chip = event.target.closest('[data-category]');
    if (!chip) return;
    filters.category = chip.dataset.category;
    renderCategoryChips();
    renderPeers();
  });
  $('#clearFilters').addEventListener('click', resetPeerFilters);
 
  /* --- Connect form and message tracking --- */
  $('#connectForm').addEventListener('submit', handleConnectSubmit);
  $('#connectMessage').addEventListener('input', () => { messageEdited = true; });
  $('#connectSkill').addEventListener('change', event => {
    const peer = findPeer(connectPeerId);
    if (peer && !messageEdited) $('#connectMessage').value = defaultConnectMessage(peer, event.target.value);
  });
 
  /* --- Delegated actions (peer cards, profile modal, library) --- */
  document.addEventListener('click', event => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const id = Number(actionEl.dataset.id);
    switch (actionEl.dataset.action) {
      case 'profile': openProfile(id); break;
      case 'connect': closeAllModals(); openConnect(id); break;
      case 'copy-saved': copySavedSummary(id); break;
      case 'delete-saved': deleteSavedSummary(id); break;
      default: break;
    }
  });
 
  /* --- Reset demo data --- */
  $('#resetBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all CampusSphere demo data to its starting state?')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    state = createDefaultState();
    lastResult = null;
    setSummaryView('empty');
    setResultActions(false);
    resetTimer();
    resetPeerFilters();
    renderAll();
    updateCharts();
    showToast('Demo data reset.', 'info');
  });
}
 
function renderAll() {
  renderGreeting();
  renderStats();
  renderActivity();
  renderLibrary();
  renderPeers();
}
 
function init() {
  populateSelects();
  bindEvents();
  renderCategoryChips();
  renderMyProfileLine();
  $('#timerRing').style.strokeDasharray = String(RING_CIRCUMFERENCE);
  renderAll();
  renderPeers(true);
  renderTimer();
  initCharts();
  initScrollSpy();
  // Keep "2 min ago" labels fresh
  setInterval(renderActivity, 60000);
}
 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
 