// List Page JavaScript
// Manages the main page with NFT-style pages grid

// ============================================
// Global Variables
// ============================================
let allPages = [];
let currentSearchQuery = '';

// ============================================
// Initialization
// ============================================

function initListPage() {
    // Initialize demo data if no pages exist
    initializeDemoDataIfNeeded();

    // Load all pages
    allPages = getAllPages();

    // Render pages
    renderPageCards(allPages);

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Create button
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.addEventListener('click', handleCreateNewPage);
    }
}

// ============================================
// Search & Filter
// ============================================

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    currentSearchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filteredPages = filterPages(currentSearchQuery);
    renderPageCards(filteredPages);
}

function filterPages(query) {
    if (!query) {
        return allPages;
    }

    return allPages.filter(page => {
        const name = (page.name || '').toLowerCase();
        return name.includes(query);
    });
}

// ============================================
// Rendering
// ============================================

function renderPageCards(pages) {
    const grid = document.getElementById('pagesGrid');
    if (!grid) return;

    if (pages.length === 0) {
        if (currentSearchQuery) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 64px;">
                    <p style="font-size: 18px; margin-bottom: 16px; color: #F1F5F9;">По запросу «${escapeHtml(currentSearchQuery)}» ничего не найдено</p>
                    <button class="btn btn-secondary" onclick="clearSearch()">Сбросить поиск</button>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 64px;">
                    <p style="font-size: 18px; margin-bottom: 16px; color: #F1F5F9;">Коллекция пуста</p>
                    <p style="color: #94A3B8; margin-bottom: 24px;">Создайте первый токен памяти</p>
                </div>
            `;
        }
        return;
    }

    grid.innerHTML = pages.map((page, index) => createPageCard(page, index)).join('');

    // Add click handlers to cards
    grid.querySelectorAll('.page-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on favorite button
            if (e.target.closest('.favorite-btn')) return;

            const pageId = card.dataset.pageId;
            if (pageId) {
                navigateToProfile(pageId);
            }
        });
    });
}

function createPageCard(pageData, index) {
    const photoHtml = pageData.photo
        ? `<img src="${escapeHtml(pageData.photo)}" alt="${escapeHtml(pageData.name)}">`
        : `<span>👤</span>`;

    const photoClass = pageData.photo ? '' : 'placeholder';

    // Generate NFT-style token ID
    const tokenId = generateTokenId(pageData.id, index);

    return `
        <article class="page-card" data-page-id="${escapeHtml(pageData.id)}">
            <button class="favorite-btn" title="Добавить в избранное" aria-label="Добавить в избранное">♡</button>

            <div class="page-card-photo ${photoClass}">
                ${photoHtml}
            </div>

            <h3 class="page-card-name">${escapeHtml(pageData.name || 'Без имени')}</h3>
            <p class="page-card-years">${escapeHtml(pageData.years || '')}</p>

            <p class="page-card-token">#${tokenId}</p>

            <div class="page-card-actions">
                <button class="btn btn-primary" style="width: 100%;">Открыть токен</button>
            </div>
        </article>
    `;
}

// ============================================
// NFT Token ID Generator
// ============================================

function generateTokenId(id, index) {
    // Create a unique token ID from page ID
    const hash = hashCode(id);
    const tokenNum = Math.abs(hash % 10000).toString().padStart(4, '0');
    return `EMT-${tokenNum}`;
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

// ============================================
// Actions
// ============================================

function handleCreateNewPage() {
    const newPageId = createNewPage();
    navigateToProfile(newPageId);
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    currentSearchQuery = '';
    renderPageCards(allPages);
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

document.addEventListener('DOMContentLoaded', initListPage);
