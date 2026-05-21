import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let darkMode = false;
let equiposState = [];
let equiposOriginal = [];
let searchTimeoutId = null;
let currentModal = null;
let currentImageViewer = null;
let currentImageViewerScale = 1;
let currentImageViewerOffsetX = 0;
let currentImageViewerOffsetY = 0;
let imageViewerBaseOffsetX = 0;
let imageViewerBaseOffsetY = 0;
let isImageViewerPanning = false;
let imageViewerPanPointerId = null;
let imageViewerPanStartX = 0;
let imageViewerPanStartY = 0;
let imageViewerPanStartOffsetX = 0;
let imageViewerPanStartOffsetY = 0;

const IMAGE_VIEWER_MIN_SCALE = 1;
const IMAGE_VIEWER_MAX_SCALE = 4;
const IMAGE_VIEWER_SCALE_STEP = 0.25;

const organDisplayNames = {
    "Riñón": "Kidney",
    "Pelvis renal": "Renal pelvis",
    "Uréter": "Ureter",
    "Vejiga": "Bladder",
    "Testículo": "Testicle",
    "Pene": "Penis",
    "Próstata": "Prostate"
};

function getOrganDisplayName(organ) {
    return organDisplayNames[organ] || organ || "";
}

let planeamientosData = {};

async function loadPlaneamientos() {
    try {
        const snapshot = await getDocs(collection(db, "planeamientos"));
        const records = snapshot.docs
            .map((docItem, index) => normalizePlaneamientoRecord({ docId: docItem.id, ...docItem.data() }, index))
            .sort((a, b) => Number(a.id ?? a.orden ?? 0) - Number(b.id ?? b.orden ?? 0));
        planeamientosData = groupPlaneamientosByOrgan(records);
        return planeamientosData;
    } catch (error) {
        console.error("Error cargando planeamientos desde Firestore, usando JSON local:", error);
        try {
            const response = await fetch("./data/planeamientos.json");
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            planeamientosData = groupPlaneamientosByOrgan(flattenPlaneamientosLocal(data).sort((a, b) => Number(a.id ?? a.orden ?? 0) - Number(b.id ?? b.orden ?? 0)));
        } catch (localError) {
            console.error("Error cargando planeamientos localmente:", localError);
            planeamientosData = {};
        }
        return planeamientosData;
    }
}

function flattenPlaneamientosLocal(data) {
    if (!data || typeof data !== "object") {
        return [];
    }

    return Object.entries(data).flatMap(([organ, items]) => {
        if (!Array.isArray(items)) {
            return [];
        }

        return items.map((item, index) => normalizePlaneamientoRecord({
            ...item,
            organo: organ,
            docId: null
        }, index));
    });
}

function normalizePlaneamientoRecord(record, index = 0) {
    const etapas = typeof record.etapas === "object" && record.etapas ? record.etapas : parsePlaneamientoEtapas(record.etapas_json || record.etapas || {});

    return {
        docId: record.docId || null,
        id: record.id ?? index,
        titulo: record.titulo || record.nombre || "Sin título",
        organo: record.organo || record.categoria || "Sin órgano",
        tipo: record.tipo || "planeamiento-simple",
        resumen: record.resumen || record.descripcion_corta || etapas?.planeacion?.objetivo || "",
        etapas,
        orden: record.orden ?? record.id ?? index
    };
}

function groupPlaneamientosByOrgan(records) {
    const grouped = records.reduce((accumulator, record) => {
        const organ = record.organo || "Sin órgano";
        if (!accumulator[organ]) {
            accumulator[organ] = [];
        }

        accumulator[organ].push(record);
        return accumulator;
    }, {});

    Object.values(grouped).forEach((items) => {
        items.sort((a, b) => Number(a.id ?? a.orden ?? 0) - Number(b.id ?? b.orden ?? 0));
    });

    return grouped;
}

function parsePlaneamientoEtapas(value) {
    if (!value) {
        return {};
    }

    if (typeof value === "object") {
        return value;
    }

    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn("No se pudo parsear etapas de planeamiento:", error);
        }
    }

    return {};
}

const fallbackEquipos = [];

async function loadEquiposFromLocal() {
    try {
        const response = await fetch("./data/equipos.json");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const equipos = Array.isArray(data)
            ? data.map((item, index) => ({
                ...item,
                id: item.id ?? `local-${index + 1}`,
                orden: item.orden ?? item.id ?? index
            }))
            : [];

        return equipos;
    } catch (localError) {
        console.error("Error cargando equipos desde JSON local:", localError);
        return fallbackEquipos;
    }
}

    function toggleDarkMode() {
    darkMode = !darkMode;
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    return darkMode;
    }

async function loadEquipos() {
    try {
        const snapshot = await getDocs(collection(db, "equipos"));

        const equipos = snapshot.docs
        .map((docItem, index) => {
            const data = docItem.data();
            return {
            id: docItem.id,
            ...data,
            descripcion_corta: data.descripcion_corta ?? data.descripcioncorta ?? "",
            orden: data.orden ?? data.id ?? index
            };
        })
        .sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0));

        equiposOriginal = Array.isArray(equipos) ? equipos : [];
        equiposState = [...equiposOriginal];
        return equiposState;
    } catch (error) {
        console.error("Error cargando equipos desde Firestore:", error);
        const localEquipos = await loadEquiposFromLocal();
        equiposOriginal = Array.isArray(localEquipos)
        ? localEquipos.map((item, index) => ({
            ...item,
            descripcion_corta: item.descripcion_corta ?? item.descripcioncorta ?? "",
            orden: item.orden ?? item.id ?? index
            }))
        : [];
        equiposState = [...equiposOriginal];
        return equiposState;
    }
}

    function renderEquipos(equipos) {
    const grid = document.querySelector(".equipos-grid");
    if (!grid) {
        return;
    }

    const emptyState = document.querySelector(".empty-state");
    if (!equipos || equipos.length === 0) {
        grid.innerHTML = "";
        if (emptyState) {
        emptyState.hidden = false;
        }
        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    grid.innerHTML = equipos
        .map((equipo) => {
        const categoriaClass = `categoria-${normalizeText(equipo.categoria)}`;
        const varianteEtiqueta = equipo.variante ? `<p class="equipo-variant">${escapeHtml(equipo.variante)}</p>` : "";
        return `
            <article class="card equipo-card fade-in ${categoriaClass}" data-id="${equipo.id}">
            <div class="equipo-strip" aria-hidden="true"></div>
            ${equipo.mainImage ? `<div class="card-image-wrapper"><img class="card-image" src="${escapeHtml(equipo.mainImage)}" alt="${escapeHtml((equipo.nombre || "Instrumento") + " - imagen principal")}" loading="lazy" decoding="async" width="800" height="600"></div>` : ""}
            <div class="equipo-body">
                <span class="badge">${escapeHtml(equipo.categoria)}</span>
                <h3>${escapeHtml(equipo.nombre)}</h3>
                ${varianteEtiqueta}
                <p>${escapeHtml(equipo.descripcion_corta)}</p>
                <button class="btn btn-secondary equipo-more" type="button" data-equipo-id="${equipo.id}">Ver más</button>
            </div>
            </article>
        `;
        })
        .join("");

    const buttons = grid.querySelectorAll(".equipo-more");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
        const equipoId = button.dataset.equipoId;
        const equipo = equipos.find((item) => String(item.id) === String(equipoId));
        if (equipo) {
            openModal(equipo);
        }
        });
    });

    observeFadeIns();
    }

    function filterEquipos(categoria) {
    const searchInput = document.querySelector(".search-bar input");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const filtered = equiposOriginal.filter((equipo) => {
        const matchCategoria = categoria === "Todos" || equipo.categoria === categoria;
        const searchableText = `${equipo.nombre} ${equipo.variante || ""} ${equipo.categoria}`.toLowerCase();
        const matchQuery = !query || searchableText.includes(query);
        return matchCategoria && matchQuery;
    });

    equiposState = filtered;
    renderEquipos(filtered);
    }

    function openModal(equipo) {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    const title = modal.querySelector(".modal-title");
    const badge = modal.querySelector(".modal-badge");
    const definition = modal.querySelector(".modal-definition");
    const characteristics = modal.querySelector(".modal-characteristics");
    const parts = modal.querySelector(".modal-parts");
    const uses = modal.querySelector(".modal-uses");
    const functioning = modal.querySelector(".modal-functioning");
    const imagePlaceholder = modal.querySelector(".modal-image");

    if (title) {
        title.textContent = equipo.nombre;
    }
    if (badge) {
        badge.textContent = equipo.categoria;
    }
    if (definition) {
        definition.textContent = equipo.definicion || equipo.descripcion_larga || "";
    }
    if (characteristics) {
        characteristics.innerHTML = Array.isArray(equipo.caracteristicas)
        ? equipo.caracteristicas.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        : "";
    }
    if (parts) {
        const partsListHtml = Array.isArray(equipo.partes) ? equipo.partes.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "";
        if (equipo.partsImage) {
        const partsImgHtml = `
            <li class="parts-image-item">
                <p class="modal-parts-caption">Partes del instrumento</p>
                <img class="modal-parts-image" src="${escapeHtml(equipo.partsImage)}" alt="${escapeHtml((equipo.nombre || "Instrumento") + " - esquema de partes")}" loading="lazy" decoding="async" width="1200" height="900">
                <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(equipo.partsImage)}" data-parts-image-alt="${escapeHtml((equipo.nombre || "Instrumento") + " - esquema de partes")}" aria-label="Ampliar imagen de partes de ${escapeHtml(equipo.nombre || "instrumento")}">Ampliar imagen de partes</button>
            </li>
        `;
        parts.innerHTML = partsImgHtml + partsListHtml;
        } else {
        parts.innerHTML = partsListHtml;
        }
    }
    if (uses) {
        uses.innerHTML = Array.isArray(equipo.usos)
        ? equipo.usos.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        : "";
    }
    if (functioning) {
        functioning.textContent = equipo.funcionamiento || equipo.uso || "";
    }
    if (imagePlaceholder) {
        imagePlaceholder.setAttribute("alt", `${equipo.nombre || "Instrumento"} - imagen principal`);
        if (equipo.mainImage) {
        imagePlaceholder.src = equipo.mainImage;
        imagePlaceholder.loading = "lazy";
        imagePlaceholder.decoding = "async";
        } else {
        imagePlaceholder.removeAttribute('src');
        }
    }

    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
    modalContent.classList.remove("modal-planeamiento");
    modalContent.classList.add("modal-equipo");
    }

    resetModalScrollPosition(modal);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    currentModal = modal;
    syncBodyScrollLock();
}

    function closeModal() {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    resetModalScrollPosition(modal);
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    currentModal = null;
    syncBodyScrollLock();
    }

    function resetModalScrollPosition(modal) {
    if (!modal) {
        return;
    }

    const modalContent = modal.querySelector(".modal-content");
    const modalArticle = modal.querySelector(".modal-article");
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
    if (modalArticle) {
        modalArticle.scrollTop = 0;
    }
    }

    function syncBodyScrollLock() {
    const modalOpen = !!document.querySelector(".modal.is-open");
    const imageViewerOpen = !!document.querySelector(".image-viewer-modal.is-open");
    document.body.classList.toggle("modal-open", modalOpen || imageViewerOpen);
    }

    function ensureImageViewerModal() {
    let viewer = document.querySelector(".image-viewer-modal");
    if (viewer) {
        return viewer;
    }

    viewer = document.createElement("div");
    viewer.className = "image-viewer-modal";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-hidden", "true");
    viewer.innerHTML = `
        <div class="image-viewer-overlay" data-close-image-viewer></div>
        <div class="image-viewer-content">
            <button class="image-viewer-close" type="button" data-close-image-viewer aria-label="Cerrar visor de imagen">×</button>
            <div class="image-viewer-zoom-controls" aria-label="Controles de zoom de imagen">
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-out aria-label="Reducir zoom">−</button>
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-reset aria-label="Restablecer zoom">100%</button>
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-in aria-label="Aumentar zoom">+</button>
            </div>
            <div class="image-viewer-stage">
                <img class="image-viewer-image" src="" alt="">
            </div>
        </div>
    `;

    document.body.appendChild(viewer);
    return viewer;
    }

    function openImageViewer(imageSrc, imageAlt) {
    if (!imageSrc) {
        return;
    }

    const viewer = ensureImageViewerModal();
    const image = viewer.querySelector(".image-viewer-image");
    const closeButton = viewer.querySelector(".image-viewer-close");
    if (!image || !closeButton) {
        return;
    }

    image.src = imageSrc;
    image.alt = imageAlt || "Imagen ampliada de partes";
    image.loading = "eager";
    image.decoding = "async";
    image.onload = () => {
        syncImageViewerBaseOffsets();
        setImageViewerScale(1, 0, 0);
    };

    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    currentImageViewer = viewer;
    syncBodyScrollLock();
    window.requestAnimationFrame(() => {
        syncImageViewerBaseOffsets();
        setImageViewerScale(1, 0, 0);
    });
    closeButton.focus();
    }

    function closeImageViewer() {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    currentImageViewer = null;
    isImageViewerPanning = false;
    imageViewerPanPointerId = null;
    setImageViewerScale(1, 0, 0);
    syncBodyScrollLock();
    }

    function setImageViewerScale(nextScale, nextOffsetX = currentImageViewerOffsetX, nextOffsetY = currentImageViewerOffsetY) {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const image = viewer.querySelector(".image-viewer-image");
    const stage = viewer.querySelector(".image-viewer-stage");
    const resetButton = viewer.querySelector("[data-image-zoom-reset]");
    if (!image || !stage) {
        return;
    }

    const clampedScale = Math.min(IMAGE_VIEWER_MAX_SCALE, Math.max(IMAGE_VIEWER_MIN_SCALE, nextScale));
    currentImageViewerScale = clampedScale;
    if (clampedScale <= IMAGE_VIEWER_MIN_SCALE) {
        currentImageViewerOffsetX = 0;
        currentImageViewerOffsetY = 0;
    } else {
        currentImageViewerOffsetX = nextOffsetX;
        currentImageViewerOffsetY = nextOffsetY;
    }

    image.style.transform = `translate3d(${currentImageViewerOffsetX}px, ${currentImageViewerOffsetY}px, 0) scale(${clampedScale})`;
    image.style.transformOrigin = "0 0";
    stage.classList.toggle("is-pannable", clampedScale > IMAGE_VIEWER_MIN_SCALE);

    if (resetButton) {
        resetButton.textContent = `${Math.round(clampedScale * 100)}%`;
    }
    }

    function syncImageViewerBaseOffsets() {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const image = viewer.querySelector(".image-viewer-image");
    const stage = viewer.querySelector(".image-viewer-stage");
    if (!image || !stage) {
        return;
    }

    const stageRect = stage.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    imageViewerBaseOffsetX = imageRect.left - stageRect.left;
    imageViewerBaseOffsetY = imageRect.top - stageRect.top;
    }

    function setImageViewerScaleAtPoint(nextScale, clientX, clientY) {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const stage = viewer.querySelector(".image-viewer-stage");
    if (!stage) {
        return;
    }

    const clampedScale = Math.min(IMAGE_VIEWER_MAX_SCALE, Math.max(IMAGE_VIEWER_MIN_SCALE, nextScale));
    const previousScale = currentImageViewerScale;
    if (clampedScale === previousScale) {
        return;
    }

    const stageRect = stage.getBoundingClientRect();
    const pointX = clientX - stageRect.left;
    const pointY = clientY - stageRect.top;
    const localX = (pointX - imageViewerBaseOffsetX - currentImageViewerOffsetX) / previousScale;
    const localY = (pointY - imageViewerBaseOffsetY - currentImageViewerOffsetY) / previousScale;
    const nextOffsetX = pointX - imageViewerBaseOffsetX - (localX * clampedScale);
    const nextOffsetY = pointY - imageViewerBaseOffsetY - (localY * clampedScale);

    setImageViewerScale(clampedScale, nextOffsetX, nextOffsetY);
    }

    function zoomImageViewerIn() {
    const viewer = document.querySelector(".image-viewer-modal");
    const stage = viewer ? viewer.querySelector(".image-viewer-stage") : null;
    if (!stage) {
        setImageViewerScale(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP);
        return;
    }

    const rect = stage.getBoundingClientRect();
    setImageViewerScaleAtPoint(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
    }

    function zoomImageViewerOut() {
    const viewer = document.querySelector(".image-viewer-modal");
    const stage = viewer ? viewer.querySelector(".image-viewer-stage") : null;
    if (!stage) {
        setImageViewerScale(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP);
        return;
    }

    const rect = stage.getBoundingClientRect();
    setImageViewerScaleAtPoint(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
    }

    function resetImageViewerZoom() {
    syncImageViewerBaseOffsets();
    setImageViewerScale(1, 0, 0);
    }

    function initAccordion() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach((item) => {
        const button = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (!button || !content) {
        return;
        }

        const syncState = (expanded) => {
        button.setAttribute("aria-expanded", String(expanded));
        content.classList.toggle("is-open", expanded);
        content.hidden = false;
        content.style.maxHeight = expanded ? `${content.scrollHeight}px` : "0px";
        if (!expanded) {
            window.setTimeout(() => {
            if (!button.matches('[aria-expanded="true"]')) {
                content.hidden = true;
            }
            }, 350);
        }
        };

        button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        syncState(!expanded);
        });

        content.hidden = true;
        content.style.maxHeight = "0px";
    });
    }

    function initFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
        // generic filters used on equipos page expect data-category
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const category = button.dataset.category || button.dataset.organ || "Todos";
        filterEquipos(category);
        });
    });
    }

    // Planeamientos page: show/hide organ cards and open modal with planeamientos list
    function initPlaneamientosPage() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const organCards = document.querySelectorAll(".organ-card");
    if (!filterButtons.length || !organCards.length) {
        return;
    }

    const showForOrgan = (organ) => {
        organCards.forEach((card) => {
        const cardOrgan = card.dataset.organ || "";
        // show all when organ is falsy or explicitly 'Todos'
        if (!organ || (typeof organ === 'string' && organ.toLowerCase() === 'todos')) {
            card.style.display = 'block';
        } else {
            card.style.display = cardOrgan === organ ? 'block' : 'none';
        }
        });
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const organ = btn.dataset.organ;
        showForOrgan(organ);
        });
    });

    // Initialize to first active or first button
    const active = document.querySelector('.filter-btn.active') || filterButtons[0];
    if (active) {
        active.classList.add('active');
        showForOrgan(active.dataset.organ || "");
    }

    // Open planeamientos modal (supports optional planeamiento id on the card)
    document.querySelectorAll('.organ-card .btn-secondary').forEach((btn) => {
        btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.organ-card');
        if (!card) return;
        const organ = card.dataset.organ;
        const planeamientoId = card.dataset.planeamientoId ? Number(card.dataset.planeamientoId) : undefined;
        openPlaneamientosModal(organ, planeamientoId);
        });
    });
    }

    function openPlaneamientosModal(organ, planeamientoId) {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    const title = modal.querySelector('.modal-title');
    const badge = modal.querySelector('.modal-badge');
    const longDescription = modal.querySelector('.modal-description');

    const items = planeamientosData[organ] || [];
    const complejoPlaneamiento = items.find(p => p.tipo === 'planeamiento-complejo');
    const planesSimples = items.filter(p => p.tipo !== 'planeamiento-complejo');
    let specificPlaneamiento = null;
    if (planeamientoId) {
        specificPlaneamiento = items.find(p => Number(p.id) === Number(planeamientoId));
    }
    
    if (title) title.textContent = getOrganDisplayName(organ);
    if (badge) badge.textContent = 'Planeamientos';
    
    if (longDescription) {
        if (!items.length) {
            longDescription.innerHTML = '<p class="muted">No hay planeamientos disponibles aún.</p>';
        } else {
            // If a specific planeamiento id was requested and found, render only it
            if (specificPlaneamiento) {
                if (specificPlaneamiento.tipo === 'planeamiento-complejo') {
                    longDescription.innerHTML = renderPlaneamientoComplejo(specificPlaneamiento);
                    bindPlaneamientoTabs();
                } else {
                    longDescription.innerHTML = `<article class="planeamiento-item"><h4>${escapeHtml(specificPlaneamiento.titulo)}</h4><p class="muted">${escapeHtml(specificPlaneamiento.resumen || '')}</p></article>`;
                }
            } else {
                let html = '';
                // Si hay un planeamiento complejo, renderizarlo primero
                if (complejoPlaneamiento) {
                    html += renderPlaneamientoComplejo(complejoPlaneamiento);
                }
                // Luego renderizar los planeamientos simples
                if (planesSimples.length) {
                    if (html) html += '<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--gris-claro);">';
                    html += planesSimples
                        .map((p) => `<article class="planeamiento-item"><h4>${escapeHtml(p.titulo)}</h4><p class="muted">${escapeHtml(p.resumen)}</p></article>`)
                        .join('');
                }
                longDescription.innerHTML = html;
            }
        }
    }
    
    resetModalScrollPosition(modal);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    currentModal = modal;
    syncBodyScrollLock();
    
    // Bind tab events if complex planeamiento exists
    if (complejoPlaneamiento) {
        bindPlaneamientoTabs();
    }
    }

    function renderPlaneamientoComplejo(planeamiento) {
    const { titulo, etapas } = planeamiento;
    
    return `
        <div class="planeamiento-complejo">
            <h3 style="margin-bottom: 1.5rem;">${escapeHtml(titulo)}</h3>
            
            <div class="etapas-tabs" role="tablist" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--gris-claro);">
                <button class="etapa-tab active" role="tab" aria-selected="true" data-etapa="planeacion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Planeación
                </button>
                <button class="etapa-tab" role="tab" aria-selected="false" data-etapa="organizacion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Organización
                </button>
                <button class="etapa-tab" role="tab" aria-selected="false" data-etapa="ejecucion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Ejecución
                </button>
            </div>
            
            <div class="etapa-content">
                ${renderEtapaPlaneacion(etapas.planeacion)}
                ${renderEtapaOrganizacion(etapas.organizacion)}
                ${renderEtapaEjecucion(etapas.ejecucion)}
            </div>
        </div>
    `;
    }

    function renderPlaneamientoImageGallery(images, altPrefix, useLargeClass = false) {
    if (!Array.isArray(images) || images.length === 0) {
        return '';
    }

    const className = useLargeClass ? 'planeamiento-imagen-large' : 'planeamiento-imagen';
    const columns = images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))';
    return `
        <div style="display:grid; grid-template-columns:${columns}; gap:0.75rem; margin-top:0.75rem;">
            ${images.map((imageSrc, index) => `<img src="${imageSrc}" alt="${altPrefix} ${index + 1}" style="width:100%; height:auto; border-radius:6px; object-fit:contain;" class="${className}" loading="eager">`).join('')}
        </div>
    `;
    }

    function renderPlaneamientoAnatomiaSeccion(seccion) {
    return `
        <section style="margin-bottom: 2rem;">
            <h5 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(seccion.titulo)}</h5>
            ${seccion.imagenArriba ? `<img src="${seccion.imagenArriba}" alt="${escapeHtml(seccion.titulo)}" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${seccion.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
            ${seccion.contenido ? `<p style="white-space: pre-line;">${escapeHtml(seccion.contenido)}</p>` : ''}
            ${seccion.imagen ? `<img src="${seccion.imagen}" alt="${escapeHtml(seccion.titulo)}" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${seccion.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
            ${renderPlaneamientoImageGallery(seccion.imagenes || [], seccion.altPrefix || escapeHtml(seccion.titulo), seccion.largeGallery || false)}
        </section>
    `;
    }

    function renderEtapaPlaneacion(planeacion) {
    const anatomiaConSecciones = Array.isArray(planeacion.anatomia?.secciones) && planeacion.anatomia.secciones.length;
    return `
        <div class="etapa-panel" data-etapa="planeacion" style="display: block;">
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">Objetivo Quirúrgico</h4>
                <p>${escapeHtml(planeacion.objetivo)}</p>
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.anatomia.titulo)}</h4>
                ${planeacion.anatomia.imagenArriba ? `<img src="${planeacion.anatomia.imagenArriba}" alt="Anatomía" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${planeacion.anatomia.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.anatomia.contenido)}</p>` : ''}
                ${anatomiaConSecciones ? planeacion.anatomia.secciones.map(renderPlaneamientoAnatomiaSeccion).join('') : `
                    ${planeacion.anatomia.imagen ? `<img src="${planeacion.anatomia.imagen}" alt="Anatomía" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                    ${renderPlaneamientoImageGallery(planeacion.anatomia.imagenes, "Imagen anatómica")}
                `}

                ${Array.isArray(planeacion.anatomia?.genitalesExternos) && planeacion.anatomia.genitalesExternos.length ? `
                    <div style="margin-top:1rem;">
                        <h5 style="margin-bottom:0.5rem; color: #333;">Genitales Externos</h5>
                        <ul style="margin-left:1.5rem;">
                            ${planeacion.anatomia.genitalesExternos.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${Array.isArray(planeacion.anatomia?.genitalesInternos) && planeacion.anatomia.genitalesInternos.length ? `
                    <div style="margin-top:1rem;">
                        <h5 style="margin-bottom:0.5rem; color: #333;">Genitales Internos</h5>
                        <ul style="margin-left:1.5rem;">
                            ${planeacion.anatomia.genitalesInternos.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${planeacion.anatomia.imagenDebajo ? `<img src="${planeacion.anatomia.imagenDebajo}" alt="Imagen anatómica inferior" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            
            ${planeacion.partes ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.partes.titulo)}</h4>
                <ul style="margin-left: 1.5rem;">
                    ${Array.isArray(planeacion.partes?.items) ? planeacion.partes.items.map(item => `
                            <li style="margin-bottom: 0.5rem;">
                                <strong>${escapeHtml(item.nombre)}:</strong> ${escapeHtml(item.descripcion)}
                                ${item.imagen ? `<br><img src="${item.imagen}" alt="${escapeHtml(item.nombre)}" style="max-width: 100%; height: auto; margin-top: 0.5rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                        </li>
                    `).join('') : ''}
                </ul>
                ${renderPlaneamientoImageGallery(planeacion.partes.imagenes || [], "Imagen de partes")}
            </section>
            ` : ''}
            
            ${planeacion.irrigacion ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.irrigacion.titulo)}</h4>
                <p style="white-space: pre-line;">${escapeHtml(planeacion.irrigacion.contenido)}</p>
                ${Array.isArray(planeacion.irrigacion.arterias) && planeacion.irrigacion.arterias.length ? `
                    <div style="margin-top:0.5rem;"><strong>Arterias principales:</strong>
                        <ul style="margin-left:1.5rem;">${planeacion.irrigacion.arterias.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${Array.isArray(planeacion.irrigacion.venas) && planeacion.irrigacion.venas.length ? `
                    <div style="margin-top:0.5rem;"><strong>Venas que drenan:</strong>
                        <ul style="margin-left:1.5rem;">${planeacion.irrigacion.venas.map(v => `<li>${escapeHtml(v)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${planeacion.irrigacion.imagen ? `<img src="${planeacion.irrigacion.imagen}" alt="Irrigación e inervación" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${planeacion.irrigacion.imagenInervacion ? `<img src="${planeacion.irrigacion.imagenInervacion}" alt="Inervación" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${renderPlaneamientoImageGallery(planeacion.irrigacion.imagenes || [], "Imagen de irrigación")}
                ${planeacion.irrigacion.imagenDebajo ? `<img src="${planeacion.irrigacion.imagenDebajo}" alt="Imagen de vascularización inferior" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            ` : ''}

            ${planeacion.inervacion ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.inervacion.titulo || 'Inervación')}</h4>
                ${planeacion.inervacion.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.inervacion.contenido)}</p>` : ''}
            </section>
            ` : ''}
            
            ${planeacion.fisiologia ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.fisiologia.titulo)}</h4>
                ${planeacion.fisiologia.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.fisiologia.contenido)}</p>` : ''}
                ${Array.isArray(planeacion.fisiologia?.funciones) && planeacion.fisiologia.funciones.length ? `
                    <ul style="margin-left: 1.5rem;">
                        ${planeacion.fisiologia.funciones.map(func => `
                            <li style="margin-bottom: 0.75rem;"><strong>${escapeHtml(func.nombre)}:</strong> ${escapeHtml(func.descripcion)}</li>
                        `).join('')}
                    </ul>
                ` : ''}
                ${renderPlaneamientoImageGallery(planeacion.fisiologia.imagenes || [], "Imagen de fisiología")}
            </section>
            ` : ''}
            
            ${planeacion.checklist ? `
            <section>
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.checklist.titulo)}</h4>
                <div class="planeamiento-checklist-wrapper" style="margin-top:0.5rem;">
                    <table class="planeamiento-checklist-table" style="width:100%; border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Instrumental</th>
                                <th>Equipos / Dispositivos médico</th>
                                <th>Suturas y Agujas</th>
                                <th>Fármacos y Soluciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.instrumental) ? planeacion.checklist.categorias.instrumental.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.equipos) ? planeacion.checklist.categorias.equipos.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.suturas) ? planeacion.checklist.categorias.suturas.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.farmacos) ? planeacion.checklist.categorias.farmacos.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            ` : ''}
        </div>
    `;
    }

    function renderEtapaOrganizacion(organizacion) {
    const mesaMayo = organizacion?.mesaMayo;
    const mesaReserva = organizacion?.mesaReserva;
    const posicionPaciente = organizacion?.posicionPaciente;
    const equipoQuirurgico = organizacion?.equipoQuirurgico;

    return `
        <div class="etapa-panel" data-etapa="organizacion" style="display: none;">
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(mesaMayo?.titulo || "Mesa de Mayo")}</h4>
                ${mesaMayo ? `
                    <ul style="margin-left: 1.5rem; columns: 2; column-gap: 2rem;">
                        ${Array.isArray(mesaMayo?.items) ? mesaMayo.items.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                    </ul>
                    ${mesaMayo.imagen ? `
                        <div style="margin-top:1rem;">
                            <img src="${mesaMayo.imagen}" alt="Mesa de Mayo" style="max-width: 100%; height: auto; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${mesaMayo.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                            <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(mesaMayo.imagen)}" data-parts-image-alt="${escapeHtml(mesaMayo.titulo || 'Mesa de Mayo')}" aria-label="Ampliar imagen de Mesa de Mayo">Ampliar imagen</button>
                        </div>
                    ` : ''}
                ` : `<p>No se lleva mesa de mayo, sino una de reserva.</p>`}
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(mesaReserva?.titulo || "Mesa de Reserva")}</h4>
                ${mesaReserva?.descripcion ? `<p>${escapeHtml(mesaReserva.descripcion)}</p>` : ''}
                <ul style="margin-left: 1.5rem; columns: 2; column-gap: 2rem;">
                    ${Array.isArray(mesaReserva?.items) ? mesaReserva.items.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                </ul>
                ${mesaReserva?.imagen ? `
                    <div style="margin-top:1rem;">
                        <img src="${mesaReserva.imagen}" alt="Mesa de Reserva" style="max-width: 100%; height: auto; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${mesaReserva.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                        <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(mesaReserva.imagen)}" data-parts-image-alt="${escapeHtml(mesaReserva.titulo || 'Mesa de Reserva')}" aria-label="Ampliar imagen de Mesa de Reserva">Ampliar imagen</button>
                    </div>
                ` : ''}
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(posicionPaciente?.titulo || "Posición del paciente")}</h4>
                <p><strong>Posición:</strong> ${escapeHtml(posicionPaciente?.nombre || "No definida")}</p>
                <p>${escapeHtml(posicionPaciente?.descripcion || "")}</p>
                ${posicionPaciente?.imagen ? `<img src="${posicionPaciente.imagen}" alt="Posición del paciente" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${posicionPaciente.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}

                ${Array.isArray(posicionPaciente?.posiciones) && posicionPaciente.posiciones.length ? `
                    <div style="display:flex; gap:1rem; margin-top:1rem; flex-wrap:wrap;">
                        ${posicionPaciente.posiciones.map(pos => `
                            <figure style="margin:0; width: calc(50% - 0.5rem);">
                                <img src="${pos.imagen}" alt="${escapeHtml(pos.nombre)}" style="width:100%; height:auto; border-radius:0.5rem; object-fit:contain; cursor: pointer;" class="${posicionPaciente.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                                <figcaption style="font-size:0.9rem; margin-top:0.5rem; text-align:center; color:#444;">${escapeHtml(pos.nombre)}</figcaption>
                            </figure>
                        `).join('')}
                    </div>
                ` : ''}
            </section>
            
            <section>
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(equipoQuirurgico?.titulo || "Ubicación del equipo quirúrgico")}</h4>
                <ul style="margin-left: 1.5rem;">
                    ${Array.isArray(equipoQuirurgico?.roles) ? equipoQuirurgico.roles.map(role => `
                        <li style="margin-bottom: 0.5rem;">
                            <strong>${escapeHtml(role.rol)}:</strong> ${escapeHtml(role.posicion)}
                        </li>
                    `).join('') : ''}
                </ul>
                ${equipoQuirurgico?.imagen ? `<img src="${equipoQuirurgico.imagen}" alt="Ubicación del equipo quirúrgico" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${equipoQuirurgico.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
                ${renderPlaneamientoImageGallery(equipoQuirurgico?.imagenes || [], "Equipo quirúrgico", true)}
            </section>
        </div>
    `;
    }

    function renderEtapaEjecucion(ejecucion) {
    const incision = ejecucion.incision || {};
    return `
        <div class="etapa-panel" data-etapa="ejecucion" style="display: none;">
            <section style="margin-bottom: 1.5rem;">
                <p><strong>Anestesia:</strong> ${escapeHtml(ejecucion.anestesia)}</p>
                ${ejecucion.anestesiaImagen ? `<img src="${ejecucion.anestesiaImagen}" alt="Anestesia general" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${incision.nombre || incision.tipo ? `<p><strong>Incisión:</strong> ${escapeHtml(incision.nombre || 'No definida')}${incision.tipo ? ` (${escapeHtml(incision.tipo)})` : ''}</p>` : ''}
                ${incision.descripcion ? `<p style="font-size: 0.95rem; color: #666;">${escapeHtml(incision.descripcion)}</p>` : ''}
                ${incision.imagen ? `<img src="${incision.imagen}" alt="Incisión quirúrgica" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            
            <section>
                <h4 style="margin-bottom: 1rem; color: var(--azul-oscuro);">Pasos Quirúrgicos</h4>
                <div style="max-height: 600px; overflow-y: auto;">
                    ${Array.isArray(ejecucion.pasos) ? ejecucion.pasos.map(paso => `
                        <div style="margin-bottom: 1rem; padding: 1rem; background-color: #f9f9f9; border-left: 3px solid var(--azul-pastel); border-radius: 4px;">
                            <p style="margin: 0 0 0.5rem 0;"><strong>Paso ${paso.paso}:</strong> ${escapeHtml(paso.tecnica)}</p>
                            <div style="font-size: 0.9rem; color: #666; margin-left: 1rem;">
                                <p style="margin: 0.25rem 0;"><strong>Instrumental:</strong></p>
                                <ul style="margin: 0.25rem 0 0 1.5rem; padding: 0;">
                                    ${Array.isArray(paso.instrumental) ? paso.instrumental.map(inst => `<li>${escapeHtml(inst)}</li>`).join('') : ''}
                                </ul>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </section>
        </div>
    `;
    }

    function bindPlaneamientoTabs() {
    const tabs = document.querySelectorAll('.etapa-tab');
    const panels = document.querySelectorAll('.etapa-panel');

    // Ensure the currently marked active tab is visually active on init
    // (some tabs are rendered with class "active" / aria-selected by the renderer)
    tabs.forEach(t => {
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'inherit';
    });
    panels.forEach(p => { p.style.display = 'none'; });
    const initial = document.querySelector('.etapa-tab.active') || tabs[0];
    if (initial) {
        const etapa = initial.dataset.etapa;
        initial.classList.add('active');
        initial.setAttribute('aria-selected', 'true');
        initial.style.borderBottomColor = 'var(--azul-pastel)';
        initial.style.color = 'var(--azul-pastel)';
        const panel = document.querySelector(`.etapa-panel[data-etapa="${etapa}"]`);
        if (panel) panel.style.display = 'block';
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const etapa = tab.dataset.etapa;
            
            // Deactivate all tabs and panels
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'inherit';
            });
            
            panels.forEach(panel => {
                panel.style.display = 'none';
            });
            
            // Activate selected tab and panel
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            tab.style.borderBottomColor = 'var(--azul-pastel)';
            tab.style.color = 'var(--azul-pastel)';
            
            const panel = document.querySelector(`.etapa-panel[data-etapa="${etapa}"]`);
            if (panel) {
                panel.style.display = 'block';
            }
        });
    });
    }

    function initSearch() {
    const searchInput = document.querySelector(".search-bar input");
    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", () => {
        window.clearTimeout(searchTimeoutId);
        searchTimeoutId = window.setTimeout(() => {
        const activeFilter = document.querySelector(".filter-btn.active");
        const category = activeFilter ? activeFilter.dataset.category || "Todos" : "Todos";
        filterEquipos(category);
        }, 300);
    });
    }

    function observeFadeIns() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".fade-in:not(.visible)");

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
        }
        });
    }, { threshold: 0.15 });

    elements.forEach((element) => observer.observe(element));
    }

    function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) {
        return;
    }

    const toggleButton = () => {
        button.classList.toggle("is-visible", window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleButton, { passive: true });
    toggleButton();

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    }

    function initHamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navPanel = document.querySelector(".nav-panel");
    if (!hamburger || !navPanel) {
        return;
    }

    const closeMenu = () => {
        navPanel.classList.remove("nav-open");
        hamburger.setAttribute("aria-expanded", "false");
    };

    hamburger.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("nav-open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!navPanel.classList.contains("nav-open")) {
        return;
        }
        const target = event.target;
        if (target instanceof Node && !navPanel.contains(target) && !hamburger.contains(target)) {
        closeMenu();
        }
    });
    }

    function initModalEvents() {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    // avoid attaching listeners multiple times
    if (modal.dataset.initialized === "true") {
        return;
    }

    modal.addEventListener("click", (event) => {
        // close when clicking the overlay element
        if (event.target && event.target.classList && event.target.classList.contains('modal-overlay')) {
        closeModal();
        }

        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const partsButton = target.closest("[data-open-parts-image]");
        if (partsButton) {
        const src = partsButton.getAttribute("data-parts-image-src") || "";
        const alt = partsButton.getAttribute("data-parts-image-alt") || "Imagen ampliada de partes";
        openImageViewer(src, alt);
        }
    });

    modal.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    const onKeydown = (event) => {
        if (event.key !== "Escape") {
        const viewer = document.querySelector(".image-viewer-modal");
        const viewerOpen = !!(viewer && viewer.classList.contains("is-open"));
        if (viewerOpen && (event.key === "+" || event.key === "=")) {
            event.preventDefault();
            zoomImageViewerIn();
            return;
        }
        if (viewerOpen && event.key === "-") {
            event.preventDefault();
            zoomImageViewerOut();
            return;
        }
        if (viewerOpen && event.key === "0") {
            event.preventDefault();
            resetImageViewerZoom();
            return;
        }
        return;
        }

        const viewer = document.querySelector(".image-viewer-modal");
        if (viewer && viewer.classList.contains("is-open")) {
        closeImageViewer();
        return;
        }

        if (modal.classList.contains("is-open")) {
        closeModal();
        }
    };

    const imageViewer = ensureImageViewerModal();
    imageViewer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        if (target.matches("[data-image-zoom-in]") || target.closest("[data-image-zoom-in]")) {
        zoomImageViewerIn();
        return;
        }

        if (target.matches("[data-image-zoom-out]") || target.closest("[data-image-zoom-out]")) {
        zoomImageViewerOut();
        return;
        }

        if (target.matches("[data-image-zoom-reset]") || target.closest("[data-image-zoom-reset]")) {
        resetImageViewerZoom();
        return;
        }

        if (target.matches("[data-close-image-viewer]") || target.closest("[data-close-image-viewer]")) {
        closeImageViewer();
        }
    });

    imageViewer.addEventListener("wheel", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const viewerOpen = imageViewer.classList.contains("is-open");
        const overStage = !!target.closest(".image-viewer-stage");
        if (!viewerOpen || !overStage) {
        return;
        }

        event.preventDefault();
        if (event.deltaY < 0) {
        setImageViewerScaleAtPoint(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP, event.clientX, event.clientY);
        } else {
        setImageViewerScaleAtPoint(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP, event.clientX, event.clientY);
        }
    }, { passive: false });

    imageViewer.addEventListener("pointerdown", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const viewerOpen = imageViewer.classList.contains("is-open");
        const overStage = !!target.closest(".image-viewer-stage");
        if (!viewerOpen || !overStage || currentImageViewerScale <= IMAGE_VIEWER_MIN_SCALE) {
        return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
        return;
        }

        isImageViewerPanning = true;
        imageViewerPanPointerId = event.pointerId;
        imageViewerPanStartX = event.clientX;
        imageViewerPanStartY = event.clientY;
        imageViewerPanStartOffsetX = currentImageViewerOffsetX;
        imageViewerPanStartOffsetY = currentImageViewerOffsetY;
        imageViewer.setPointerCapture(event.pointerId);
        imageViewer.classList.add("is-panning");
        event.preventDefault();
    });

    imageViewer.addEventListener("pointermove", (event) => {
        if (!isImageViewerPanning || event.pointerId !== imageViewerPanPointerId) {
        return;
        }

        const deltaX = event.clientX - imageViewerPanStartX;
        const deltaY = event.clientY - imageViewerPanStartY;
        setImageViewerScale(currentImageViewerScale, imageViewerPanStartOffsetX + deltaX, imageViewerPanStartOffsetY + deltaY);
    });

    const stopPanning = (event) => {
        if (!isImageViewerPanning || event.pointerId !== imageViewerPanPointerId) {
        return;
        }

        isImageViewerPanning = false;
        imageViewerPanPointerId = null;
        imageViewer.classList.remove("is-panning");
        if (imageViewer.hasPointerCapture(event.pointerId)) {
        imageViewer.releasePointerCapture(event.pointerId);
        }
    };

    imageViewer.addEventListener("pointerup", stopPanning);
    imageViewer.addEventListener("pointercancel", stopPanning);

    document.addEventListener("keydown", onKeydown);
    modal.dataset.initialized = "true";
    }

    function initEquiposPage() {
    loadEquipos().then((equipos) => {
        const hasGrid = document.querySelector(".equipos-grid");
        if (!hasGrid) {
        return;
        }
        renderEquipos(equipos);
        initFilters();
        initSearch();
        initModalEvents();
    });
    }

async function initCurrentPage() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("planeamientos")) {
        await loadPlaneamientos();
        initPlaneamientosPage();
    }

    if (path.includes("equipos")) {
        initEquiposPage();
    }
}

    function normalizeText(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function initGlobalEvents() {
    initHamburgerMenu();
    initBackToTop();
    observeFadeIns();
    initModalEvents();
    initCurrentPage();
}

    window.toggleDarkMode = toggleDarkMode;
    window.loadEquipos = loadEquipos;
    window.renderEquipos = renderEquipos;
    window.filterEquipos = filterEquipos;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.initAccordion = initAccordion;
    window.initFilters = initFilters;

    window.addEventListener("DOMContentLoaded", () => {
    initGlobalEvents();
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
});

if (typeof window.pdfjsLib !== "undefined") {
    let pdfDoc = null;
    let currentPage = 1;
    const pdfPath = "assets/portafolio/Portafolio de urologia_compressed.pdf";

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    async function loadPDF() {
        try {
            pdfDoc = await window.pdfjsLib.getDocument(pdfPath).promise;
            renderPage(currentPage);
            updatePageInfo();
        } catch (error) {
            console.error("Error al cargar el PDF:", error);
            const container = document.getElementById("pdfContainer");
            if (container) {
                container.innerHTML = '<p style="color: #e89aaa; padding: 2rem; text-align: center;">Error al cargar el PDF. Por favor, intenta descargar el archivo.</p>';
            }
        }
    }

    async function renderPage(pageNum) {
        if (!pdfDoc) return;

        try {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement("canvas");
            canvas.className = "pdf-page";
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const container = document.getElementById("pdfContainer");
            if (!container) return;

            container.innerHTML = "";
            container.appendChild(canvas);

            updatePageInfo();
        } catch (error) {
            console.error("Error al renderizar la página:", error);
        }
    }

    function updatePageInfo() {
        if (pdfDoc) {
            const pageInfo = document.getElementById("pageInfo");
            if (pageInfo) {
                pageInfo.textContent = `Página ${currentPage} de ${pdfDoc.numPages}`;
            }

            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");
            if (prevBtn) prevBtn.disabled = currentPage <= 1;
            if (nextBtn) nextBtn.disabled = currentPage >= pdfDoc.numPages;
        }
    }

    function nextPage() {
        if (pdfDoc && currentPage < pdfDoc.numPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }

    function downloadPDF() {
        const link = document.createElement("a");
        link.href = pdfPath;
        link.download = "Portafolio_de_urologia.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function toggleFullscreen() {
        const viewer = document.querySelector(".portafolio-viewer");
        if (!viewer) return;

        if (!document.fullscreenElement) {
            viewer.requestFullscreen().catch((err) => {
                console.error("Error al entrar en pantalla completa:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    document.addEventListener("DOMContentLoaded", loadPDF);

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextPage();
        if (e.key === "ArrowLeft") previousPage();
    });

    window.loadPDF = loadPDF;
    window.renderPage = renderPage;
    window.updatePageInfo = updatePageInfo;
    window.nextPage = nextPage;
    window.previousPage = previousPage;
    window.downloadPDF = downloadPDF;
    window.toggleFullscreen = toggleFullscreen;
}