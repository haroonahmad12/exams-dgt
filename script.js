// ============================================================================
// DGT Exam Practice Platform - Main Application Logic
// Version 2.0 - Enhanced UI with Toast, Timer, History & Dark Mode
// ============================================================================

// ============================================================================
// Toast Notification System
// ============================================================================
class ToastManager {
  constructor(containerId = "toastContainer") {
    this.container = document.getElementById(containerId);
    this.toasts = [];
    this.maxToasts = 5;
  }

  show(message, type = "info", title = null, duration = 4000) {
    // Limit number of toasts
    if (this.toasts.length >= this.maxToasts) {
      this.remove(this.toasts[0].id);
    }

    const id = `toast-${Date.now()}`;
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    const titles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.id = id;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${title || titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
      <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    // Add close button handler
    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.remove(id);
    });

    this.container.appendChild(toast);
    this.toasts.push({ id, element: toast });

    // Auto remove after duration
    setTimeout(() => this.remove(id), duration);

    return id;
  }

  remove(id) {
    const toastData = this.toasts.find((t) => t.id === id);
    if (toastData) {
      toastData.element.classList.add("removing");
      setTimeout(() => {
        toastData.element.remove();
        this.toasts = this.toasts.filter((t) => t.id !== id);
      }, 250);
    }
  }

  success(message, title = null) {
    return this.show(message, "success", title);
  }

  error(message, title = null) {
    return this.show(message, "error", title, 6000);
  }

  warning(message, title = null) {
    return this.show(message, "warning", title, 5000);
  }

  info(message, title = null) {
    return this.show(message, "info", title);
  }
}

// ============================================================================
// Modal Dialog System
// ============================================================================
class ModalManager {
  constructor() {
    this.backdrop = document.getElementById("modalBackdrop");
    this.modalIcon = document.getElementById("modalIcon");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalBody = document.getElementById("modalBody");
    this.cancelBtn = document.getElementById("modalCancelBtn");
    this.confirmBtn = document.getElementById("modalConfirmBtn");
    this.resolvePromise = null;

    this.setupListeners();
  }

  setupListeners() {
    this.cancelBtn.addEventListener("click", () => this.close(false));
    this.confirmBtn.addEventListener("click", () => this.close(true));
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.close(false);
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.backdrop.classList.contains("hidden")) {
        this.close(false);
      }
    });
  }

  confirm({
    title = "Confirm Action",
    message = "Are you sure?",
    icon = "⚠️",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmClass = "btn-danger",
  }) {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      this.modalIcon.textContent = icon;
      this.modalTitle.textContent = title;
      this.modalBody.textContent = message;
      this.cancelBtn.textContent = cancelText;
      this.confirmBtn.textContent = confirmText;
      this.confirmBtn.className = `btn ${confirmClass}`;
      this.backdrop.classList.remove("hidden");
      this.confirmBtn.focus();
    });
  }

  close(result) {
    this.backdrop.classList.add("hidden");
    if (this.resolvePromise) {
      this.resolvePromise(result);
      this.resolvePromise = null;
    }
  }
}

// ============================================================================
// Confetti Animation
// ============================================================================
class ConfettiManager {
  constructor(containerId = "confettiContainer") {
    this.container = document.getElementById(containerId);
    this.colors = [
      "#667eea",
      "#764ba2",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#3b82f6",
      "#ec4899",
    ];
  }

  launch(count = 100) {
    this.container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.backgroundColor =
        this.colors[Math.floor(Math.random() * this.colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + "s";
      confetti.style.animationDuration = 2 + Math.random() * 2 + "s";

      // Random shapes
      const shapes = ["circle", "square", "triangle"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === "circle") {
        confetti.style.borderRadius = "50%";
      } else if (shape === "triangle") {
        confetti.style.width = "0";
        confetti.style.height = "0";
        confetti.style.borderLeft = "5px solid transparent";
        confetti.style.borderRight = "5px solid transparent";
        confetti.style.borderBottom = `10px solid ${confetti.style.backgroundColor}`;
        confetti.style.backgroundColor = "transparent";
      }

      this.container.appendChild(confetti);
    }

    // Clean up after animation
    setTimeout(() => {
      this.container.innerHTML = "";
    }, 5000);
  }
}

// ============================================================================
// Theme Manager (Dark Mode)
// ============================================================================
class ThemeManager {
  constructor() {
    this.toggle = document.getElementById("themeToggle");
    this.icon = document.getElementById("themeIcon");
    this.currentTheme = localStorage.getItem("theme") || "light";

    this.applyTheme(this.currentTheme);
    this.setupListener();
  }

  setupListener() {
    if (!this.toggle) return;
    this.toggle.addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      this.applyTheme(this.currentTheme);
      localStorage.setItem("theme", this.currentTheme);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (this.icon) {
      this.icon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    // Update aria-label for accessibility
    if (this.toggle) {
      this.toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }
}

// ============================================================================
// Internationalization (i18n) Manager
// ============================================================================
class I18nManager {
  constructor() {
    this.translations = {
      es: {
        // App Header & General
        appTitle: "Práctica Examen DGT",
        appSubtitle: "Domina el Test Teórico de Conducir",
        
        // Home Screen
        selectLanguage: "Selecciona el Idioma del Examen",
        howItWorks: "Cómo funciona",
        info1: "30 preguntas aleatorias por examen",
        info2: "30 minutos para completar (como el test real)",
        info3: "Aprueba con 3 o menos respuestas incorrectas",
        info4: "Revisa explicaciones detalladas después de cada examen",
        startExam: "Comenzar Examen de Práctica",
        startHint: "Selecciona primero un idioma para habilitar este botón",
        
        // Statistics
        yourStats: "Tus Estadísticas",
        totalExams: "Total Exámenes",
        passed: "Aprobados",
        failed: "Suspendidos",
        
        // History
        recentExams: "Exámenes Recientes",
        clearAll: "Borrar Todo",
        noHistory: "Aún no hay historial. ¡Comienza tu primer examen de práctica!",
        
        // Exam Screen
        question: "Pregunta",
        of: "de",
        exit: "Salir",
        previous: "Anterior",
        next: "Siguiente",
        submitExam: "Entregar Examen",
        answered: "Respondidas",
        selectAnswer: "Por favor, selecciona una respuesta antes de continuar.",
        
        // Results Screen
        congratulations: "¡Felicidades! ¡Has Aprobado!",
        keepPracticing: "¡Sigue Practicando!",
        totalQuestions: "Total Preguntas",
        correct: "Correctas",
        incorrect: "Incorrectas",
        score: "Puntuación",
        timeTaken: "Tiempo",
        reviewAnswers: "Revisar Respuestas",
        startNewExam: "Nuevo Examen",
        passMessage: "¡Excelente trabajo! Has conseguido {score}% con solo {incorrect} respuesta(s) incorrecta(s). ¡Estás listo para el examen real!",
        failMessage: "Has conseguido {score}% con {incorrect} respuestas incorrectas. Necesitas 3 o menos incorrectas para aprobar. ¡Revisa tus respuestas e inténtalo de nuevo!",
        
        // Review Screen
        review: "Revisión",
        all: "Todas",
        incorrectFilter: "Incorrectas",
        correctFilter: "Correctas",
        yourAnswer: "Tu Respuesta",
        correctAnswer: "Respuesta Correcta",
        explanation: "Explicación",
        notAnswered: "Sin responder",
        finishReview: "Finalizar Revisión",
        backToResults: "Volver a Resultados",
        backToHome: "Volver al Inicio",
        
        // History Detail
        history: "Historial",
        answerGiven: "Respuesta Dada",
        
        // Toasts & Modals
        ready: "Listo para Practicar",
        questionsLoaded: "preguntas cargadas correctamente!",
        loadingError: "Error de Carga",
        loadingErrorMsg: "Error al cargar los datos del examen. Por favor, actualiza la página e inténtalo de nuevo.",
        language: "Idioma",
        languageSet: "Idioma establecido a",
        examStarted: "Examen Iniciado",
        goodLuck: "¡Buena suerte! Tienes 30 minutos.",
        timesUp: "¡Se Acabó el Tiempo!",
        timesUpMsg: "¡El tiempo ha terminado! Tu examen se enviará automáticamente.",
        exitExam: "¿Salir del Examen?",
        exitExamMsg: "Has respondido {answered} de 30 preguntas. Perderás tu progreso si sales ahora.",
        exitBtn: "Salir del Examen",
        continueBtn: "Continuar Examen",
        wellDone: "¡Bien Hecho!",
        youPassed: "¡Has aprobado el examen!",
        notQuite: "Casi",
        needMorePractice: "Necesitas más práctica. ¡Revisa tus respuestas!",
        clearHistory: "Borrar Todo el Historial",
        clearHistoryMsg: "¿Estás seguro de que quieres borrar todo el historial de exámenes? Esta acción no se puede deshacer.",
        deleteAll: "Borrar Todo",
        cancel: "Cancelar",
        historyCleared: "Historial Borrado",
        historyError: "Error de Historial",
        historyErrorMsg: "Los datos de este examen están incompletos y no se pueden ver.",
        storageError: "Error de Almacenamiento",
        storageErrorMsg: "Error al guardar el examen en el historial",
        filter: "Filtro",
        noQuestionsMatch: "No hay preguntas que coincidan con este filtro.",
        loading: "Cargando pregunta..."
      },
      en: {
        // App Header & General
        appTitle: "DGT Exam Practice",
        appSubtitle: "Master the Spanish Driving Theory Test",
        
        // Home Screen
        selectLanguage: "Select Exam Language",
        howItWorks: "How it works",
        info1: "30 random questions per exam",
        info2: "30 minutes to complete (like the real test)",
        info3: "Pass with 3 or fewer incorrect answers",
        info4: "Review detailed explanations after each exam",
        startExam: "Start Practice Exam",
        startHint: "Select a language first to enable this button",
        
        // Statistics
        yourStats: "Your Statistics",
        totalExams: "Total Exams",
        passed: "Passed",
        failed: "Failed",
        
        // History
        recentExams: "Recent Exams",
        clearAll: "Clear All",
        noHistory: "No exam history yet. Start your first practice exam!",
        
        // Exam Screen
        question: "Question",
        of: "of",
        exit: "Exit",
        previous: "Previous",
        next: "Next",
        submitExam: "Submit Exam",
        answered: "Answered",
        selectAnswer: "Please select an answer before continuing.",
        
        // Results Screen
        congratulations: "Congratulations! You Passed!",
        keepPracticing: "Keep Practicing!",
        totalQuestions: "Total Questions",
        correct: "Correct",
        incorrect: "Incorrect",
        score: "Score",
        timeTaken: "Time Taken",
        reviewAnswers: "Review Answers",
        startNewExam: "Start New Exam",
        passMessage: "Excellent work! You scored {score}% with only {incorrect} incorrect answer(s). You're ready for the real exam!",
        failMessage: "You scored {score}% with {incorrect} incorrect answers. You need 3 or fewer incorrect to pass. Review your answers and try again!",
        
        // Review Screen
        review: "Review",
        all: "All",
        incorrectFilter: "Incorrect",
        correctFilter: "Correct",
        yourAnswer: "Your Answer",
        correctAnswer: "Correct Answer",
        explanation: "Explanation",
        notAnswered: "Not answered",
        finishReview: "Finish Review",
        backToResults: "Back to Results",
        backToHome: "Back to Home",
        
        // History Detail
        history: "History",
        answerGiven: "Answer Given",
        
        // Toasts & Modals
        ready: "Ready to Practice",
        questionsLoaded: "questions loaded successfully!",
        loadingError: "Loading Error",
        loadingErrorMsg: "Failed to load exam data. Please refresh the page and try again.",
        language: "Language",
        languageSet: "Language set to",
        examStarted: "Exam Started",
        goodLuck: "Good luck! You have 30 minutes.",
        timesUp: "Time's Up!",
        timesUpMsg: "Time is up! Your exam will be submitted automatically.",
        exitExam: "Exit Exam?",
        exitExamMsg: "You have answered {answered} of 30 questions. Your progress will be lost if you exit now.",
        exitBtn: "Exit Exam",
        continueBtn: "Continue Exam",
        wellDone: "Well Done!",
        youPassed: "You passed the exam!",
        notQuite: "Not Quite",
        needMorePractice: "You need more practice. Review your answers!",
        clearHistory: "Clear All History",
        clearHistoryMsg: "Are you sure you want to delete all exam history? This action cannot be undone.",
        deleteAll: "Delete All",
        cancel: "Cancel",
        historyCleared: "History Cleared",
        historyError: "History Error",
        historyErrorMsg: "This exam data is incomplete and cannot be viewed.",
        storageError: "Storage Error",
        storageErrorMsg: "Failed to save exam to history",
        filter: "Filter",
        noQuestionsMatch: "No questions match this filter.",
        loading: "Loading question..."
      }
    };

    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem("appLanguage");
    if (stored && this.translations[stored]) {
      return stored;
    }

    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0].toLowerCase();

    // Default to Spanish if not English
    if (langCode === "en") {
      return "en";
    }
    return "es";
  }

  init() {
    this.setupDropdown();
    this.applyTranslations();
    this.updateDropdownUI();
  }

  setupDropdown() {
    const btn = document.getElementById("appLangBtn");
    const dropdown = document.getElementById("appLangDropdown");
    const selector = document.getElementById("appLangSelector");

    if (!btn || !dropdown) return;

    // Toggle dropdown on button click
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains("hidden");
      if (isOpen) {
        dropdown.classList.add("hidden");
        selector.classList.remove("open");
      } else {
        dropdown.classList.remove("hidden");
        selector.classList.add("open");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.add("hidden");
        selector.classList.remove("open");
      }
    });

    // Handle language option clicks
    dropdown.querySelectorAll(".app-lang-option").forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.dataset.lang;
        this.setLanguage(lang);
        dropdown.classList.add("hidden");
        selector.classList.remove("open");
      });
    });
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    
    this.currentLang = lang;
    localStorage.setItem("appLanguage", lang);
    this.applyTranslations();
    this.updateDropdownUI();
  }

  updateDropdownUI() {
    const flag = document.getElementById("appLangFlag");
    const code = document.getElementById("appLangCode");
    const options = document.querySelectorAll(".app-lang-option");

    const flags = { es: "🇪🇸", en: "🇬🇧" };
    const codes = { es: "ES", en: "EN" };

    if (flag) flag.textContent = flags[this.currentLang] || "🇪🇸";
    if (code) code.textContent = codes[this.currentLang] || "ES";

    // Update active state on options
    options.forEach((option) => {
      if (option.dataset.lang === this.currentLang) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = this.get(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Update html lang attribute
    document.documentElement.lang = this.currentLang === "es" ? "es" : "en";
  }

  get(key, replacements = {}) {
    let text = this.translations[this.currentLang]?.[key] || 
               this.translations.en?.[key] || 
               key;
    
    // Replace placeholders like {score}, {incorrect}, etc.
    Object.keys(replacements).forEach((placeholder) => {
      text = text.replace(new RegExp(`{${placeholder}}`, "g"), replacements[placeholder]);
    });
    
    return text;
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

// ============================================================================
// Timer Manager
// ============================================================================
class TimerManager {
  constructor(onTimeUp) {
    this.container = document.getElementById("timerContainer");
    this.display = document.getElementById("timerValue");
    this.onTimeUp = onTimeUp;
    this.interval = null;
    this.totalSeconds = 30 * 60; // 30 minutes
    this.remainingSeconds = this.totalSeconds;
    this.startTime = null;
    this.elapsedTime = 0;
  }

  start() {
    this.remainingSeconds = this.totalSeconds;
    this.startTime = Date.now();
    this.updateDisplay();
    this.container.classList.remove("warning", "danger");

    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.updateDisplay();

      // Warning at 5 minutes
      if (this.remainingSeconds === 300) {
        this.container.classList.add("warning");
      }

      // Danger at 1 minute
      if (this.remainingSeconds === 60) {
        this.container.classList.remove("warning");
        this.container.classList.add("danger");
      }

      // Time's up
      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onTimeUp) this.onTimeUp();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    this.elapsedTime = 0;
    this.startTime = null;
    this.updateDisplay();
    this.container.classList.remove("warning", "danger");
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  getElapsedTime() {
    return this.elapsedTime;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

// ============================================================================
// Main Application Class
// ============================================================================
class DGTExamPlatform {
  constructor() {
    this.allQuestions = [];
    this.currentExam = [];
    this.currentLanguage = "E"; // Default: English
    this.currentQuestionIndex = 0;
    this.reviewQuestionIndex = 0;
    this.historyQuestionIndex = 0;
    this.userAnswers = {}; // Track user answers: { questionId: answerIndex }
    this.examHistory = [];
    this.currentHistoryExam = null;
    this.reviewFilter = "all";
    this.filteredQuestions = [];
    this.isLoading = true;

    // Initialize managers
    this.toast = new ToastManager();
    this.modal = new ModalManager();
    this.confetti = new ConfettiManager();
    this.theme = new ThemeManager();
    this.i18n = new I18nManager();
    this.timer = new TimerManager(() => this.handleTimeUp());

    this.initEventListeners();
    this.loadData();
    this.loadStats();
    this.renderHistory();
  }

  // ========== Data Loading ==========
  async loadData() {
    this.showLoading(true);
    try {
      const response = await fetch("pdd-v2.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.allQuestions = data.Questions;
      console.log(`Loaded ${this.allQuestions.length} questions`);
      this.isLoading = false;
      this.showLoading(false);
      this.toast.success(
        `${this.allQuestions.length} ${this.i18n.get("questionsLoaded")}`,
        this.i18n.get("ready")
      );
    } catch (error) {
      console.error("Failed to load question data:", error);
      this.showLoading(false);
      this.toast.error(
        this.i18n.get("loadingErrorMsg"),
        this.i18n.get("loadingError")
      );
    }
  }

  showLoading(show) {
    const loadingEl = document.getElementById("questionLoading");
    const questionSection = document.getElementById("questionSection");
    const answersSection = document.querySelector(".answers-section");
    const examFooter = document.querySelector(".exam-footer");
    if (loadingEl) {
      loadingEl.style.display = show ? "flex" : "none";
      if (questionSection) questionSection.style.display = show ? "none" : "flex";
      if (answersSection) answersSection.style.display = show ? "none" : "flex";
      if (examFooter) examFooter.style.display = show ? "none" : "flex";
    }
  }

  loadStats() {
    const history = this.getExamHistory();
    this.examHistory = history;
    this.updateStatsDisplay();
  }

  getExamHistory() {
    try {
      const stored = localStorage.getItem("dgtExamHistory");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading exam history:", error);
      return [];
    }
  }

  saveExamToHistory(examResult) {
    try {
      // Keep only the last 10 exams
      if (this.examHistory.length >= 10) {
        this.examHistory = this.examHistory.slice(-9);
      }
      this.examHistory.push(examResult);
      localStorage.setItem("dgtExamHistory", JSON.stringify(this.examHistory));
    } catch (error) {
      console.error("Error saving exam history:", error);
      this.toast.error(this.i18n.get("storageErrorMsg"), this.i18n.get("storageError"));
    }
  }

  updateStatsDisplay() {
    const total = this.examHistory.length;
    const passed = this.examHistory.filter((r) => r.passed).length;
    const failed = total - passed;

    document.getElementById("totalExams").textContent = total;
    document.getElementById("passedExams").textContent = passed;
    document.getElementById("failedExams").textContent = failed;
  }

  // ========== History Rendering ==========
  renderHistory() {
    const historyList = document.getElementById("historyList");
    const historyEmpty = document.getElementById("historyEmpty");
    const historySection = document.getElementById("historySection");

    if (this.examHistory.length === 0) {
      historyList.style.display = "none";
      historyEmpty.style.display = "block";
      return;
    }

    historyList.style.display = "flex";
    historyEmpty.style.display = "none";

    // Sort by timestamp descending (newest first)
    const sortedHistory = [...this.examHistory].reverse();

    historyList.innerHTML = sortedHistory
      .map(
        (exam, index) => `
      <div class="history-item" data-index="${this.examHistory.length - 1 - index}" role="listitem" tabindex="0">
        <div class="history-item-left">
          <div class="history-badge ${exam.passed ? "passed" : "failed"}">
            ${exam.passed ? "✓" : "✗"}
          </div>
          <div class="history-info">
            <div class="history-date">${this.formatDate(exam.timestamp)}</div>
            <div class="history-score">${exam.correct}/${exam.correct + exam.incorrect} correct • ${exam.language}</div>
          </div>
        </div>
        <div class="history-item-right">
          <span class="history-percentage ${exam.passed ? "passed" : "failed"}">${exam.score}%</span>
          <span class="history-arrow">→</span>
        </div>
      </div>
    `
      )
      .join("");

    // Add click handlers
    historyList.querySelectorAll(".history-item").forEach((item) => {
      item.addEventListener("click", () => {
        const index = parseInt(item.dataset.index);
        this.viewHistoryExam(index);
      });
      item.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const index = parseInt(item.dataset.index);
          this.viewHistoryExam(index);
        }
      });
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  viewHistoryExam(index) {
    const exam = this.examHistory[index];
    if (!exam || !exam.questions) {
      this.toast.error(
        this.i18n.get("historyErrorMsg"),
        this.i18n.get("historyError")
      );
      return;
    }

    this.currentHistoryExam = exam;
    this.historyQuestionIndex = 0;
    this.displayHistoryQuestion();
    this.showScreen("historyDetailScreen");
  }

  displayHistoryQuestion() {
    if (!this.currentHistoryExam) return;

    const examData = this.currentHistoryExam;
    const questionData = examData.questions[this.historyQuestionIndex];
    const question = this.allQuestions.find((q) => q.Id === questionData.id);

    if (!question) {
      this.toast.error("Question not found in database.", "Error");
      return;
    }

    // Update summary
    document.getElementById("historyExamSummary").innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2);">
        <span><strong>${this.formatDate(examData.timestamp)}</strong></span>
        <span class="${examData.passed ? "passed" : "failed"}" style="font-weight: bold;">
          ${examData.passed ? "PASSED" : "FAILED"} - ${examData.score}%
        </span>
        <span>${examData.correct}/${examData.correct + examData.incorrect} correct</span>
      </div>
    `;

    // Update question text
    document.getElementById("historyQuestionText").textContent =
      this.getTextInCurrentLanguage(question.Q);

    // Handle question image
    const qImageContainer = document.getElementById(
      "historyQuestionImageContainer"
    );
    if (question.Img === true) {
      qImageContainer.style.display = "block";
      const img = document.getElementById("historyQuestionImage");
      img.src = `images/${question.Id}.jpg`;
      img.onerror = () => {
        qImageContainer.style.display = "none";
      };
    } else {
      qImageContainer.style.display = "none";
    }

    // Get answers
    const userAnswerIndex = questionData.userAnswer;
    const correctAnswerIndex = question.A.findIndex((a) => a.Y);
    const isCorrect = questionData.correct;

    // Display user's answer
    const userAnswerSection = document.getElementById("historyUserAnswerSection");
    const userAnswerDisplay = document.getElementById("historyUserAnswer");

    if (userAnswerIndex !== undefined && question.A[userAnswerIndex]) {
      const userAnswer = question.A[userAnswerIndex];
      userAnswerDisplay.textContent = this.getTextInCurrentLanguage(userAnswer.T);
      userAnswerSection.className = `review-answer-section ${isCorrect ? "correct" : "incorrect"}`;
    } else {
      userAnswerDisplay.textContent = "Not answered";
      userAnswerSection.className = "review-answer-section incorrect";
    }

    // Display correct answer if different
    const correctAnswerSection = document.getElementById("historyCorrectAnswerSection");
    const correctAnswerDisplay = document.getElementById("historyCorrectAnswer");

    if (!isCorrect && correctAnswerIndex >= 0) {
      correctAnswerDisplay.textContent = this.getTextInCurrentLanguage(
        question.A[correctAnswerIndex].T
      );
      correctAnswerSection.style.display = "block";
    } else {
      correctAnswerSection.style.display = "none";
    }

    // Display explanation
    document.getElementById("historyExplanation").innerHTML =
      this.getTextInCurrentLanguage(question.Rule);

    // Update progress
    const progress =
      ((this.historyQuestionIndex + 1) / examData.questions.length) * 100;
    document.getElementById("historyProgressFill").style.width = progress + "%";
    document.getElementById("historyCurrentQuestion").textContent =
      this.historyQuestionIndex + 1;
    document.getElementById("historyTotalQuestions").textContent =
      examData.questions.length;

    // Generate question dots
    this.generateQuestionDots(
      "historyQuestionDots",
      examData.questions.length,
      this.historyQuestionIndex,
      examData.questions.map((q) => q.correct),
      (index) => {
        this.historyQuestionIndex = index;
        this.displayHistoryQuestion();
      }
    );

    // Update button states
    document.getElementById("historyPrevBtn").disabled =
      this.historyQuestionIndex === 0;
    document.getElementById("historyNextBtn").textContent =
      this.historyQuestionIndex === examData.questions.length - 1
        ? "Back to Home"
        : "Next →";
  }

  async clearHistory() {
    const confirmed = await this.modal.confirm({
      title: this.i18n.get("clearHistory"),
      message: this.i18n.get("clearHistoryMsg"),
      icon: "🗑️",
      confirmText: this.i18n.get("deleteAll"),
      cancelText: this.i18n.get("cancel"),
      confirmClass: "btn-danger",
    });

    if (confirmed) {
      this.examHistory = [];
      localStorage.removeItem("dgtExamHistory");
      this.updateStatsDisplay();
      this.renderHistory();
      this.toast.success(
        this.i18n.get("historyCleared"),
        this.i18n.get("historyCleared")
      );
    }
  }

  // ========== Event Listeners ==========
  initEventListeners() {
    // Language selection
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.selectLanguage(e.target.closest(".lang-btn"))
      );
    });

    // Home screen
    document
      .getElementById("startBtn")
      .addEventListener("click", () => this.startExam());

    // Clear history button
    document
      .getElementById("clearHistoryBtn")
      .addEventListener("click", () => this.clearHistory());

    // Exam screen
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.previousQuestion());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextQuestion());
    document
      .getElementById("exitBtn")
      .addEventListener("click", () => this.exitExam());

    // Results screen
    document
      .getElementById("reviewBtn")
      .addEventListener("click", () => this.goToReview());
    document
      .getElementById("restartBtn")
      .addEventListener("click", () => this.goHome());

    // Review screen
    document
      .getElementById("reviewPrevBtn")
      .addEventListener("click", () => this.reviewPreviousQuestion());
    document
      .getElementById("reviewNextBtn")
      .addEventListener("click", () => this.reviewNextQuestion());
    document
      .getElementById("backToResultsBtn")
      .addEventListener("click", () => this.showScreen("resultsScreen"));

    // Review filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.reviewFilter = btn.dataset.filter;
        this.applyReviewFilter();
      });
    });

    // History detail screen
    document
      .getElementById("historyPrevBtn")
      .addEventListener("click", () => this.historyPreviousQuestion());
    document
      .getElementById("historyNextBtn")
      .addEventListener("click", () => this.historyNextQuestion());
    document
      .getElementById("backToHomeBtn")
      .addEventListener("click", () => this.goHome());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      const activeScreen = document.querySelector(".screen.active");
      if (!activeScreen) return;

      if (activeScreen.id === "examScreen") {
        if (e.key === "ArrowLeft") this.previousQuestion();
        if (e.key === "ArrowRight") this.nextQuestion();
        if (e.key >= "1" && e.key <= "4") {
          const index = parseInt(e.key) - 1;
          const options = document.querySelectorAll(".answer-option");
          if (options[index]) options[index].click();
        }
      }

      if (activeScreen.id === "reviewScreen") {
        if (e.key === "ArrowLeft") this.reviewPreviousQuestion();
        if (e.key === "ArrowRight") this.reviewNextQuestion();
      }
    });
  }

  // ========== Language Selection ==========
  selectLanguage(btn) {
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    this.currentLanguage = btn.dataset.lang;
    document.getElementById("startBtn").disabled = false;
    this.toast.info(
      `${this.i18n.get("languageSet")} ${this.getLanguageName()}`,
      this.i18n.get("language")
    );
  }

  getLanguageName() {
    const names = { E: "English", S: "Español", R: "Русский" };
    return names[this.currentLanguage];
  }

  getTextInCurrentLanguage(textObj) {
    if (!textObj) return "";
    return textObj[this.currentLanguage] || textObj.E || "";
  }

  // ========== Exam Management ==========
  startExam() {
    if (this.isLoading || this.allQuestions.length === 0) {
      this.toast.warning(
        this.i18n.get("loading"),
        this.i18n.get("loading")
      );
      return;
    }

    // Reset state
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    this.hideInlineError();

    // Generate 30 random questions
    this.currentExam = this.getRandomQuestions(30);
    console.log("Exam started with 30 random questions");

    // Start timer
    this.timer.reset();
    this.timer.start();

    // Navigate to exam screen
    this.showScreen("examScreen");
    this.displayCurrentQuestion();

    this.toast.info(this.i18n.get("goodLuck"), this.i18n.get("examStarted"));
  }

  getRandomQuestions(count) {
    const shuffled = [...this.allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  handleTimeUp() {
    this.toast.warning(
      this.i18n.get("timesUpMsg"),
      this.i18n.get("timesUp")
    );
    setTimeout(() => this.submitExam(), 1500);
  }

  displayCurrentQuestion() {
    const question = this.currentExam[this.currentQuestionIndex];

    // Update question text
    const questionText = this.getTextInCurrentLanguage(question.Q);
    document.getElementById("questionText").textContent = questionText;

    // Handle question image
    const qImageContainer = document.getElementById("questionImageContainer");
    if (question.Img === true) {
      qImageContainer.style.display = "block";
      const img = document.getElementById("questionImage");
      img.src = `images/${question.Id}.jpg`;
      img.alt = `Traffic scenario for question ${this.currentQuestionIndex + 1}`;
      img.onerror = () => {
        console.error(`Image not found: images/${question.Id}.jpg`);
        qImageContainer.style.display = "none";
      };
    } else {
      qImageContainer.style.display = "none";
    }

    // Display answers
    this.displayAnswers(question);

    // Update progress
    this.updateProgressBar();
    this.updateAnsweredCount();

    // Generate question dots
    this.generateQuestionDots(
      "questionDots",
      this.currentExam.length,
      this.currentQuestionIndex,
      this.currentExam.map((q) => q.Id in this.userAnswers),
      (index) => {
        this.currentQuestionIndex = index;
        this.displayCurrentQuestion();
      }
    );

    // Update button states
    document.getElementById("prevBtn").disabled =
      this.currentQuestionIndex === 0;

    const nextBtn = document.getElementById("nextBtn");
    if (this.currentQuestionIndex === this.currentExam.length - 1) {
      nextBtn.innerHTML = '<span aria-hidden="true">✓</span> Submit Exam';
    } else {
      nextBtn.innerHTML = 'Next <span aria-hidden="true">→</span>';
    }

    // Hide inline error
    this.hideInlineError();

    // Scroll to top
    document.querySelector(".exam-content").scrollTop = 0;
  }

  generateQuestionDots(
    containerId,
    total,
    currentIndex,
    statusArray,
    onClick
  ) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "question-dot";
      dot.setAttribute("aria-label", `Go to question ${i + 1}`);
      dot.setAttribute("title", `Question ${i + 1}`);

      if (i === currentIndex) {
        dot.classList.add("current");
      }

      if (statusArray[i]) {
        dot.classList.add("answered");
      }

      dot.addEventListener("click", () => onClick(i));
      container.appendChild(dot);
    }
  }

  displayAnswers(question) {
    const container = document.getElementById("answersContainer");
    container.innerHTML = "";

    const letters = ["A", "B", "C", "D"];

    question.A.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.className = "answer-option";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");
      btn.innerHTML = `
        <span class="answer-letter">${letters[index]}</span>
        <span class="answer-text">${this.getTextInCurrentLanguage(answer.T)}</span>
      `;
      btn.dataset.index = index;
      btn.dataset.correct = answer.Y;

      // Check if this answer was previously selected
      if (this.userAnswers[question.Id] === index) {
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
      }

      btn.addEventListener("click", () =>
        this.selectAnswer(question.Id, index, btn)
      );

      container.appendChild(btn);
    });
  }

  selectAnswer(questionId, answerIndex, btn) {
    // Remove previous selection
    document.querySelectorAll(".answer-option").forEach((b) => {
      b.classList.remove("selected");
      b.setAttribute("aria-checked", "false");
    });

    // Mark new selection
    btn.classList.add("selected");
    btn.setAttribute("aria-checked", "true");
    this.userAnswers[questionId] = answerIndex;

    // Hide inline error if shown
    this.hideInlineError();

    console.log(`Question ${questionId}: Answer ${answerIndex} selected`);
    this.updateAnsweredCount();

    // Update dots
    this.generateQuestionDots(
      "questionDots",
      this.currentExam.length,
      this.currentQuestionIndex,
      this.currentExam.map((q) => q.Id in this.userAnswers),
      (index) => {
        this.currentQuestionIndex = index;
        this.displayCurrentQuestion();
      }
    );
  }

  showInlineError(message) {
    const errorEl = document.getElementById("inlineError");
    const errorText = document.getElementById("inlineErrorText");
    errorText.textContent = message;
    errorEl.classList.remove("hidden");
  }

  hideInlineError() {
    const errorEl = document.getElementById("inlineError");
    errorEl.classList.add("hidden");
  }

  updateProgressBar() {
    const progress =
      ((this.currentQuestionIndex + 1) / this.currentExam.length) * 100;
    document.getElementById("progressFill").style.width = progress + "%";
    document.getElementById("currentQuestion").textContent =
      this.currentQuestionIndex + 1;
  }

  updateAnsweredCount() {
    const answered = Object.keys(this.userAnswers).length;
    document.getElementById("answeredCount").textContent = answered;
    document.getElementById("totalForStatus").textContent =
      this.currentExam.length;
  }

  nextQuestion() {
    // If on last question, submit exam
    if (this.currentQuestionIndex === this.currentExam.length - 1) {
      this.submitExam();
      return;
    }

    // Check if current question is answered
    const currentQuestion = this.currentExam[this.currentQuestionIndex];
    if (!(currentQuestion.Id in this.userAnswers)) {
      this.showInlineError(this.i18n.get("selectAnswer"));
      return;
    }

    this.currentQuestionIndex++;
    this.displayCurrentQuestion();
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.displayCurrentQuestion();
    }
  }

  async exitExam() {
    const answered = Object.keys(this.userAnswers).length;
    const confirmed = await this.modal.confirm({
      title: this.i18n.get("exitExam"),
      message: this.i18n.get("exitExamMsg", { answered }),
      icon: "🚪",
      confirmText: this.i18n.get("exitBtn"),
      cancelText: this.i18n.get("continueBtn"),
      confirmClass: "btn-danger",
    });

    if (confirmed) {
      this.timer.stop();
      this.goHome();
    }
  }

  submitExam() {
    // Stop timer
    this.timer.stop();
    const timeTaken = this.timer.getElapsedTime();

    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;
    const questionsData = [];

    this.currentExam.forEach((question) => {
      const userAnswerIndex = this.userAnswers[question.Id];
      const correctAnswerIndex = question.A.findIndex((a) => a.Y);
      let isCorrect = false;

      if (userAnswerIndex !== undefined) {
        const selectedAnswer = question.A[userAnswerIndex];
        if (selectedAnswer && selectedAnswer.Y) {
          correctCount++;
          isCorrect = true;
        } else {
          incorrectCount++;
        }
      } else {
        incorrectCount++;
      }

      questionsData.push({
        id: question.Id,
        userAnswer: userAnswerIndex,
        correctAnswer: correctAnswerIndex,
        correct: isCorrect,
      });
    });

    // Determine pass/fail (max 3 incorrect = pass)
    const passed = incorrectCount <= 3;
    const scorePercentage = Math.round((correctCount / 30) * 100);

    // Save result to history with full question data
    const result = {
      timestamp: new Date().toISOString(),
      language: this.getLanguageName(),
      correct: correctCount,
      incorrect: incorrectCount,
      passed: passed,
      score: scorePercentage,
      timeTaken: timeTaken,
      questions: questionsData,
    };
    this.saveExamToHistory(result);
    this.renderHistory();

    // Display results
    this.displayResults(
      correctCount,
      incorrectCount,
      passed,
      scorePercentage,
      timeTaken
    );
  }

  displayResults(correct, incorrect, passed, percentage, timeTaken) {
    // Animate count up for stats
    this.animateCountUp("correctCount", correct);
    this.animateCountUp("incorrectCount", incorrect);
    this.animateCountUp("scorePercentage", percentage, "%");

    // Display time taken
    document.getElementById("timeTaken").textContent =
      this.timer.formatTime(timeTaken);

    const titleEl = document.getElementById("resultTitle");
    const badgeEl = document.getElementById("resultBadge");
    const messageEl = document.getElementById("resultMessage");

    if (passed) {
      titleEl.textContent = this.i18n.get("congratulations");
      badgeEl.innerHTML = "🎉";
      messageEl.textContent = this.i18n.get("passMessage", { score: percentage, incorrect });
      messageEl.className = "results-message pass";

      // Launch confetti!
      setTimeout(() => this.confetti.launch(150), 300);
      this.toast.success(this.i18n.get("youPassed"), this.i18n.get("wellDone"));
    } else {
      titleEl.textContent = this.i18n.get("keepPracticing");
      badgeEl.innerHTML = "📚";
      messageEl.textContent = this.i18n.get("failMessage", { score: percentage, incorrect });
      messageEl.className = "results-message fail";
      this.toast.warning(
        this.i18n.get("needMorePractice"),
        this.i18n.get("notQuite")
      );
    }

    this.updateStatsDisplay();
    this.showScreen("resultsScreen");

    // Update filter counts for review
    const incorrectQuestions = this.currentExam.filter((q) => {
      const userAnswer = this.userAnswers[q.Id];
      return userAnswer === undefined || !q.A[userAnswer]?.Y;
    });
    const correctQuestions = this.currentExam.filter((q) => {
      const userAnswer = this.userAnswers[q.Id];
      return userAnswer !== undefined && q.A[userAnswer]?.Y;
    });

    document.getElementById(
      "filterIncorrect"
    ).textContent = `${this.i18n.get("incorrectFilter")} (${incorrectQuestions.length})`;
    document.getElementById(
      "filterCorrect"
    ).textContent = `${this.i18n.get("correctFilter")} (${correctQuestions.length})`;
  }

  animateCountUp(elementId, target, suffix = "") {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + suffix;
    }, stepDuration);
  }

  // ========== Review Screen ==========
  goToReview() {
    this.reviewQuestionIndex = 0;
    this.reviewFilter = "all";
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");
    this.applyReviewFilter();
    this.showScreen("reviewScreen");
  }

  applyReviewFilter() {
    if (this.reviewFilter === "all") {
      this.filteredQuestions = [...this.currentExam];
    } else if (this.reviewFilter === "incorrect") {
      this.filteredQuestions = this.currentExam.filter((q) => {
        const userAnswer = this.userAnswers[q.Id];
        return userAnswer === undefined || !q.A[userAnswer]?.Y;
      });
    } else if (this.reviewFilter === "correct") {
      this.filteredQuestions = this.currentExam.filter((q) => {
        const userAnswer = this.userAnswers[q.Id];
        return userAnswer !== undefined && q.A[userAnswer]?.Y;
      });
    }

    this.reviewQuestionIndex = 0;

    if (this.filteredQuestions.length === 0) {
      this.toast.info(this.i18n.get("noQuestionsMatch"), this.i18n.get("filter"));
      // Reset to all
      this.reviewFilter = "all";
      this.filteredQuestions = [...this.currentExam];
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelector('.filter-btn[data-filter="all"]')
        .classList.add("active");
    }

    this.displayReviewQuestion();
  }

  displayReviewQuestion() {
    if (this.filteredQuestions.length === 0) return;

    const question = this.filteredQuestions[this.reviewQuestionIndex];
    const userAnswerIndex = this.userAnswers[question.Id];
    const selectedAnswer =
      userAnswerIndex !== undefined ? question.A[userAnswerIndex] : null;
    const correctAnswer = question.A.find((a) => a.Y);
    const isCorrect = selectedAnswer && selectedAnswer.Y;

    // Update question text
    document.getElementById("reviewQuestionText").textContent =
      this.getTextInCurrentLanguage(question.Q);

    // Handle question image
    const qImageContainer = document.getElementById(
      "reviewQuestionImageContainer"
    );
    if (question.Img === true) {
      qImageContainer.style.display = "block";
      const img = document.getElementById("reviewQuestionImage");
      img.src = `images/${question.Id}.jpg`;
      img.alt = `Question ${this.reviewQuestionIndex + 1} image`;
      img.onerror = () => {
        console.error(`Image not found: images/${question.Id}.jpg`);
        qImageContainer.style.display = "none";
      };
    } else {
      qImageContainer.style.display = "none";
    }

    // Display user's answer
    const userAnswerSection = document.getElementById("reviewUserAnswerSection");
    const userAnswerDisplay = document.getElementById("reviewUserAnswer");
    if (selectedAnswer) {
      userAnswerDisplay.textContent = this.getTextInCurrentLanguage(
        selectedAnswer.T
      );
      userAnswerSection.className = `review-answer-section ${
        isCorrect ? "correct" : "incorrect"
      }`;
    } else {
      userAnswerDisplay.textContent = "Not answered";
      userAnswerSection.className = "review-answer-section incorrect";
    }

    // Display correct answer (if different)
    const correctAnswerSection = document.getElementById(
      "reviewCorrectAnswerSection"
    );
    const correctAnswerDisplay = document.getElementById("reviewCorrectAnswer");
    if (correctAnswer && selectedAnswer !== correctAnswer) {
      correctAnswerDisplay.textContent = this.getTextInCurrentLanguage(
        correctAnswer.T
      );
      correctAnswerSection.style.display = "block";
    } else {
      correctAnswerSection.style.display = "none";
    }

    // Display explanation
    const explanationDiv = document.getElementById("reviewExplanation");
    explanationDiv.innerHTML = this.getTextInCurrentLanguage(question.Rule);

    // Update progress bar
    const progress =
      ((this.reviewQuestionIndex + 1) / this.filteredQuestions.length) * 100;
    document.getElementById("reviewProgressFill").style.width = progress + "%";
    document.getElementById("reviewCurrentQuestion").textContent =
      this.reviewQuestionIndex + 1;
    document.getElementById("reviewTotalQuestions").textContent =
      this.filteredQuestions.length;

    // Generate question dots with correct/incorrect status
    this.generateQuestionDots(
      "reviewQuestionDots",
      this.filteredQuestions.length,
      this.reviewQuestionIndex,
      this.filteredQuestions.map((q) => {
        const ua = this.userAnswers[q.Id];
        return ua !== undefined && q.A[ua]?.Y;
      }),
      (index) => {
        this.reviewQuestionIndex = index;
        this.displayReviewQuestion();
      }
    );

    // Update button states
    document.getElementById("reviewPrevBtn").disabled =
      this.reviewQuestionIndex === 0;
    document.getElementById("reviewNextBtn").textContent =
      this.reviewQuestionIndex === this.filteredQuestions.length - 1
        ? "Finish Review"
        : "Next →";

    // Scroll to top
    document.querySelector(".review-content").scrollTop = 0;
  }

  reviewPreviousQuestion() {
    if (this.reviewQuestionIndex > 0) {
      this.reviewQuestionIndex--;
      this.displayReviewQuestion();
    }
  }

  reviewNextQuestion() {
    if (this.reviewQuestionIndex < this.filteredQuestions.length - 1) {
      this.reviewQuestionIndex++;
      this.displayReviewQuestion();
    } else {
      this.showScreen("resultsScreen");
    }
  }

  // History navigation
  historyPreviousQuestion() {
    if (this.historyQuestionIndex > 0) {
      this.historyQuestionIndex--;
      this.displayHistoryQuestion();
    }
  }

  historyNextQuestion() {
    if (
      this.currentHistoryExam &&
      this.historyQuestionIndex < this.currentHistoryExam.questions.length - 1
    ) {
      this.historyQuestionIndex++;
      this.displayHistoryQuestion();
    } else {
      this.goHome();
    }
  }

  // ========== Screen Navigation ==========
  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");

    // Scroll to top of the screen
    document.getElementById(screenId).scrollTop = 0;
  }

  goHome() {
    this.currentExam = [];
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    this.currentHistoryExam = null;
    this.timer.reset();
    this.loadStats();
    this.renderHistory();
    this.showScreen("homeScreen");
  }
}

// ============================================================================
// Initialize Application
// ============================================================================
let platform;

document.addEventListener("DOMContentLoaded", () => {
  platform = new DGTExamPlatform();
  console.log("DGT Exam Platform v2.0 initialized");
});
