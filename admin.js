import { auth, db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const state = {
    activeType: "equipos",
    equipos: [],
    planeamientos: [],
    selectedId: null,
    sourceMode: {
        equipos: "firestore",
        planeamientos: "firestore"
    }
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    initSharedUi();
    bindEvents();
    setAdminEnabled(false);
    setActiveRecordType(state.activeType, { skipRender: true });

    onAuthStateChanged(auth, async (user) => {
    if (user) {
        updateAuthState(true, user.email || "Sesión activa");
        setLoginMessage("Sesión activa.", "success");
        setAdminEnabled(true);
        await Promise.all([loadEquipos(), loadPlaneamientos()]);
        renderActiveList();
    } else {
        updateAuthState(false, "Sesión cerrada");
        setLoginMessage("Inicia sesión para administrar equipos.", "info");
        setAdminEnabled(false);
        state.equipos = [];
        state.planeamientos = [];
        state.selectedId = null;
        renderList();
        clearForm();
        }
    });

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
});

function cacheElements() {
    elements.authCard = document.querySelector(".admin-auth-card");
    elements.loginForm = document.querySelector("[data-login-form]");
    elements.logoutButtons = document.querySelectorAll("[data-logout-button]");
    elements.loginMessage = document.querySelector("[data-login-message]");
    elements.authStatus = document.querySelector("[data-auth-status]");
    elements.sessionMenu = document.querySelector("[data-session-menu]");
    elements.sessionToggle = document.querySelector("[data-session-toggle]");
    elements.sessionLabels = document.querySelectorAll("[data-session-label]");
    elements.workspace = document.querySelector(".admin-workspace");
    elements.typeButtons = document.querySelectorAll("[data-admin-type]");
    elements.equiposList = document.querySelector("[data-equipos-list]");
    elements.planeamientosList = document.querySelector("[data-planeamientos-list]");
    elements.emptyState = document.querySelector("[data-empty-state]");
    elements.count = document.querySelector("[data-equipos-count]");
    elements.form = document.querySelector("[data-admin-form]") || document.querySelector("[data-equipo-form]");
    elements.equiposSection = document.querySelector("[data-form-section='equipos']");
    elements.planeamientosSection = document.querySelector("[data-form-section='planeamientos']");
    elements.recordTypeInput = document.querySelector("[name='recordType']");
    elements.saveStatus = document.querySelector("[data-save-status]");
    elements.actionMessage = document.querySelector("[data-action-message]");
    elements.refreshButtons = document.querySelectorAll("[data-refresh-button]");
    elements.newButtons = document.querySelectorAll("[data-new-button]");
    elements.deleteButton = document.querySelector("[data-delete-button]");
}

function setAdminEnabled(enabled) {
    document.body.classList.toggle("admin-locked", !enabled);

    if (elements.workspace) {
        elements.workspace.hidden = !enabled;
        elements.workspace.setAttribute("aria-hidden", String(!enabled));
    }

    if (elements.form) {
        elements.form.querySelectorAll("input, textarea, button").forEach((field) => {
            field.disabled = !enabled;
        });
    }

    elements.refreshButtons?.forEach((button) => {
        button.disabled = !enabled;
    });

    elements.newButtons?.forEach((button) => {
        button.disabled = !enabled;
    });

    if (elements.deleteButton) {
        elements.deleteButton.disabled = !enabled;
    }
}

function setActiveRecordType(type, options = {}) {
    const nextType = type === "planeamientos" ? "planeamientos" : "equipos";
    state.activeType = nextType;
    state.selectedId = null;

    elements.typeButtons?.forEach((button) => {
        const isActive = button.dataset.adminType === nextType;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    if (elements.recordTypeInput) {
        elements.recordTypeInput.value = nextType;
    }

    if (elements.equiposSection) {
        elements.equiposSection.hidden = nextType !== "equipos";
    }

    if (elements.planeamientosSection) {
        elements.planeamientosSection.hidden = nextType !== "planeamientos";
    }

    if (elements.equiposList) {
        elements.equiposList.hidden = nextType !== "equipos";
    }

    if (elements.planeamientosList) {
        elements.planeamientosList.hidden = nextType !== "planeamientos";
    }

    if (!options.skipRender) {
        renderActiveList();
        clearForm();
    }
}

function getRecordsByType(type) {
    return type === "planeamientos" ? state.planeamientos : state.equipos;
}

function getCollectionName(type) {
    return type === "planeamientos" ? "planeamientos" : "equipos";
}

function getListElement(type) {
    return type === "planeamientos" ? elements.planeamientosList : elements.equiposList;
}

function renderActiveList() {
    renderList(state.activeType);
}

function initSharedUi() {
    const hamburger = document.querySelector(".hamburger");
    const navPanel = document.querySelector(".nav-panel");

    if (hamburger && navPanel) {
        hamburger.addEventListener("click", () => {
            const isOpen = navPanel.classList.toggle("nav-open");
            hamburger.setAttribute("aria-expanded", String(isOpen));
        });

        navPanel.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navPanel.classList.remove("nav-open");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        const toggleBackToTop = () => {
            backToTop.classList.toggle("is-visible", window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const fadeInElements = document.querySelectorAll(".fade-in");
    if (typeof IntersectionObserver === "undefined") {
        fadeInElements.forEach((element) => element.classList.add("visible"));
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

    fadeInElements.forEach((element) => observer.observe(element));
}

function bindEvents() {
    elements.loginForm?.addEventListener("submit", handleLogin);
    elements.logoutButtons?.forEach((button) => button.addEventListener("click", handleLogout));
    elements.form?.addEventListener("submit", handleSave);
    elements.deleteButton?.addEventListener("click", handleDelete);
    elements.refreshButtons?.forEach((button) => button.addEventListener("click", () => {
        if (state.activeType === "planeamientos") {
            loadPlaneamientos();
            return;
        }

        loadEquipos();
    }));
    elements.newButtons?.forEach((button) => button.addEventListener("click", clearForm));

    elements.typeButtons?.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveRecordType(button.dataset.adminType || "equipos");
        });
    });

    elements.sessionToggle?.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = elements.sessionMenu?.classList.toggle("is-open");
        elements.sessionToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });

    document.addEventListener("click", (event) => {
        if (!elements.sessionMenu || !elements.sessionMenu.classList.contains("is-open")) {
            return;
        }

        if (!elements.sessionMenu.contains(event.target)) {
            elements.sessionMenu.classList.remove("is-open");
            elements.sessionToggle?.setAttribute("aria-expanded", "false");
        }
    });

    elements.equiposList?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-equipo-id]");
        if (!button) {
            return;
        }

        selectRecord("equipos", button.dataset.equipoId);
    });

    elements.planeamientosList?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-planeamiento-id]");
        if (!button) {
            return;
        }

        selectRecord("planeamientos", button.dataset.planeamientoId);
    });
}

async function loadEquipos() {
    setStatus("Cargando equipos...", "info");

    try {
        const snapshot = await getDocs(collection(db, "equipos"));

        state.equipos = snapshot.docs
        .map((item, index) => {
            const data = item.data();
            return {
            docId: item.id,
            ...data,
            descripcion_corta: data.descripcion_corta ?? data.descripcioncorta ?? "",
            orden: data.orden ?? data.id ?? index,
            sourceMode: "firestore"
            };
        })
        .sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0));
        state.sourceMode.equipos = "firestore";
        setStatus("Datos sincronizados con Firestore.", "success");
    } catch (error) {
        console.error("No se pudo leer Firestore, usando JSON local:", error);
        const response = await fetch("./data/equipos.json");
        const data = await response.json();
        state.equipos = Array.isArray(data)
            ? data.map((item, index) => ({
                ...item,
                docId: null,
                orden: item.orden ?? item.id ?? index,
                sourceMode: "local"
            }))
            : [];
        state.sourceMode.equipos = "local";
        setStatus("Modo local activo. Configura Firebase para guardar en Firestore.", "warning");
    }

    if (state.activeType === "equipos") {
        renderList("equipos");
    }
    if (!state.selectedId && state.equipos.length) {
        selectRecord("equipos", state.equipos[0].docId || state.equipos[0].id);
    }
}

async function loadPlaneamientos() {
    setStatus("Cargando planeamientos...", "info");

    try {
        const snapshot = await getDocs(collection(db, "planeamientos"));

        state.planeamientos = snapshot.docs
            .map((item, index) => normalizePlaneamientoRecord({ docId: item.id, ...item.data() }, index))
            .sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0));

        state.sourceMode.planeamientos = "firestore";
        setStatus("Planeamientos sincronizados con Firestore.", "success");
    } catch (error) {
        console.error("No se pudo leer planeamientos desde Firestore:", error);

        state.planeamientos = [];
        state.sourceMode.planeamientos = "firestore";
        setStatus("No se pudieron cargar los planeamientos desde Firestore. Revisa reglas, auth o firebase-config.", "error");
    }

    if (state.activeType === "planeamientos") {
        renderList("planeamientos");
    }

    if (state.activeType === "planeamientos" && !state.selectedId && state.planeamientos.length) {
        selectRecord("planeamientos", state.planeamientos[0].docId || state.planeamientos[0].id);
    }
}

function flattenPlaneamientosLocal(data) {
    if (!data || typeof data !== "object") {
        return [];
    }

    return Object.entries(data).flatMap(([organo, items]) => {
        if (!Array.isArray(items)) {
            return [];
        }

        return items.map((item, index) => normalizePlaneamientoRecord({
            ...item,
            organo,
            docId: null
        }, index));
    });
}

function normalizePlaneamientoRecord(record, index = 0) {
    const etapas = typeof record.etapas === "object" && record.etapas ? record.etapas : parsePlaneamientoEtapas(record.etapas_json || record.etapas || {});
    return {
        docId: record.docId || null,
        id: record.id ?? index,
        orden: record.orden ?? record.id ?? index,
        recordType: "planeamientos",
        titulo: record.titulo || record.nombre || "Sin título",
        organo: record.organo || record.categoria || "",
        tipo: record.tipo || "planeamiento-simple",
        resumen: record.resumen || record.descripcion_corta || etapas?.planeacion?.objetivo || "",
        etapas,
        sourceMode: record.sourceMode || "local"
    };
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
            console.warn("No se pudo parsear etapas_json:", error);
        }
    }

    return {};
}

async function handleLogin(event) {
    event.preventDefault();
    if (!elements.loginForm) {
        return;
    }

    const formData = new FormData(elements.loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
        setLoginMessage("Completa correo y contraseña para iniciar sesión.", "warning");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error de inicio de sesión:", error);
        updateAuthState(false, "Sesión cerrada");
        setLoginMessage("No se pudo iniciar sesión. Revisa Firebase Auth.", "error");
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        elements.sessionMenu?.classList.remove("is-open");
        elements.sessionToggle?.setAttribute("aria-expanded", "false");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        setLoginMessage("No se pudo cerrar sesión.", "error");
    }
}

function updateAuthState(isLoggedIn, label) {
    document.body.classList.toggle("admin-authenticated", isLoggedIn);

    if (elements.authStatus) {
        elements.authStatus.textContent = label;
        elements.authStatus.dataset.state = isLoggedIn ? "success" : "neutral";
    }

    if (elements.authCard) {
        elements.authCard.hidden = isLoggedIn;
        elements.authCard.setAttribute("aria-hidden", String(isLoggedIn));
    }

    if (elements.sessionMenu) {
        elements.sessionMenu.hidden = !isLoggedIn;
        if (!isLoggedIn) {
            elements.sessionMenu.classList.remove("is-open");
            elements.sessionToggle?.setAttribute("aria-expanded", "false");
        }
    }

    elements.sessionLabels?.forEach((node) => {
        node.textContent = label;
    });

    elements.logoutButtons?.forEach((button) => {
        button.hidden = !isLoggedIn;
        button.disabled = !isLoggedIn;
    });

    if (!isLoggedIn) {
        elements.loginForm?.reset();
    }
}

function selectRecord(recordType, targetId) {
    const records = getRecordsByType(recordType);
    const record = records.find((item) => String(item.docId || item.id) === String(targetId));
    if (!record) {
        return;
    }

    state.activeType = recordType;
    setActiveRecordType(recordType, { skipRender: true });
    state.selectedId = String(record.docId || record.id);
    fillForm(record, recordType);
    renderList(recordType);
    setStatus(`Editando ${recordType === "planeamientos" ? record.titulo : record.nombre}.`, "info");
}

function selectEquipo(targetId) {
    selectRecord("equipos", targetId);
}

function selectPlaneamiento(targetId) {
    selectRecord("planeamientos", targetId);
}

function fillForm(record, recordType = state.activeType) {
    if (!elements.form) {
        return;
    }

    const form = elements.form;
    setFormValue(form, "docId", record.docId || "");
    setFormValue(form, "recordType", recordType);

    if (recordType === "planeamientos") {
        const planeacion = record.etapas?.planeacion || {};
        const organizacion = record.etapas?.organizacion || {};
        const ejecucion = record.etapas?.ejecucion || {};

        setFormValue(form, "id", record.id ?? "");
        setFormValue(form, "titulo", record.titulo || "");
        setFormValue(form, "organo", record.organo || "");
        setFormValue(form, "tipo", record.tipo || "");

        setFormValue(form, "planeacion_objetivo", planeacion.objetivo || "");
        setFormValue(form, "anatomia_titulo", planeacion.anatomia?.titulo || "");
        setFormValue(form, "anatomia_contenido", planeacion.anatomia?.contenido || "");
        setFormValue(form, "anatomia_imagen", planeacion.anatomia?.imagen || "");
        setFormValue(form, "partes_items", toPartesTextarea(planeacion.partes?.items || []));
        setFormValue(form, "irrigacion_titulo", planeacion.irrigacion?.titulo || "");
        setFormValue(form, "irrigacion_contenido", planeacion.irrigacion?.contenido || "");
        setFormValue(form, "irrigacion_imagen", planeacion.irrigacion?.imagen || "");
        setFormValue(form, "fisiologia_funciones", toFuncionesTextarea(planeacion.fisiologia?.funciones || []));
        setFormValue(form, "checklist_instrumental", toTextareaValue(planeacion.checklist?.categorias?.instrumental || []));
        setFormValue(form, "checklist_equipos", toTextareaValue(planeacion.checklist?.categorias?.equipos || []));
        setFormValue(form, "checklist_suturas", toTextareaValue(planeacion.checklist?.categorias?.suturas || []));
        setFormValue(form, "checklist_farmacos", toTextareaValue(planeacion.checklist?.categorias?.farmacos || []));

        setFormValue(form, "mesa_mayo_imagen", organizacion.mesaMayo?.imagen || "");
        setFormValue(form, "mesa_reserva_imagen", organizacion.mesaReserva?.imagen || "");
        setFormValue(form, "posicion_nombre", organizacion.posicionPaciente?.nombre || "");
        setFormValue(form, "posicion_descripcion", organizacion.posicionPaciente?.descripcion || "");
        setFormValue(form, "posicion_imagen", organizacion.posicionPaciente?.imagen || "");
        setFormValue(form, "equipo_roles", toRolesTextarea(organizacion.equipoQuirurgico?.roles || []));
        setFormValue(form, "equipo_imagen", organizacion.equipoQuirurgico?.imagen || "");

        setFormValue(form, "anestesia", ejecucion.anestesia || "");
        setFormValue(form, "anestesia_imagen", ejecucion.anestesiaImagen || "");
        setFormValue(form, "incision_nombre", ejecucion.incision?.nombre || "");
        setFormValue(form, "incision_tipo", ejecucion.incision?.tipo || "");
        setFormValue(form, "incision_descripcion", ejecucion.incision?.descripcion || "");
        setFormValue(form, "incision_imagen", ejecucion.incision?.imagen || "");
        setFormValue(form, "ejecucion_pasos", toPasosTextarea(ejecucion.pasos || []));

        toggleFieldVisibility(form, "anatomia_titulo", Boolean(planeacion.anatomia?.titulo || planeacion.anatomia?.contenido));
        toggleFieldVisibility(form, "anatomia_contenido", Boolean(planeacion.anatomia?.titulo || planeacion.anatomia?.contenido));
        toggleFieldVisibility(form, "anatomia_imagen", Boolean(planeacion.anatomia?.imagen));

        toggleFieldVisibility(form, "partes_items", Array.isArray(planeacion.partes?.items) && planeacion.partes.items.length > 0);

        toggleFieldVisibility(form, "irrigacion_titulo", Boolean(planeacion.irrigacion?.titulo || planeacion.irrigacion?.contenido));
        toggleFieldVisibility(form, "irrigacion_contenido", Boolean(planeacion.irrigacion?.titulo || planeacion.irrigacion?.contenido));
        toggleFieldVisibility(form, "irrigacion_imagen", Boolean(planeacion.irrigacion?.imagen));

        toggleFieldVisibility(form, "fisiologia_funciones", Array.isArray(planeacion.fisiologia?.funciones) && planeacion.fisiologia.funciones.length > 0);

        toggleFieldVisibility(form, "checklist_instrumental", Array.isArray(planeacion.checklist?.categorias?.instrumental) && planeacion.checklist.categorias.instrumental.length > 0);
        toggleFieldVisibility(form, "checklist_equipos", Array.isArray(planeacion.checklist?.categorias?.equipos) && planeacion.checklist.categorias.equipos.length > 0);
        toggleFieldVisibility(form, "checklist_suturas", Array.isArray(planeacion.checklist?.categorias?.suturas) && planeacion.checklist.categorias.suturas.length > 0);
        toggleFieldVisibility(form, "checklist_farmacos", Array.isArray(planeacion.checklist?.categorias?.farmacos) && planeacion.checklist.categorias.farmacos.length > 0);

        toggleFieldVisibility(form, "mesa_mayo_imagen", Boolean(organizacion.mesaMayo?.imagen));
        toggleFieldVisibility(form, "mesa_reserva_imagen", Boolean(organizacion.mesaReserva?.imagen));

        toggleFieldVisibility(form, "posicion_nombre", Boolean(organizacion.posicionPaciente?.nombre || organizacion.posicionPaciente?.descripcion));
        toggleFieldVisibility(form, "posicion_descripcion", Boolean(organizacion.posicionPaciente?.nombre || organizacion.posicionPaciente?.descripcion));
        toggleFieldVisibility(form, "posicion_imagen", Boolean(organizacion.posicionPaciente?.imagen));

        toggleFieldVisibility(form, "equipo_roles", Array.isArray(organizacion.equipoQuirurgico?.roles) && organizacion.equipoQuirurgico.roles.length > 0);
        toggleFieldVisibility(form, "equipo_imagen", Boolean(organizacion.equipoQuirurgico?.imagen));

        toggleFieldVisibility(form, "anestesia", Boolean(ejecucion.anestesia));
        toggleFieldVisibility(form, "anestesia_imagen", Boolean(ejecucion.anestesiaImagen));

        toggleFieldVisibility(form, "incision_nombre", Boolean(ejecucion.incision?.nombre || ejecucion.incision?.tipo || ejecucion.incision?.descripcion));
        toggleFieldVisibility(form, "incision_tipo", Boolean(ejecucion.incision?.nombre || ejecucion.incision?.tipo || ejecucion.incision?.descripcion));
        toggleFieldVisibility(form, "incision_descripcion", Boolean(ejecucion.incision?.nombre || ejecucion.incision?.tipo || ejecucion.incision?.descripcion));
        toggleFieldVisibility(form, "incision_imagen", Boolean(ejecucion.incision?.imagen));

        toggleFieldVisibility(form, "ejecucion_pasos", Array.isArray(ejecucion.pasos) && ejecucion.pasos.length > 0);

        setSaveStatus("Planeamiento cargado.", "info");
        return;
    }

    setFormValue(form, "nombre", record.nombre || "");
    setFormValue(form, "categoria", record.categoria || "");
    setFormValue(form, "variante", record.variante || "");
    setFormValue(form, "orden", record.orden ?? "");
    setFormValue(form, "descripcion_corta", record.descripcion_corta || "");
    setFormValue(form, "definicion", record.definicion || "");
    setFormValue(form, "caracteristicas", toTextareaValue(record.caracteristicas || []));
    setFormValue(form, "partes", toTextareaValue(record.partes || []));
    setFormValue(form, "usos", toTextareaValue(record.usos || []));
    setFormValue(form, "funcionamiento", toTextareaValue(record.funcionamiento || []));

    setSaveStatus("Equipo cargado.", "info");
}



function clearForm() {
    state.selectedId = null;
    elements.form?.reset();
    if (elements.form) {
    elements.form.querySelectorAll(".admin-field").forEach((field) => {
        field.hidden = false;
    });
}
    if (elements.form) {
        elements.form.docId.value = "";
        if (elements.recordTypeInput) {
            elements.recordTypeInput.value = state.activeType;
        }
        if (elements.equiposSection) {
            elements.equiposSection.hidden = state.activeType !== "equipos";
        }
        if (elements.planeamientosSection) {
            elements.planeamientosSection.hidden = state.activeType !== "planeamientos";
        }
    }
    renderList();
    setSaveStatus("Creando nuevo registro.", "info");
}

async function handleSave(event) {
    event.preventDefault();
    if (!elements.form) {
        return;
    }

    const payload = readFormData();
    const records = getRecordsByType(state.activeType);
    const selectedRecord = records.find((item) => String(item.docId || item.id) === String(state.selectedId));

    try {
        const collectionName = getCollectionName(state.activeType);
        const sourceMode = state.sourceMode[state.activeType];

        if (state.activeType === "planeamientos") {
    const planeamientoPayload = buildPlaneamientoPayload(payload);

    if (selectedRecord?.docId) {
        await updateDoc(doc(db, collectionName, selectedRecord.docId), planeamientoPayload);
        setStatus("Planeamiento actualizado en Firestore.", "success");
    } else {
        await setDoc(doc(db, collectionName, buildPlaneamientoDocId(planeamientoPayload)), planeamientoPayload);
        setStatus("Planeamiento creado en Firestore.", "success");
    }

    await loadPlaneamientos();
    renderList("planeamientos");
    clearForm();
    return;
}

        if (sourceMode === "firestore") {
            if (selectedRecord?.docId) {
                await updateDoc(doc(db, collectionName, selectedRecord.docId), payload);
                setStatus("Equipo actualizado en Firestore.", "success");
            } else {
                await addDoc(collection(db, collectionName), payload);
                setStatus("Equipo creado en Firestore.", "success");
            }

            await loadEquipos();
        } else {
            if (selectedRecord) {
                Object.assign(selectedRecord, payload, {
                    docId: selectedRecord.docId || null,
                    sourceMode: "local"
                });
                setStatus("Cambios guardados en vista local.", "warning");
            } else {
                state.equipos.push({
                    ...payload,
                    id: Date.now(),
                    docId: null,
                    recordType: "equipos",
                    sourceMode: "local"
                });
                setStatus("Nuevo equipo agregado en vista local.", "warning");
            }

            state.equipos = state.equipos.sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0));
        }

        renderList("equipos");
        clearForm();
    } catch (error) {
        console.error("Error al guardar:", error);
        setStatus("No se pudo guardar. Revisa la conexión y las reglas de Firestore.", "error");
    }
}

async function handleDelete() {
    const records = getRecordsByType(state.activeType);
    const selectedRecord = records.find((item) => String(item.docId || item.id) === String(state.selectedId));
    if (!selectedRecord) {
        setStatus(`Selecciona un ${state.activeType === "planeamientos" ? "planeamiento" : "equipo"} para eliminar.`, "warning");
        return;
    }

    const confirmed = window.confirm(`¿Eliminar ${state.activeType === "planeamientos" ? (selectedRecord.titulo || "este planeamiento") : (selectedRecord.nombre || "este equipo")}?`);
    if (!confirmed) {
        return;
    }

    try {
        const collectionName = getCollectionName(state.activeType);
        const sourceMode = state.sourceMode[state.activeType];

        if (sourceMode === "firestore" && selectedRecord.docId) {
            await deleteDoc(doc(db, collectionName, selectedRecord.docId));
            setStatus(`${state.activeType === "planeamientos" ? "Planeamiento" : "Equipo"} eliminado de Firestore.`, "success");
            if (state.activeType === "planeamientos") {
                await loadPlaneamientos();
            } else {
                await loadEquipos();
            }
        } else {
            if (state.activeType === "planeamientos") {
                state.planeamientos = state.planeamientos.filter((item) => String(item.docId || item.id) !== String(state.selectedId));
                renderList("planeamientos");
            } else {
                state.equipos = state.equipos.filter((item) => String(item.docId || item.id) !== String(state.selectedId));
                renderList("equipos");
            }
            setStatus(`${state.activeType === "planeamientos" ? "Planeamiento" : "Equipo"} eliminado de la vista local.`, "warning");
        }

        clearForm();
    } catch (error) {
        console.error("Error al eliminar:", error);
        setStatus("No se pudo eliminar. Revisa la conexión y las reglas de Firestore.", "error");
    }
}

function renderList(type = state.activeType) {
    const list = getListElement(type);
    if (!list) {
        return;
    }

    const records = [...getRecordsByType(type)].sort((a, b) => {
        const aOrder = type === "planeamientos" ? (a.id ?? a.orden ?? 0) : (a.orden ?? 0);
        const bOrder = type === "planeamientos" ? (b.id ?? b.orden ?? 0) : (b.orden ?? 0);
        return Number(aOrder) - Number(bOrder);
    });
    if (elements.count && type === state.activeType) {
        elements.count.textContent = `${records.length} registro${records.length === 1 ? "" : "s"}`;
    }
    if (elements.emptyState && type === state.activeType) {
        elements.emptyState.hidden = records.length > 0;
    }

    list.innerHTML = records.map((record) => {
        const itemId = String(record.docId || record.id);
        const isActive = type === state.activeType && itemId === String(state.selectedId);
        const sourceLabel = record.sourceMode === "firestore" ? "Firestore" : "Vista local";

        if (type === "planeamientos") {
            return `
                <button type="button" class="admin-item ${isActive ? "is-active" : ""}" data-planeamiento-id="${escapeHtml(itemId)}">
                    <span class="admin-item-top">
                        <strong>${escapeHtml(record.titulo || "Sin título")}</strong>
                        <span class="admin-mini-badge">${escapeHtml(sourceLabel)}</span>
                    </span>
                    <span class="admin-item-meta">#${escapeHtml(record.id ?? "?")} · ${escapeHtml(record.organo || "Sin órgano")}${record.tipo ? ` · ${escapeHtml(record.tipo)}` : ""}</span>
                    <span class="admin-item-description">${escapeHtml(record.resumen || "Sin resumen")}</span>
                </button>
            `;
        }

        return `
            <button type="button" class="admin-item ${isActive ? "is-active" : ""}" data-equipo-id="${escapeHtml(itemId)}">
                <span class="admin-item-top">
                    <strong>${escapeHtml(record.nombre || "Sin nombre")}</strong>
                    <span class="admin-mini-badge">${escapeHtml(sourceLabel)}</span>
                </span>
                <span class="admin-item-meta">${escapeHtml(record.categoria || "Sin categoría")}${record.variante ? ` · ${escapeHtml(record.variante)}` : ""}</span>
                <span class="admin-item-description">${escapeHtml(record.descripcion_corta || "Sin descripción")}</span>
            </button>
        `;
    }).join("");
}

function readFormData() {
    const form = elements.form;
    if (state.activeType === "planeamientos") {
    return {
        recordType: "planeamientos",
        id: Number(getFormValue(form, "id")) || 0,
        titulo: getFormValue(form, "titulo"),
        organo: getFormValue(form, "organo"),
        tipo: getFormValue(form, "tipo") || "planeamiento-complejo",

        planeacion_objetivo: getFormValue(form, "planeacion_objetivo"),
        anatomia_titulo: getFormValue(form, "anatomia_titulo"),
        anatomia_contenido: getFormValue(form, "anatomia_contenido"),
        anatomia_imagen: getFormValue(form, "anatomia_imagen"),
        partes_items: getFormValue(form, "partes_items"),
        irrigacion_titulo: getFormValue(form, "irrigacion_titulo"),
        irrigacion_contenido: getFormValue(form, "irrigacion_contenido"),
        irrigacion_imagen: getFormValue(form, "irrigacion_imagen"),
        fisiologia_funciones: getFormValue(form, "fisiologia_funciones"),
        checklist_instrumental: getFormValue(form, "checklist_instrumental"),
        checklist_equipos: getFormValue(form, "checklist_equipos"),
        checklist_suturas: getFormValue(form, "checklist_suturas"),
        checklist_farmacos: getFormValue(form, "checklist_farmacos"),

        mesa_mayo_imagen: getFormValue(form, "mesa_mayo_imagen"),
        mesa_reserva_imagen: getFormValue(form, "mesa_reserva_imagen"),
        posicion_nombre: getFormValue(form, "posicion_nombre"),
        posicion_descripcion: getFormValue(form, "posicion_descripcion"),
        posicion_imagen: getFormValue(form, "posicion_imagen"),
        equipo_roles: getFormValue(form, "equipo_roles"),
        equipo_imagen: getFormValue(form, "equipo_imagen"),

        anestesia: getFormValue(form, "anestesia"),
        anestesia_imagen: getFormValue(form, "anestesia_imagen"),
        incision_nombre: getFormValue(form, "incision_nombre"),
        incision_tipo: getFormValue(form, "incision_tipo"),
        incision_descripcion: getFormValue(form, "incision_descripcion"),
        incision_imagen: getFormValue(form, "incision_imagen"),
        ejecucion_pasos: getFormValue(form, "ejecucion_pasos")
    };
    }
}

function toggleFieldVisibility(form, fieldName, shouldShow) {
    const field = form.elements.namedItem(fieldName);
    if (!field) return;

    const wrapper = field.closest(".admin-field");
    if (wrapper) {
        wrapper.hidden = !shouldShow;
    }
}

function buildPlaneamientoPayload(payload) {
    return {
        recordType: "planeamientos",
        id: Number.isFinite(Number(payload.id)) ? Number(payload.id) : 0,
        titulo: payload.titulo,
        organo: payload.organo,
        tipo: payload.tipo || "planeamiento-complejo",
        etapas: {
            planeacion: {
                objetivo: payload.planeacion_objetivo,
                anatomia: {
                    titulo: payload.anatomia_titulo,
                    contenido: payload.anatomia_contenido,
                    imagen: payload.anatomia_imagen
                },
                partes: {
                    titulo: "Partes",
                    items: parsePartesTextarea(payload.partes_items)
                },
                irrigacion: {
                    titulo: payload.irrigacion_titulo,
                    contenido: payload.irrigacion_contenido,
                    imagen: payload.irrigacion_imagen
                },
                fisiologia: {
                    titulo: "Fisiología",
                    funciones: parseFuncionesTextarea(payload.fisiologia_funciones)
                },
                checklist: {
                    titulo: "Lista de chequeo",
                    categorias: {
                        instrumental: toArrayValue(payload.checklist_instrumental),
                        equipos: toArrayValue(payload.checklist_equipos),
                        suturas: toArrayValue(payload.checklist_suturas),
                        farmacos: toArrayValue(payload.checklist_farmacos)
                    }
                }
            },
            organizacion: {
                mesaMayo: {
                    titulo: "Mesa de Mayo",
                    items: [],
                    imagen: payload.mesa_mayo_imagen
                },
                mesaReserva: {
                    titulo: "Mesa de Reserva",
                    items: [],
                    imagen: payload.mesa_reserva_imagen
                },
                posicionPaciente: {
                    titulo: "Posición del paciente",
                    nombre: payload.posicion_nombre,
                    descripcion: payload.posicion_descripcion,
                    imagen: payload.posicion_imagen
                },
                equipoQuirurgico: {
                    titulo: "Ubicación del equipo quirúrgico",
                    roles: parseRolesTextarea(payload.equipo_roles),
                    imagen: payload.equipo_imagen
                }
            },
            ejecucion: {
                anestesia: payload.anestesia,
                anestesiaImagen: payload.anestesia_imagen,
                incision: {
                    nombre: payload.incision_nombre,
                    tipo: payload.incision_tipo,
                    descripcion: payload.incision_descripcion,
                    imagen: payload.incision_imagen
                },
                pasos: parsePasosTextarea(payload.ejecucion_pasos)
            }
        }
    };
}

function buildPlaneamientoDocId(payload) {
    const organoSlug = slugify(payload.organo || "planeamiento");
    const idPart = Number.isFinite(Number(payload.id)) && Number(payload.id) > 0 ? Number(payload.id) : Date.now();
    return `${organoSlug}-${idPart}`;
}

function parseJsonField(value, label) {
    if (!value || !String(value).trim()) {
        return {};
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        throw new Error(`El JSON de ${label} no es válido.`);
    }
}

function setFormValue(form, fieldName, value) {
    const field = form.elements.namedItem(fieldName);
    if (!field) {
        return;
    }

    field.value = String(value ?? "");
}

function getFormValue(form, fieldName) {
    const field = form.elements.namedItem(fieldName);
    if (!field || typeof field.value !== "string") {
        return "";
    }

    return field.value.trim();
}

function slugify(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
}

function toArrayValue(value) {
    return String(value)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function toTextareaValue(value) {
    return Array.isArray(value) ? value.join("\n") : "";
}

function setStatus(message, tone = "info") {
    if (!elements.saveStatus) {
        return;
    }

    elements.saveStatus.textContent = message;
    elements.saveStatus.dataset.tone = tone;
    if (elements.actionMessage) {
        elements.actionMessage.textContent = message;
        elements.actionMessage.dataset.tone = tone;
    }
}

function setLoginMessage(message, tone = "info") {
    if (!elements.loginMessage) {
        return;
    }

    elements.loginMessage.textContent = message;
    elements.loginMessage.dataset.tone = tone;
}

function toPartesTextarea(items) {
    return Array.isArray(items)
        ? items.map((item) => [item.nombre || "", item.descripcion || "", item.imagen || ""].join(" | ")).join("\n")
        : "";
}

function parsePartesTextarea(value) {
    return String(value)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [nombre = "", descripcion = "", imagen = ""] = line.split("|").map((part) => part.trim());
            return { nombre, descripcion, ...(imagen ? { imagen } : {}) };
        });
}

function toFuncionesTextarea(items) {
    return Array.isArray(items)
        ? items.map((item) => [item.nombre || "", item.descripcion || ""].join(" | ")).join("\n")
        : "";
}

function parseFuncionesTextarea(value) {
    return String(value)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [nombre = "", descripcion = ""] = line.split("|").map((part) => part.trim());
            return { nombre, descripcion };
        });
}

function toRolesTextarea(items) {
    return Array.isArray(items)
        ? items.map((item) => [item.rol || "", item.posicion || ""].join(" | ")).join("\n")
        : "";
}

function parseRolesTextarea(value) {
    return String(value)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [rol = "", posicion = ""] = line.split("|").map((part) => part.trim());
            return { rol, posicion };
        });
}

function toPasosTextarea(items) {
    return Array.isArray(items)
        ? items.map((item) => {
            const instrumental = Array.isArray(item.instrumental) ? item.instrumental.join(", ") : "";
            return `Paso: ${item.paso || ""}\nTecnica: ${item.tecnica || ""}\nInstrumental: ${instrumental}`;
        }).join("\n\n")
        : "";
}

function parsePasosTextarea(value) {
    return String(value)
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            const lines = block.split(/\r?\n/).map((line) => line.trim());
            const pasoLine = lines.find((line) => line.toLowerCase().startsWith("paso:")) || "";
            const tecnicaLine = lines.find((line) => line.toLowerCase().startsWith("tecnica:")) || "";
            const instrumentalLine = lines.find((line) => line.toLowerCase().startsWith("instrumental:")) || "";

            return {
                paso: Number(pasoLine.replace(/^paso:\s*/i, "").trim()) || 0,
                tecnica: tecnicaLine.replace(/^tecnica:\s*/i, "").trim(),
                instrumental: instrumentalLine
                    .replace(/^instrumental:\s*/i, "")
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
            };
        });
}

function setSaveStatus(message, tone = "info") {
    setStatus(message, tone);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}