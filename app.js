// ============================================================
// app.js — Fase 4: Countdown, Nested Subbab, Accordion Logic
// ============================================================

let coursesData = [];
let progressData = JSON.parse(localStorage.getItem('courseProgress')) || {};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    fetchData();
});

// ============================================================
// SECTION 1: Countdown Timer (Target: 3 Agustus 2026)
// ============================================================
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const target = new Date('2026-08-03T00:00:00').getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
        setCountdownDisplay(0, 0, 0, 0);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdownDisplay(days, hours, minutes, seconds);
}

function setCountdownDisplay(d, h, m, s) {
    const pad = (n) => String(n).padStart(2, '0');
    const dEl = document.getElementById('countdown-days');
    const hEl = document.getElementById('countdown-hours');
    const mEl = document.getElementById('countdown-minutes');
    const sEl = document.getElementById('countdown-seconds');

    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
}

// ============================================================
// SECTION 2: Fetch & Render
// ============================================================
async function fetchData() {
    try {
        const response = await fetch('data_materi.json');
        if (!response.ok) throw new Error('Gagal mengambil data materi');
        coursesData = await response.json();

        renderCards(coursesData);
        updateProgress();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// ============================================================
// SECTION 3: Card Rendering with Accordion
// ============================================================
function renderCards(data) {
    const levelGrids = {
        1: document.getElementById('level-grid-1'),
        2: document.getElementById('level-grid-2'),
        3: document.getElementById('level-grid-3'),
        4: document.getElementById('level-grid-4'),
        5: document.getElementById('level-grid-5'),
    };

    data.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group';
        card.id = `card-${course.id}`;

        const babsHtml = course.topik_inti.map((bab, babIdx) => {
            const babId = `${course.id}_bab${babIdx}`;
            const subbabHtml = bab.subbab.map((sub, subIdx) => {
                const subId = `${course.id}_${babIdx}_${subIdx}`;
                const isChecked = progressData[subId] ? 'checked' : '';
                return `
                    <label class="flex items-start gap-2.5 cursor-pointer group/label py-0.5">
                        <input type="checkbox" id="cb_${subId}" data-course="${course.id}" data-sub="${subId}" class="peer topic-checkbox subbab-checkbox" ${isChecked}>
                        <span class="text-xs text-neutral-500 font-medium leading-tight peer-checked:text-neutral-400 peer-checked:line-through transition-all select-none pt-0.5">
                            ${sub.nama}
                        </span>
                    </label>
                `;
            }).join('');

            return `
                <div class="bab-section" data-bab-id="${babId}">
                    <button type="button" class="accordion-toggle" data-target="${babId}">
                        <span class="bab-label">${bab.nama_bab}</span>
                        <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="accordion-content" id="acc-${babId}">
                        ${subbabHtml}
                    </div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <h3 class="text-lg font-bold text-neutral-800 leading-tight">${course.nama_mk}</h3>
                <div class="flex flex-col items-end shrink-0">
                    <span class="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Sem ${course.semester_asal}</span>
                    <span class="text-xs font-bold text-orange-600 mt-1">${course.sks_total} SKS</span>
                </div>
            </div>
            <div class="flex flex-col gap-0 mt-1">
                ${babsHtml}
            </div>
        `;

        if (levelGrids[course.level]) {
            levelGrids[course.level].appendChild(card);
        }
    });
}

// ============================================================
// SECTION 4: Accordion Toggle
// ============================================================
document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.accordion-toggle');
    if (!toggle) return;

    const targetId = toggle.getAttribute('data-target');
    const content = document.getElementById(`acc-${targetId}`);
    if (!content) return;

    toggle.classList.toggle('active');
    content.classList.toggle('open');
});

// ============================================================
// SECTION 5: Checkbox Change Handler
// ============================================================
document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('subbab-checkbox')) {
        const subId = e.target.getAttribute('data-sub');
        progressData[subId] = e.target.checked;
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
        updateProgress();
    }
});

// ============================================================
// SECTION 6: Progress Calculation (Subbab-based)
// ============================================================
function updateProgress() {
    let totalSKS = 0;
    let totalSubbab = 0;
    let totalCompletedSubbab = 0;
    let totalCourses = coursesData.length;
    let totalCompletedCourses = 0;

    const levelStats = {
        1: { subbab: 0, completed: 0 },
        2: { subbab: 0, completed: 0 },
        3: { subbab: 0, completed: 0 },
        4: { subbab: 0, completed: 0 },
        5: { subbab: 0, completed: 0 }
    };

    coursesData.forEach(course => {
        totalSKS += course.sks_total;
        let courseSubbabTotal = 0;
        let courseSubbabDone = 0;

        course.topik_inti.forEach((bab, babIdx) => {
            let babDone = 0;
            bab.subbab.forEach((sub, subIdx) => {
                const subId = `${course.id}_${babIdx}_${subIdx}`;
                courseSubbabTotal++;
                if (progressData[subId]) {
                    courseSubbabDone++;
                    babDone++;
                }
            });

            // Mark bab label as completed if all subbab done
            updateBabLabel(course.id, babIdx, babDone === bab.subbab.length && bab.subbab.length > 0);
        });

        totalSubbab += courseSubbabTotal;
        totalCompletedSubbab += courseSubbabDone;

        if (levelStats[course.level]) {
            levelStats[course.level].subbab += courseSubbabTotal;
            levelStats[course.level].completed += courseSubbabDone;
        }

        // Highlight completed course card
        const card = document.getElementById(`card-${course.id}`);
        if (courseSubbabDone === courseSubbabTotal && courseSubbabTotal > 0) {
            totalCompletedCourses++;
            if (card) card.classList.add('ring-2', 'ring-orange-400', 'bg-orange-50/50');
        } else {
            if (card) card.classList.remove('ring-2', 'ring-orange-400', 'bg-orange-50/50');
        }
    });

    updateGlobalUI(totalSubbab, totalCompletedSubbab, totalCourses, totalCompletedCourses, totalSKS);
    updateLevelUI(levelStats);
}

function updateBabLabel(courseId, babIdx, isComplete) {
    const babId = `${courseId}_bab${babIdx}`;
    const section = document.querySelector(`[data-bab-id="${babId}"]`);
    if (!section) return;
    const label = section.querySelector('.bab-label');
    if (!label) return;

    if (isComplete) {
        label.classList.add('bab-completed');
    } else {
        label.classList.remove('bab-completed');
    }
}

function updateGlobalUI(totalSubbab, completedSubbab, totalCourses, completedCourses, totalSKS) {
    const pct = totalSubbab > 0 ? Math.round((completedSubbab / totalSubbab) * 100) : 0;

    const el = (id) => document.getElementById(id);

    const pctEl = el('global-percentage');
    if (pctEl) pctEl.textContent = `${pct}%`;

    const pbEl = el('global-progress-bar');
    if (pbEl) pbEl.style.width = `${pct}%`;

    const countEl = el('global-count');
    if (countEl) countEl.textContent = `${completedSubbab} / ${totalSubbab} Subbab`;

    const coursesEl = el('global-courses-count');
    if (coursesEl) coursesEl.textContent = `${completedCourses} / ${totalCourses} Matkul Selesai`;

    const sksEl = el('stat-total-sks');
    if (sksEl) sksEl.textContent = `${totalSKS} SKS`;

    const mkEl = el('stat-total-mk');
    if (mkEl) mkEl.textContent = `${totalCourses} MK`;
}

function updateLevelUI(levelStats) {
    let prevLevelPercent = 100; // Level 1 always unlocked

    for (let lvl = 1; lvl <= 5; lvl++) {
        const stats = levelStats[lvl];
        const pct = stats.subbab > 0 ? Math.round((stats.completed / stats.subbab) * 100) : 0;

        const pb = document.getElementById(`level-progress-bar-${lvl}`);
        if (pb) pb.style.width = `${pct}%`;

        const pt = document.getElementById(`level-percentage-${lvl}`);
        if (pt) pt.textContent = `${pct}%`;

        // Unlock logic
        const container = document.getElementById(`level-container-${lvl}`);
        const badge = document.getElementById(`lock-badge-${lvl}`);

        if (lvl > 1) {
            if (prevLevelPercent >= 80) {
                if (container) container.classList.remove('level-locked');
                if (badge) badge.style.display = 'none';
            } else {
                if (container) container.classList.add('level-locked');
                if (badge) badge.style.display = 'flex';
            }
        }

        prevLevelPercent = pct;
    }
}
