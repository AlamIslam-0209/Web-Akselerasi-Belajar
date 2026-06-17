let coursesData = [];
let progressData = JSON.parse(localStorage.getItem('courseProgress')) || {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

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
        card.className = `course-card rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group`;
        card.id = `card-${course.id}`;

        let topicsHtml = course.topik_inti.map((topic, i) => {
            const topicId = `${course.id}_${i}`;
            const isChecked = progressData[topicId] ? 'checked' : '';
            return `
                <label class="flex items-start gap-2.5 cursor-pointer group/label">
                    <input type="checkbox" id="checkbox_${topicId}" data-course="${course.id}" data-topic="${topicId}" class="peer topic-checkbox" ${isChecked}>
                    <span class="text-sm text-neutral-600 font-medium leading-tight peer-checked:text-neutral-450 peer-checked:line-through transition-all select-none pt-0.5">
                        ${topic}
                    </span>
                </label>
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
            <div class="flex flex-col gap-2.5 mt-2">
                ${topicsHtml}
            </div>
        `;

        if (levelGrids[course.level]) {
            levelGrids[course.level].appendChild(card);
        }
    });
}

document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('topic-checkbox')) {
        const topicId = e.target.getAttribute('data-topic');
        progressData[topicId] = e.target.checked;
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
        updateProgress();
    }
});

function updateProgress() {
    let totalSKS = 0;
    let totalTopics = 0;
    let totalCompletedTopics = 0;
    let totalCourses = coursesData.length;
    let totalCompletedCourses = 0;

    let levelStats = {
        1: { topics: 0, completed: 0 },
        2: { topics: 0, completed: 0 },
        3: { topics: 0, completed: 0 },
        4: { topics: 0, completed: 0 },
        5: { topics: 0, completed: 0 }
    };

    coursesData.forEach(course => {
        totalSKS += course.sks_total;
        
        let courseTopics = course.topik_inti.length;
        let courseCompleted = 0;

        course.topik_inti.forEach((topic, i) => {
            const topicId = `${course.id}_${i}`;
            if (progressData[topicId]) {
                courseCompleted++;
            }
        });

        totalTopics += courseTopics;
        totalCompletedTopics += courseCompleted;

        if (levelStats[course.level]) {
            levelStats[course.level].topics += courseTopics;
            levelStats[course.level].completed += courseCompleted;
        }

        const card = document.getElementById(`card-${course.id}`);
        if (courseCompleted === courseTopics && courseTopics > 0) {
            totalCompletedCourses++;
            if (card) {
                card.classList.add('ring-2', 'ring-orange-400', 'bg-orange-50/50');
            }
        } else {
            if (card) {
                card.classList.remove('ring-2', 'ring-orange-400', 'bg-orange-50/50');
            }
        }
    });

    // Update Global Stats
    const globalPercent = totalTopics > 0 ? Math.round((totalCompletedTopics / totalTopics) * 100) : 0;
    
    const globalPercentEl = document.getElementById('global-percentage');
    if (globalPercentEl) globalPercentEl.innerText = `${globalPercent}%`;
    
    const globalPbEl = document.getElementById('global-progress-bar');
    if (globalPbEl) globalPbEl.style.width = `${globalPercent}%`;
    
    const globalCountEl = document.getElementById('global-count');
    if (globalCountEl) globalCountEl.innerText = `${totalCompletedTopics} / ${totalTopics} Topik`;
    
    const globalCoursesEl = document.getElementById('global-courses-count');
    if (globalCoursesEl) globalCoursesEl.innerText = `${totalCompletedCourses} / ${totalCourses} Matkul Selesai`;

    const statSksEl = document.getElementById('stat-total-sks');
    if (statSksEl) statSksEl.innerText = `${totalSKS} SKS`;
    
    const statMkEl = document.getElementById('stat-total-mk');
    if (statMkEl) statMkEl.innerText = `${totalCourses} MK`;

    // Update Levels
    let prevLevelPercent = 100; // Level 1 is always unlocked
    for (let lvl = 1; lvl <= 5; lvl++) {
        const stats = levelStats[lvl];
        const lvlPercent = stats.topics > 0 ? Math.round((stats.completed / stats.topics) * 100) : 0;
        
        const pb = document.getElementById(`level-progress-bar-${lvl}`);
        if (pb) pb.style.width = `${lvlPercent}%`;
        
        const pt = document.getElementById(`level-percentage-${lvl}`);
        if (pt) pt.innerText = `${lvlPercent}%`;

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

        prevLevelPercent = lvlPercent;
    }
}
