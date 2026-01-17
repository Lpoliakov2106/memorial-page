/**
 * Memorial Page - MVP
 * Структура данных:
 *
 * @typedef {Object} Person
 * @property {string} id
 * @property {string} name
 * @property {string} years - например "1950–2024"
 * @property {string} quote
 * @property {string} bio
 * @property {Object} roleSummary
 * @property {string} roleSummary.role
 * @property {string} roleSummary.loved
 * @property {string} roleSummary.keyMemory
 * @property {string|null} photo - URL или base64
 *
 * @typedef {Object} Relative
 * @property {string} id
 * @property {string} name
 * @property {'мать'|'отец'|'партнёр'|'сын'|'дочь'|'брат'|'сестра'|'внук'|'внучка'|'другое'} relation
 * @property {string} [years]
 * @property {string|null} [photo]
 * @property {string} [note]
 *
 * @typedef {Object} MemorialData
 * @property {Person} person
 * @property {Relative[]} relatives
 */

// ============================================
// Состояние приложения
// ============================================

const STORAGE_KEY = 'memorial_page_data';

let currentData = {
    person: null,
    relatives: []
};

// ============================================
// Демо-данные
// ============================================

function getDemoData() {
    return {
        person: {
            id: 'main',
            name: 'Анна Ивановна Смирнова',
            years: '1945–2023',
            quote: 'Жизнь прекрасна, когда ты умеешь радоваться малому',
            bio: 'Анна Ивановна родилась в небольшом городе на Урале. Всю жизнь посвятила педагогике, работала учителем русского языка и литературы в школе.\n\nОна воспитала троих детей и помогала растить пятерых внуков. Была человеком добрым, отзывчивым и мудрым.',
            roleSummary: {
                role: 'Учитель русского языка и литературы, мать троих детей, бабушка пятерых внуков',
                loved: 'Читать классическую литературу, ухаживать за цветами, готовить пироги для семьи, гулять в парке',
                keyMemory: 'Её доброта, мудрость и умение находить радость в простых вещах. Способность поддержать и утешить словом.'
            },
            photo: null
        },
        relatives: [
            {
                id: 'rel-1',
                name: 'Иван Петрович Смирнов',
                relation: 'партнёр',
                years: '1943–2018',
                photo: null,
                note: 'Прожили вместе 55 лет'
            },
            {
                id: 'rel-2',
                name: 'Мария Петровна',
                relation: 'мать',
                years: '1920–1998',
                photo: null,
                note: ''
            },
            {
                id: 'rel-3',
                name: 'Пётр Николаевич',
                relation: 'отец',
                years: '1918–1995',
                photo: null,
                note: ''
            },
            {
                id: 'rel-4',
                name: 'Елена Ивановна',
                relation: 'дочь',
                years: '1968',
                photo: null,
                note: 'Старшая дочь'
            },
            {
                id: 'rel-5',
                name: 'Дмитрий Иванович',
                relation: 'сын',
                years: '1971',
                photo: null,
                note: ''
            },
            {
                id: 'rel-6',
                name: 'Ольга Ивановна',
                relation: 'дочь',
                years: '1975',
                photo: null,
                note: 'Младшая дочь'
            },
            {
                id: 'rel-7',
                name: 'Александр',
                relation: 'внук',
                years: '1992',
                photo: null,
                note: ''
            },
            {
                id: 'rel-8',
                name: 'Екатерина',
                relation: 'внучка',
                years: '1995',
                photo: null,
                note: ''
            },
            {
                id: 'rel-9',
                name: 'Михаил',
                relation: 'внук',
                years: '1998',
                photo: null,
                note: ''
            },
            {
                id: 'rel-10',
                name: 'Анастасия',
                relation: 'внучка',
                years: '2001',
                photo: null,
                note: ''
            }
        ]
    };
}

// ============================================
// Работа с localStorage
// ============================================

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    } catch (e) {
        console.error('Ошибка сохранения данных:', e);
    }
}

function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.person && parsed.person.name) {
                currentData = parsed;
                return true;
            }
        }
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
    }

    // Если данных нет или они некорректны, загружаем демо-данные
    currentData = getDemoData();
    saveData();
    return false;
}

function resetToDemo() {
    if (confirm('Вы уверены, что хотите сбросить все данные и загрузить демо-версию?')) {
        currentData = getDemoData();
        saveData();
        render();
    }
}

// ============================================
// Рендеринг Hero-блока
// ============================================

function renderHero() {
    const person = currentData.person;

    const photoEl = document.getElementById('heroPhoto');
    const nameEl = document.getElementById('heroName');
    const yearsEl = document.getElementById('heroYears');
    const quoteEl = document.getElementById('heroQuote');

    if (person.photo) {
        photoEl.src = person.photo;
        photoEl.alt = `Фотография ${person.name}`;
        photoEl.classList.remove('photo-placeholder');
    } else {
        photoEl.src = '';
        photoEl.alt = 'Добавьте фото';
        photoEl.classList.add('photo-placeholder');
    }

    nameEl.textContent = person.name || 'Добавьте имя, чтобы начать';
    if (!person.name) {
        nameEl.classList.add('empty-state');
    } else {
        nameEl.classList.remove('empty-state');
    }

    yearsEl.textContent = person.years || '';

    quoteEl.textContent = person.quote || 'Добавьте короткое послание или цитату';
    if (!person.quote) {
        quoteEl.classList.add('empty-state');
    } else {
        quoteEl.classList.remove('empty-state');
    }
}

// ============================================
// Рендеринг раздела "О человеке"
// ============================================

function renderAbout() {
    const person = currentData.person;

    const bioEl = document.getElementById('bioText');
    const roleEl = document.getElementById('bioRole');
    const lovedEl = document.getElementById('bioLoved');
    const memoryEl = document.getElementById('bioMemory');

    bioEl.textContent = person.bio || 'Заполните описание';
    bioEl.className = person.bio ? 'bio-text' : 'bio-text empty-state';

    roleEl.textContent = person.roleSummary.role || 'Расскажите, кем был(а)…';
    roleEl.className = person.roleSummary.role ? '' : 'empty-state';

    lovedEl.textContent = person.roleSummary.loved || 'Напишите, что он/она особенно любил(а)…';
    lovedEl.className = person.roleSummary.loved ? '' : 'empty-state';

    memoryEl.textContent = person.roleSummary.keyMemory || 'Поделитесь тем, что важно сохранить в памяти';
    memoryEl.className = person.roleSummary.keyMemory ? '' : 'empty-state';
}

// ============================================
// Рендеринг семейного дерева
// ============================================

function renderFamilyTree() {
    const container = document.getElementById('familyTree');

    if (currentData.relatives.length === 0) {
        container.innerHTML = '<p class="empty-state">Добавьте близких в дерево</p>';
        return;
    }

    // Группируем родственников по типу связи
    const grouped = {
        parents: currentData.relatives.filter(r => r.relation === 'мать' || r.relation === 'отец'),
        partner: currentData.relatives.filter(r => r.relation === 'партнёр'),
        siblings: currentData.relatives.filter(r => r.relation === 'брат' || r.relation === 'сестра'),
        children: currentData.relatives.filter(r => r.relation === 'сын' || r.relation === 'дочь'),
        grandchildren: currentData.relatives.filter(r => r.relation === 'внук' || r.relation === 'внучка'),
        other: currentData.relatives.filter(r => r.relation === 'другое')
    };

    let html = '<div class="tree-container">';

    // Родители
    if (grouped.parents.length > 0) {
        html += '<div class="tree-level">';
        grouped.parents.forEach(rel => {
            html += createTreeNode(rel);
        });
        html += '</div>';
    }

    // Средний уровень: сиблинги, главное лицо, партнёр
    html += '<div class="tree-level">';

    grouped.siblings.forEach(rel => {
        html += createTreeNode(rel);
    });

    // Главное лицо
    html += `
        <div class="tree-node main-person">
            ${currentData.person.photo ? `<img src="${currentData.person.photo}" class="tree-node-photo" alt="${currentData.person.name}">` : ''}
            <div class="tree-node-name">${currentData.person.name}</div>
            <div class="tree-node-years">${currentData.person.years || ''}</div>
        </div>
    `;

    grouped.partner.forEach(rel => {
        html += createTreeNode(rel);
    });

    html += '</div>';

    // Дети
    if (grouped.children.length > 0) {
        html += '<div class="tree-level">';
        grouped.children.forEach(rel => {
            html += createTreeNode(rel);
        });
        html += '</div>';
    }

    // Внуки
    if (grouped.grandchildren.length > 0) {
        html += '<div class="tree-level">';
        grouped.grandchildren.forEach(rel => {
            html += createTreeNode(rel);
        });
        html += '</div>';
    }

    // Другие
    if (grouped.other.length > 0) {
        html += '<div class="tree-level">';
        grouped.other.forEach(rel => {
            html += createTreeNode(rel);
        });
        html += '</div>';
    }

    html += '</div>';

    container.innerHTML = html;

    // Добавляем обработчики кликов на узлы
    container.querySelectorAll('.tree-node:not(.main-person)').forEach(node => {
        node.addEventListener('click', (e) => {
            const relId = node.dataset.relativeId;
            openRelativeModal(relId);
        });
    });
}

function createTreeNode(relative) {
    return `
        <div class="tree-node" data-relative-id="${relative.id}">
            ${relative.photo ? `<img src="${relative.photo}" class="tree-node-photo" alt="${relative.name}">` : ''}
            <div class="tree-node-name">${relative.name}</div>
            <div class="tree-node-relation">${relative.relation}</div>
            ${relative.years ? `<div class="tree-node-years">${relative.years}</div>` : ''}
        </div>
    `;
}

// ============================================
// Полный рендеринг страницы
// ============================================

function render() {
    renderHero();
    renderAbout();
    renderFamilyTree();
}

// ============================================
// Модальные окна
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');

    // Устанавливаем фокус на первый элемент формы
    setTimeout(() => {
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Закрытие по клику вне модального окна
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Закрытие по кнопке
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal.id);
    });
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ============================================
// Редактирование профиля
// ============================================

document.getElementById('editProfileBtn').addEventListener('click', () => {
    const person = currentData.person;

    document.getElementById('profileName').value = person.name || '';
    document.getElementById('profileYears').value = person.years || '';
    document.getElementById('profileQuote').value = person.quote || '';
    document.getElementById('profilePhoto').value = person.photo || '';

    openModal('editProfileModal');
});

document.getElementById('editProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('profileName').value.trim();

    if (!name) {
        alert('Пожалуйста, укажите имя');
        return;
    }

    currentData.person.name = name;
    currentData.person.years = document.getElementById('profileYears').value.trim();
    currentData.person.quote = document.getElementById('profileQuote').value.trim();
    currentData.person.photo = document.getElementById('profilePhoto').value.trim() || null;

    saveData();
    render();
    closeModal('editProfileModal');
});

// ============================================
// Редактирование раздела "О человеке"
// ============================================

document.getElementById('editAboutBtn').addEventListener('click', () => {
    const person = currentData.person;

    document.getElementById('aboutBio').value = person.bio || '';
    document.getElementById('aboutRole').value = person.roleSummary.role || '';
    document.getElementById('aboutLoved').value = person.roleSummary.loved || '';
    document.getElementById('aboutMemory').value = person.roleSummary.keyMemory || '';

    openModal('editAboutModal');
});

document.getElementById('editAboutForm').addEventListener('submit', (e) => {
    e.preventDefault();

    currentData.person.bio = document.getElementById('aboutBio').value.trim();
    currentData.person.roleSummary.role = document.getElementById('aboutRole').value.trim();
    currentData.person.roleSummary.loved = document.getElementById('aboutLoved').value.trim();
    currentData.person.roleSummary.keyMemory = document.getElementById('aboutMemory').value.trim();

    saveData();
    render();
    closeModal('editAboutModal');
});

// ============================================
// Добавление/редактирование родственника
// ============================================

document.getElementById('addRelativeBtn').addEventListener('click', () => {
    openRelativeModal(null);
});

function openRelativeModal(relativeId) {
    const form = document.getElementById('editRelativeForm');
    const title = document.getElementById('editRelativeTitle');
    const deleteBtn = document.getElementById('deleteRelativeBtn');

    if (relativeId) {
        // Редактирование
        const relative = currentData.relatives.find(r => r.id === relativeId);

        if (!relative) return;

        title.textContent = 'Редактировать родственника';
        document.getElementById('relativeId').value = relative.id;
        document.getElementById('relativeName').value = relative.name;
        document.getElementById('relativeRelation').value = relative.relation;
        document.getElementById('relativeYears').value = relative.years || '';
        document.getElementById('relativePhoto').value = relative.photo || '';
        document.getElementById('relativeNote').value = relative.note || '';

        deleteBtn.style.display = 'inline-block';
    } else {
        // Добавление
        title.textContent = 'Добавить родственника';
        form.reset();
        document.getElementById('relativeId').value = '';
        deleteBtn.style.display = 'none';
    }

    openModal('editRelativeModal');
}

document.getElementById('editRelativeForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('relativeName').value.trim();
    const relation = document.getElementById('relativeRelation').value;

    if (!name) {
        alert('Пожалуйста, укажите имя');
        return;
    }

    if (!relation) {
        alert('Пожалуйста, выберите тип связи');
        return;
    }

    const relativeId = document.getElementById('relativeId').value;

    const relativeData = {
        id: relativeId || 'rel-' + Date.now(),
        name: name,
        relation: relation,
        years: document.getElementById('relativeYears').value.trim(),
        photo: document.getElementById('relativePhoto').value.trim() || null,
        note: document.getElementById('relativeNote').value.trim()
    };

    if (relativeId) {
        // Обновление существующего
        const index = currentData.relatives.findIndex(r => r.id === relativeId);
        if (index !== -1) {
            currentData.relatives[index] = relativeData;
        }
    } else {
        // Добавление нового
        currentData.relatives.push(relativeData);
    }

    saveData();
    render();
    closeModal('editRelativeModal');
});

document.getElementById('deleteRelativeBtn').addEventListener('click', () => {
    if (!confirm('Вы уверены, что хотите удалить этого родственника?')) {
        return;
    }

    const relativeId = document.getElementById('relativeId').value;
    currentData.relatives = currentData.relatives.filter(r => r.id !== relativeId);

    saveData();
    render();
    closeModal('editRelativeModal');
});

// ============================================
// Импорт/экспорт JSON
// ============================================

document.getElementById('exportBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'memorial-page-export.json';
    a.click();

    URL.revokeObjectURL(url);
});

document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importJson').value = '';
    openModal('importModal');
});

document.getElementById('importConfirmBtn').addEventListener('click', () => {
    const jsonStr = document.getElementById('importJson').value.trim();

    if (!jsonStr) {
        alert('Пожалуйста, вставьте JSON данные');
        return;
    }

    try {
        const imported = JSON.parse(jsonStr);

        // Минимальная валидация
        if (!imported.person || !imported.person.name) {
            alert('Не удалось прочитать данные. Проверьте, что вы вставили корректный JSON.');
            return;
        }

        if (!Array.isArray(imported.relatives)) {
            imported.relatives = [];
        }

        currentData = imported;
        saveData();
        render();
        closeModal('importModal');

    } catch (e) {
        alert('Не удалось прочитать данные. Проверьте, что вы вставили корректный JSON.');
    }
});

// ============================================
// Сброс данных
// ============================================

document.getElementById('resetBtn').addEventListener('click', resetToDemo);

// ============================================
// Режим просмотра
// ============================================

document.getElementById('viewModeToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('view-mode');
    } else {
        document.body.classList.remove('view-mode');
    }
});

// ============================================
// Печать
// ============================================

document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// ============================================
// Инициализация
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    render();
});
