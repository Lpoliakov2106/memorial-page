// Shared utilities for Memorial Page
// Used by both index.html and profile.html

// ============================================
// localStorage Keys
// ============================================
const STORAGE_KEYS = {
    PAGES_LIST: 'memorial_pages_list',
    PAGE_PREFIX: 'memorial_page_'
};

// ============================================
// Navigation Functions
// ============================================

function navigateToProfile(pageId) {
    window.location.href = `profile.html?id=${pageId}`;
}

function navigateToList() {
    window.location.href = 'index.html';
}

function getProfileIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ============================================
// localStorage Management
// ============================================

function getAllPages() {
    const pagesJson = localStorage.getItem(STORAGE_KEYS.PAGES_LIST);
    return pagesJson ? JSON.parse(pagesJson) : [];
}

function savePagesList(pages) {
    localStorage.setItem(STORAGE_KEYS.PAGES_LIST, JSON.stringify(pages));
}

function getPageById(id) {
    const pageJson = localStorage.getItem(STORAGE_KEYS.PAGE_PREFIX + id);
    return pageJson ? JSON.parse(pageJson) : null;
}

function savePage(pageData) {
    // Save the full page data
    localStorage.setItem(STORAGE_KEYS.PAGE_PREFIX + pageData.id, JSON.stringify(pageData));

    // Update the pages list
    const pages = getAllPages();
    const existingIndex = pages.findIndex(p => p.id === pageData.id);

    const listEntry = {
        id: pageData.id,
        name: pageData.person.name,
        years: pageData.person.years,
        photo: pageData.person.photo,
        createdAt: pageData.createdAt || Date.now(),
        lastModified: Date.now()
    };

    if (existingIndex >= 0) {
        pages[existingIndex] = listEntry;
    } else {
        pages.push(listEntry);
    }

    savePagesList(pages);
}

function deletePage(id) {
    // Remove from pages list
    const pages = getAllPages();
    const filteredPages = pages.filter(p => p.id !== id);
    savePagesList(filteredPages);

    // Remove full page data
    localStorage.removeItem(STORAGE_KEYS.PAGE_PREFIX + id);
}

function createNewPage() {
    const id = generateId();
    const newPage = {
        id: id,
        person: {
            id: 'main',
            name: 'Новая страница памяти',
            years: '',
            quote: '',
            bio: '',
            location: '',
            roleSummary: {
                role: '',
                loved: '',
                keyMemory: ''
            },
            photo: null
        },
        timeline: {
            birth: { date: '', place: '' },
            education: [],
            career: [],
            family: []
        },
        relatives: [],
        createdAt: Date.now(),
        lastModified: Date.now()
    };

    savePage(newPage);
    return id;
}

// ============================================
// Helper Functions
// ============================================

function generateId() {
    return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================================
// Demo Data
// ============================================

function getDemoData() {
    return {
        id: 'demo_page_' + Date.now(),
        person: {
            id: 'main',
            name: 'Анна Ивановна Смирнова',
            years: '1945–2023',
            quote: 'Жизнь прекрасна, когда ты умеешь радоваться малому',
            location: 'Москва, Россия',
            bio: 'Родилась 7 октября 1945 года в послевоенной Москве. Всю свою жизнь посвятила преподаванию русского языка и литературы. Более 40 лет проработала в школе №127, где стала любимым учителем для нескольких поколений учеников.',
            roleSummary: {
                role: 'Учитель русского языка и литературы высшей категории. Наставник молодых педагогов. Автор методических пособий.',
                loved: 'Читать классическую литературу, особенно Пушкина и Чехова. Ухаживать за садом на даче. Готовить пироги по бабушкиным рецептам. Проводить время с внуками.',
                keyMemory: 'Её доброта, мудрость и безграничное терпение. Умение находить общий язык с каждым ребёнком. Искренняя любовь к своему делу и людям.'
            },
            photo: null
        },
        timeline: {
            birth: {
                date: '07.10.1945',
                place: 'Москва'
            },
            education: [
                {
                    years: '1963–1968',
                    institution: 'МГУ им. М.В. Ломоносова',
                    details: 'Филологический факультет, кафедра русского языка'
                }
            ],
            career: [
                {
                    years: '1968–2010',
                    position: 'Учитель русского языка и литературы',
                    company: 'Школа №127 г. Москвы',
                    details: 'Учитель высшей категории, заслуженный педагог'
                }
            ],
            family: [
                {
                    years: '1970–2023',
                    members: 'Супруг: Смирнов Пётр Николаевич',
                    note: 'Прожили вместе 53 года'
                },
                {
                    years: '1971–н.в.',
                    members: 'Дочь: Елена Петровна Волкова',
                    note: ''
                },
                {
                    years: '1995–н.в.',
                    members: 'Внуки: Дмитрий и Анастасия',
                    note: ''
                }
            ]
        },
        relatives: [
            {
                id: 'rel_1',
                name: 'Пётр Николаевич Смирнов',
                relation: 'партнёр',
                years: '1943–2020',
                photo: null,
                note: 'Супруг'
            },
            {
                id: 'rel_2',
                name: 'Елена Петровна Волкова',
                relation: 'дочь',
                years: '1971',
                photo: null,
                note: ''
            },
            {
                id: 'rel_3',
                name: 'Дмитрий Волков',
                relation: 'внук',
                years: '1995',
                photo: null,
                note: ''
            },
            {
                id: 'rel_4',
                name: 'Анастасия Волкова',
                relation: 'внучка',
                years: '1998',
                photo: null,
                note: ''
            }
        ],
        createdAt: Date.now(),
        lastModified: Date.now()
    };
}

function initializeDemoDataIfNeeded() {
    const pages = getAllPages();
    if (pages.length === 0) {
        // Create demo page
        const demoData = getDemoData();
        savePage(demoData);
        return demoData.id;
    }
    return null;
}

// ============================================
// Export/Import Functions
// ============================================

function exportAllData() {
    const pages = getAllPages();
    const allData = {
        pages: pages,
        fullData: {}
    };

    pages.forEach(page => {
        allData.fullData[page.id] = getPageById(page.id);
    });

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memorial_pages_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function importAllData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        if (data.pages && data.fullData) {
            // Save pages list
            savePagesList(data.pages);

            // Save each full page
            Object.keys(data.fullData).forEach(pageId => {
                localStorage.setItem(STORAGE_KEYS.PAGE_PREFIX + pageId, JSON.stringify(data.fullData[pageId]));
            });

            return { success: true, count: data.pages.length };
        } else {
            return { success: false, error: 'Неверный формат данных' };
        }
    } catch (e) {
        return { success: false, error: 'Ошибка парсинга JSON: ' + e.message };
    }
}
