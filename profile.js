// Profile Page JavaScript
// Manages the individual memorial page view and editing

// ============================================
// Global Variables
// ============================================
let currentPageId = null;
let currentData = null;
let isEditMode = false;
let currentTimelineSection = null;

// ============================================
// Initialization
// ============================================

function initProfilePage() {
    // Get page ID from URL
    currentPageId = getProfileIdFromURL();

    if (!currentPageId) {
        // No ID provided, redirect to list
        navigateToList();
        return;
    }

    // Load page data
    currentData = getPageById(currentPageId);

    if (!currentData) {
        // Page not found, redirect to list
        alert('Страница не найдена');
        navigateToList();
        return;
    }

    // Update page title
    document.title = `${currentData.person.name} — Страница памяти`;

    // Render the page
    renderProfile();
    renderSidebar();
    renderBioTab();

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Edit mode toggle
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) {
        editModeBtn.addEventListener('click', toggleEditMode);
    }

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Edit Profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }

    // Edit Bio button
    const editBioBtn = document.getElementById('editBioBtn');
    if (editBioBtn) {
        editBioBtn.addEventListener('click', openEditBioModal);
    }

    // Edit Timeline buttons
    document.getElementById('editBirthBtn')?.addEventListener('click', () => openEditTimelineModal('birth'));
    document.getElementById('editEducationBtn')?.addEventListener('click', () => openEditTimelineModal('education'));
    document.getElementById('editCareerBtn')?.addEventListener('click', () => openEditTimelineModal('career'));
    document.getElementById('editFamilyBtn')?.addEventListener('click', () => openEditTimelineModal('family'));

    // Forms
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileSubmit);
    document.getElementById('bioForm')?.addEventListener('submit', handleBioSubmit);
    document.getElementById('timelineForm')?.addEventListener('submit', handleTimelineSubmit);
    document.getElementById('addTimelineItemBtn')?.addEventListener('click', addTimelineItem);

    // Delete confirmation
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', handleDeletePage);

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ============================================
// Edit Mode
// ============================================

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);

    const btn = document.getElementById('editModeBtn');
    if (btn) {
        btn.textContent = isEditMode ? 'Выйти из редактирования' : 'Режим редактирования';
        btn.classList.toggle('btn-primary', isEditMode);
        btn.classList.toggle('btn-secondary', !isEditMode);
    }
}

// ============================================
// Tabs
// ============================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
}

// ============================================
// Rendering
// ============================================

function renderProfile() {
    const person = currentData.person;

    // Photo
    const photoContainer = document.getElementById('profilePhotoContainer');
    if (photoContainer) {
        if (person.photo) {
            photoContainer.innerHTML = `<img src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            photoContainer.classList.remove('placeholder');
        } else {
            photoContainer.innerHTML = '👤';
            photoContainer.classList.add('placeholder');
        }
    }

    // Name
    const nameEl = document.getElementById('profileName');
    if (nameEl) {
        nameEl.textContent = person.name || 'Имя не указано';
    }

    // Years
    const yearsEl = document.getElementById('profileYears');
    if (yearsEl) {
        yearsEl.textContent = person.years || '';
    }

    // Location
    const locationEl = document.getElementById('profileLocation');
    if (locationEl) {
        locationEl.textContent = person.location || '';
    }
}

function renderSidebar() {
    const timeline = currentData.timeline || {};

    // Birth
    const birthInfo = document.getElementById('birthInfo');
    if (birthInfo) {
        if (timeline.birth && (timeline.birth.date || timeline.birth.place)) {
            birthInfo.innerHTML = `
                <p>${escapeHtml(timeline.birth.date || '')}${timeline.birth.date && timeline.birth.place ? ', ' : ''}${escapeHtml(timeline.birth.place || '')}</p>
            `;
        } else {
            birthInfo.innerHTML = '<p class="empty-state">Не указано</p>';
        }
    }

    // Education
    const educationInfo = document.getElementById('educationInfo');
    if (educationInfo) {
        if (timeline.education && timeline.education.length > 0) {
            educationInfo.innerHTML = timeline.education.map(item => `
                <div class="timeline-item">
                    <span class="years">${escapeHtml(item.years || '')}</span>
                    <span class="details">${escapeHtml(item.institution || item.details || '')}</span>
                </div>
            `).join('');
        } else {
            educationInfo.innerHTML = '<p class="empty-state">Не указано</p>';
        }
    }

    // Career
    const careerInfo = document.getElementById('careerInfo');
    if (careerInfo) {
        if (timeline.career && timeline.career.length > 0) {
            careerInfo.innerHTML = timeline.career.map(item => `
                <div class="timeline-item">
                    <span class="years">${escapeHtml(item.years || '')}</span>
                    <span class="details">${escapeHtml(item.position || '')}${item.position && item.company ? ' — ' : ''}${escapeHtml(item.company || '')}</span>
                </div>
            `).join('');
        } else {
            careerInfo.innerHTML = '<p class="empty-state">Не указано</p>';
        }
    }

    // Family
    const familyInfo = document.getElementById('familyInfo');
    if (familyInfo) {
        if (timeline.family && timeline.family.length > 0) {
            familyInfo.innerHTML = timeline.family.map(item => `
                <div class="timeline-item">
                    <span class="years">${escapeHtml(item.years || '')}</span>
                    <span class="details">${escapeHtml(item.members || '')}</span>
                </div>
            `).join('');
        } else {
            familyInfo.innerHTML = '<p class="empty-state">Не указано</p>';
        }
    }
}

function renderBioTab() {
    const person = currentData.person;
    const bioContent = document.getElementById('bioContent');

    if (!bioContent) return;

    let html = '';

    if (person.bio) {
        html += `<p>${escapeHtml(person.bio).replace(/\n/g, '<br>')}</p>`;
    }

    if (person.roleSummary) {
        if (person.roleSummary.role) {
            html += `<h4>Кем был(а)</h4><p>${escapeHtml(person.roleSummary.role)}</p>`;
        }
        if (person.roleSummary.loved) {
            html += `<h4>Что любил(а)</h4><p>${escapeHtml(person.roleSummary.loved)}</p>`;
        }
        if (person.roleSummary.keyMemory) {
            html += `<h4>Главное, что важно помнить</h4><p>${escapeHtml(person.roleSummary.keyMemory)}</p>`;
        }
    }

    if (!html) {
        html = '<p class="empty-state">Биография не добавлена</p>';
    }

    bioContent.innerHTML = html;
}

// ============================================
// Modals
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        const firstInput = modal.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function openEditProfileModal() {
    const person = currentData.person;

    document.getElementById('inputName').value = person.name || '';
    document.getElementById('inputYears').value = person.years || '';
    document.getElementById('inputLocation').value = person.location || '';
    document.getElementById('inputQuote').value = person.quote || '';
    document.getElementById('inputPhoto').value = person.photo || '';

    openModal('editProfileModal');
}

function openEditBioModal() {
    const person = currentData.person;

    document.getElementById('inputBio').value = person.bio || '';
    document.getElementById('inputRole').value = person.roleSummary?.role || '';
    document.getElementById('inputLoved').value = person.roleSummary?.loved || '';
    document.getElementById('inputKeyMemory').value = person.roleSummary?.keyMemory || '';

    openModal('editBioModal');
}

function openEditTimelineModal(section) {
    currentTimelineSection = section;
    const timeline = currentData.timeline || {};

    const titleEl = document.getElementById('editTimelineTitle');
    const container = document.getElementById('timelineFieldsContainer');
    const addBtn = document.getElementById('addTimelineItemBtn');

    // Set title based on section
    const titles = {
        birth: 'Редактировать дату рождения',
        education: 'Редактировать учёбу',
        career: 'Редактировать карьеру',
        family: 'Редактировать семью'
    };
    titleEl.textContent = titles[section] || 'Редактировать';

    // Clear container
    container.innerHTML = '';

    if (section === 'birth') {
        // Birth is a single item
        addBtn.style.display = 'none';
        const birth = timeline.birth || {};
        container.innerHTML = `
            <div class="form-group">
                <label>Дата рождения</label>
                <input type="text" name="date" value="${escapeHtml(birth.date || '')}" placeholder="07.10.1945">
            </div>
            <div class="form-group">
                <label>Место рождения</label>
                <input type="text" name="place" value="${escapeHtml(birth.place || '')}" placeholder="Москва">
            </div>
        `;
    } else {
        // Other sections are arrays
        addBtn.style.display = 'block';
        const items = timeline[section] || [];

        if (items.length === 0) {
            addTimelineItem();
        } else {
            items.forEach((item, index) => {
                addTimelineItemFields(item, index);
            });
        }
    }

    openModal('editTimelineModal');
}

function addTimelineItem() {
    const container = document.getElementById('timelineFieldsContainer');
    const index = container.children.length;
    addTimelineItemFields({}, index);
}

function addTimelineItemFields(item, index) {
    const container = document.getElementById('timelineFieldsContainer');

    const fieldsets = {
        education: `
            <div class="form-group">
                <label>Годы</label>
                <input type="text" name="years_${index}" value="${escapeHtml(item.years || '')}" placeholder="1963–1968">
            </div>
            <div class="form-group">
                <label>Учебное заведение</label>
                <input type="text" name="institution_${index}" value="${escapeHtml(item.institution || '')}" placeholder="МГУ им. М.В. Ломоносова">
            </div>
            <div class="form-group">
                <label>Детали</label>
                <input type="text" name="details_${index}" value="${escapeHtml(item.details || '')}" placeholder="Филологический факультет">
            </div>
        `,
        career: `
            <div class="form-group">
                <label>Годы</label>
                <input type="text" name="years_${index}" value="${escapeHtml(item.years || '')}" placeholder="1968–2010">
            </div>
            <div class="form-group">
                <label>Должность</label>
                <input type="text" name="position_${index}" value="${escapeHtml(item.position || '')}" placeholder="Учитель">
            </div>
            <div class="form-group">
                <label>Организация</label>
                <input type="text" name="company_${index}" value="${escapeHtml(item.company || '')}" placeholder="Школа №127">
            </div>
        `,
        family: `
            <div class="form-group">
                <label>Годы</label>
                <input type="text" name="years_${index}" value="${escapeHtml(item.years || '')}" placeholder="1970–2023">
            </div>
            <div class="form-group">
                <label>Члены семьи</label>
                <input type="text" name="members_${index}" value="${escapeHtml(item.members || '')}" placeholder="Супруг: Смирнов Пётр Николаевич">
            </div>
            <div class="form-group">
                <label>Примечание</label>
                <input type="text" name="note_${index}" value="${escapeHtml(item.note || '')}" placeholder="Прожили вместе 53 года">
            </div>
        `
    };

    const itemDiv = document.createElement('div');
    itemDiv.className = 'timeline-form-item';
    itemDiv.style.cssText = 'border: 1px solid #E0E6ED; border-radius: 8px; padding: 16px; margin-bottom: 16px; position: relative;';
    itemDiv.innerHTML = `
        <button type="button" class="remove-item-btn" style="position: absolute; top: 8px; right: 8px; background: none; border: none; cursor: pointer; font-size: 18px; color: #7F8C8D;">×</button>
        ${fieldsets[currentTimelineSection] || ''}
    `;

    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        itemDiv.remove();
    });

    container.appendChild(itemDiv);
}

// ============================================
// Form Handlers
// ============================================

function handleProfileSubmit(e) {
    e.preventDefault();

    currentData.person.name = document.getElementById('inputName').value.trim();
    currentData.person.years = document.getElementById('inputYears').value.trim();
    currentData.person.location = document.getElementById('inputLocation').value.trim();
    currentData.person.quote = document.getElementById('inputQuote').value.trim();
    currentData.person.photo = document.getElementById('inputPhoto').value.trim();

    saveCurrentPage();
    renderProfile();
    closeAllModals();
}

function handleBioSubmit(e) {
    e.preventDefault();

    currentData.person.bio = document.getElementById('inputBio').value.trim();

    if (!currentData.person.roleSummary) {
        currentData.person.roleSummary = {};
    }

    currentData.person.roleSummary.role = document.getElementById('inputRole').value.trim();
    currentData.person.roleSummary.loved = document.getElementById('inputLoved').value.trim();
    currentData.person.roleSummary.keyMemory = document.getElementById('inputKeyMemory').value.trim();

    saveCurrentPage();
    renderBioTab();
    closeAllModals();
}

function handleTimelineSubmit(e) {
    e.preventDefault();

    if (!currentData.timeline) {
        currentData.timeline = {};
    }

    if (currentTimelineSection === 'birth') {
        currentData.timeline.birth = {
            date: document.querySelector('input[name="date"]').value.trim(),
            place: document.querySelector('input[name="place"]').value.trim()
        };
    } else {
        const items = [];
        const container = document.getElementById('timelineFieldsContainer');
        const itemDivs = container.querySelectorAll('.timeline-form-item');

        itemDivs.forEach((div, index) => {
            const item = {};

            if (currentTimelineSection === 'education') {
                item.years = div.querySelector(`input[name="years_${index}"]`)?.value.trim() || '';
                item.institution = div.querySelector(`input[name="institution_${index}"]`)?.value.trim() || '';
                item.details = div.querySelector(`input[name="details_${index}"]`)?.value.trim() || '';
            } else if (currentTimelineSection === 'career') {
                item.years = div.querySelector(`input[name="years_${index}"]`)?.value.trim() || '';
                item.position = div.querySelector(`input[name="position_${index}"]`)?.value.trim() || '';
                item.company = div.querySelector(`input[name="company_${index}"]`)?.value.trim() || '';
            } else if (currentTimelineSection === 'family') {
                item.years = div.querySelector(`input[name="years_${index}"]`)?.value.trim() || '';
                item.members = div.querySelector(`input[name="members_${index}"]`)?.value.trim() || '';
                item.note = div.querySelector(`input[name="note_${index}"]`)?.value.trim() || '';
            }

            // Only add if has some data
            if (Object.values(item).some(v => v)) {
                items.push(item);
            }
        });

        currentData.timeline[currentTimelineSection] = items;
    }

    saveCurrentPage();
    renderSidebar();
    closeAllModals();
}

function handleDeletePage() {
    deletePage(currentPageId);
    navigateToList();
}

// ============================================
// Save
// ============================================

function saveCurrentPage() {
    currentData.lastModified = Date.now();
    savePage(currentData);
}

// ============================================
// Helpers
// ============================================

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', initProfilePage);
