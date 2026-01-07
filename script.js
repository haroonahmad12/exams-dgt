// ============================================================================
// DGT Exam Practice Platform - Main Application Logic
// ============================================================================

class DGTExamPlatform {
  constructor() {
    this.allQuestions = [];
    this.currentExam = [];
    this.currentLanguage = "E"; // Default: English
    this.currentQuestionIndex = 0;
    this.reviewQuestionIndex = 0;
    this.userAnswers = {}; // Track user answers: { questionId: answerIndex }
    this.examHistory = [];

    this.initEventListeners();
    this.loadData();
    this.loadStats();
  }

  // ========== Data Loading ==========
  async loadData() {
    try {
      const response = await fetch("pdd-v2.json");
      const data = await response.json();
      this.allQuestions = data.Questions;
      console.log(`Loaded ${this.allQuestions.length} questions`);
      // Log sample of questions with images
      const questionsWithImages = this.allQuestions.filter(
        (q) => q.Img === true
      );
      console.log(`Questions with images: ${questionsWithImages.length}`);
      console.log(
        "Sample questions with images:",
        questionsWithImages.slice(0, 5)
      );
    } catch (error) {
      console.error("Failed to load question data:", error);
      alert("Failed to load exam data. Please refresh the page.");
    }
  }

  loadStats() {
    const history = this.getExamHistory();
    this.examHistory = history;
    this.updateStatsDisplay();
  }

  getExamHistory() {
    const stored = localStorage.getItem("dgtExamHistory");
    return stored ? JSON.parse(stored) : [];
  }

  saveExamHistory(result) {
    this.examHistory.push(result);
    localStorage.setItem("dgtExamHistory", JSON.stringify(this.examHistory));
  }

  updateStatsDisplay() {
    const total = this.examHistory.length;
    const passed = this.examHistory.filter((r) => r.passed).length;
    const failed = total - passed;

    document.getElementById("totalExams").textContent = total;
    document.getElementById("passedExams").textContent = passed;
    document.getElementById("failedExams").textContent = failed;
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
  }

  // ========== Language Selection ==========
  selectLanguage(btn) {
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    this.currentLanguage = btn.dataset.lang;
    document.getElementById("startBtn").disabled = false;
    console.log(`Language selected: ${this.getLanguageName()}`);
  }

  getLanguageName() {
    const names = { E: "English", S: "Español", R: "Русский" };
    return names[this.currentLanguage];
  }

  getTextInCurrentLanguage(textObj) {
    return textObj[this.currentLanguage] || textObj.E || "";
  }

  // ========== Exam Management ==========
  startExam() {
    // Reset state
    this.userAnswers = {};
    this.currentQuestionIndex = 0;

    // Generate 30 random questions
    this.currentExam = this.getRandomQuestions(30);
    console.log("Exam started with 30 random questions");

    // Navigate to exam screen
    this.showScreen("examScreen");
    this.displayCurrentQuestion();
  }

  getRandomQuestions(count) {
    const shuffled = [...this.allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
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
      img.alt = `Question ${question.Id} image`;
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

    // Update button states
    document.getElementById("prevBtn").disabled =
      this.currentQuestionIndex === 0;
    document.getElementById("nextBtn").textContent =
      this.currentQuestionIndex === this.currentExam.length - 1
        ? "Submit Exam"
        : "Next →";

    // Scroll to top
    document.querySelector(".exam-content").scrollTop = 0;
  }

  displayAnswers(question) {
    const container = document.getElementById("answersContainer");
    container.innerHTML = "";

    question.A.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.className = "answer-option";
      btn.textContent = this.getTextInCurrentLanguage(answer.T);
      btn.dataset.index = index;
      btn.dataset.correct = answer.Y;

      // Check if this answer was previously selected
      if (this.userAnswers[question.Id] === index) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () =>
        this.selectAnswer(question.Id, index, btn)
      );

      container.appendChild(btn);
    });
  }

  selectAnswer(questionId, answerIndex, btn) {
    // Remove previous selection
    document
      .querySelectorAll(".answer-option")
      .forEach((b) => b.classList.remove("selected"));

    // Mark new selection
    btn.classList.add("selected");
    this.userAnswers[questionId] = answerIndex;

    console.log(`Question ${questionId}: Answer ${answerIndex} selected`);
    this.updateAnsweredCount();
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
      alert(`Please answer the question before moving to the next one.`);
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

  exitExam() {
    if (
      confirm(
        "Are you sure you want to exit the exam? Your progress will be lost."
      )
    ) {
      this.goHome();
    }
  }

  submitExam() {
    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;

    this.currentExam.forEach((question) => {
      if (this.userAnswers[question.Id] !== undefined) {
        const selectedAnswer = question.A[this.userAnswers[question.Id]];
        if (selectedAnswer.Y) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    // Determine pass/fail (max 3 incorrect = pass)
    const passed = incorrectCount <= 3;
    const scorePercentage = Math.round((correctCount / 30) * 100);

    // Save result to history
    const result = {
      timestamp: new Date().toISOString(),
      language: this.getLanguageName(),
      correct: correctCount,
      incorrect: incorrectCount,
      passed: passed,
      score: scorePercentage,
    };
    this.saveExamHistory(result);

    // Display results
    this.displayResults(correctCount, incorrectCount, passed, scorePercentage);
  }

  displayResults(correct, incorrect, passed, percentage) {
    document.getElementById("correctCount").textContent = correct;
    document.getElementById("incorrectCount").textContent = incorrect;
    document.getElementById("scorePercentage").textContent = percentage + "%";

    const titleEl = document.getElementById("resultTitle");
    const badgeEl = document.getElementById("resultBadge");
    const messageEl = document.getElementById("resultMessage");

    if (passed) {
      titleEl.textContent = "🎉 Congratulations! You Passed!";
      badgeEl.innerHTML = "✅";
      messageEl.textContent = `You scored ${percentage}% with ${incorrect} incorrect answers. Great job!`;
      messageEl.className = "results-message pass";
    } else {
      titleEl.textContent = "❌ You Did Not Pass";
      badgeEl.innerHTML = "❌";
      messageEl.textContent = `You scored ${percentage}% with ${incorrect} incorrect answers. You need 3 or fewer incorrect answers to pass. Try again!`;
      messageEl.className = "results-message fail";
    }

    this.updateStatsDisplay();
    this.showScreen("resultsScreen");
  }

  // ========== Review Screen ==========
  goToReview() {
    this.reviewQuestionIndex = 0;
    this.displayReviewQuestion();
    this.showScreen("reviewScreen");
  }

  displayReviewQuestion() {
    const question = this.currentExam[this.reviewQuestionIndex];
    const userAnswerIndex = this.userAnswers[question.Id];
    const selectedAnswer = question.A[userAnswerIndex];
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
      img.alt = `Question ${question.Id} image`;
      img.onerror = () => {
        console.error(`Image not found: images/${question.Id}.jpg`);
        qImageContainer.style.display = "none";
      };
    } else {
      qImageContainer.style.display = "none";
    }

    // Display user's answer
    const userAnswerSection = document.getElementById(
      "reviewUserAnswerSection"
    );
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
    const explanationSection = document.getElementById(
      "reviewExplanationSection"
    );
    const explanationDiv = document.getElementById("reviewExplanation");
    explanationDiv.innerHTML = this.getTextInCurrentLanguage(question.Rule);

    // Add question image to explanation if available
    if (question.Img) {
      const img = document.createElement("img");
      img.src = `images/${question.Id}.jpg`;
      img.onerror = () => {
        img.style.display = "none";
      };
      explanationDiv.appendChild(img);
    }

    // Update progress bar
    const progress =
      ((this.reviewQuestionIndex + 1) / this.currentExam.length) * 100;
    document.getElementById("reviewProgressFill").style.width = progress + "%";
    document.getElementById("reviewCurrentQuestion").textContent =
      this.reviewQuestionIndex + 1;
    document.getElementById("reviewTotalQuestions").textContent =
      this.currentExam.length;

    // Update button states
    document.getElementById("reviewPrevBtn").disabled =
      this.reviewQuestionIndex === 0;
    document.getElementById("reviewNextBtn").textContent =
      this.reviewQuestionIndex === this.currentExam.length - 1
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
    if (this.reviewQuestionIndex < this.currentExam.length - 1) {
      this.reviewQuestionIndex++;
      this.displayReviewQuestion();
    } else {
      this.backToResults();
    }
  }

  backToResults() {
    this.showScreen("resultsScreen");
  }
  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  }

  goHome() {
    this.currentExam = [];
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    this.loadStats();
    this.showScreen("homeScreen");
  }
}

// ============================================================================
// Initialize Application
// ============================================================================
let platform;

document.addEventListener("DOMContentLoaded", () => {
  platform = new DGTExamPlatform();
  console.log("DGT Exam Platform initialized");
});
