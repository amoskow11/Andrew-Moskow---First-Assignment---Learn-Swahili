// ─────────────────────────────────────────────
//  Learn Swahili — script.js
// ─────────────────────────────────────────────

// ── Question Bank ──
const ALL_QUESTIONS = [
  { prompt: 'How do you say "hello" in Swahili?',      answer: "jambo",     type: "mc" },
  { prompt: 'What does "asante" mean in English?',      answer: "thank you", type: "mc" },
  { prompt: 'How do you say "water" in Swahili?',       answer: "maji",      type: "mc" },
  { prompt: 'What does "ndiyo" mean in English?',       answer: "yes",       type: "mc" },
  { prompt: 'How do you say "no" in Swahili?',          answer: "hapana",    type: "mc" },
  { prompt: 'What does "rafiki" mean in English?',      answer: "friend",    type: "mc" },
  { prompt: 'How do you say "goodbye" in Swahili?',     answer: "kwaheri",   type: "type" },
  { prompt: 'What does "chakula" mean in English?',     answer: "food",      type: "type" },
  { prompt: 'How do you say "please" in Swahili?',      answer: "tafadhali", type: "type" },
  { prompt: 'What does "karibu" mean in English?',      answer: "welcome",   type: "mc" },
];

// ── Distractors pool for multiple choice ──
const DISTRACTORS = [
  "jambo", "asante", "maji", "ndiyo", "hapana",
  "rafiki", "kwaheri", "chakula", "tafadhali", "karibu",
  "thank you", "yes", "no", "friend", "goodbye",
  "food", "please", "welcome", "hello", "water"
];

// ── Feedback messages ──
const CORRECT_MSGS = [
  "✅ Excellent! That's exactly right!",
  "✅ Nzuri sana! (Very good!) Keep it up!",
  "✅ You got it! Great work!",
  "✅ Correct! You're on a roll!",
  "✅ Kabisa! (Absolutely!) Well done!",
  "✅ That's right! You're crushing it!",
];

const INCORRECT_MSGS = [
  "Not quite — but that's how we learn! The answer was",
  "Almost there! The correct answer is",
  "No worries — keep going! The right answer was",
  "Good try! Here's the answer to remember:",
  "Learning moment! The correct answer is",
];

const STREAK_MSGS = [
  "🔥 You're on fire! {n} in a row!",
  "⚡ Unstoppable! {n} correct answers straight!",
  "🌟 Amazing streak — {n} and counting!",
  "🎯 {n} in a row! You're really getting this!",
];

// ── State ──
let questions        = [];
let currentIndex     = 0;
let sessionScore     = 0;
let sessionXP        = 0;
let currentStreak    = 0;
let longestStreak    = 0;
let missedQuestions  = [];
let answerLocked     = false;

// ── Persistent state (localStorage) ──
let totalXP          = parseInt(localStorage.getItem("swahili_totalXP"))    || 0;
let lessonsCompleted = parseInt(localStorage.getItem("swahili_lessons"))     || 0;

// ── DOM refs ──
const questionCounter     = document.getElementById("question-counter");
const questionPrompt      = document.getElementById("question-prompt");
const choicesContainer    = document.getElementById("choices-container");
const typeAnswerContainer = document.getElementById("type-answer-container");
const typeInput           = document.getElementById("type-input");
const submitBtn           = document.getElementById("submit-btn");
const feedbackBox         = document.getElementById("feedback-box");
const feedbackText        = document.getElementById("feedback-text");
const nextBtn             = document.getElementById("next-btn");
const progressBar         = document.getElementById("progress-bar");
const quizContainer       = document.getElementById("quiz-container");
const resultsScreen       = document.getElementById("results-screen");
const playAgainBtn        = document.getElementById("play-again-btn");

// Stats bar
const statScore    = document.getElementById("stat-score");
const statStreak   = document.getElementById("stat-streak");
const statXP       = document.getElementById("stat-xp");
const statTotalXP  = document.getElementById("stat-total-xp");
const statLessons  = document.getElementById("stat-lessons");

// ── Init ──
function initSession() {
  questions       = shuffle([...ALL_QUESTIONS]);
  currentIndex    = 0;
  sessionScore    = 0;
  sessionXP       = 0;
  currentStreak   = 0;
  longestStreak   = 0;
  missedQuestions = [];
  answerLocked    = false;

  quizContainer.classList.remove("hidden");
  resultsScreen.classList.add("hidden");
  feedbackBox.classList.add("hidden");

  updateStatsBar();
  loadQuestion();
}

// ── Load question ──
function loadQuestion() {
  answerLocked = false;
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct-fb", "incorrect-fb");

  const q = questions[currentIndex];

  // Progress bar
  const pct = (currentIndex / questions.length) * 100;
  progressBar.style.width = pct + "%";

  // Counter
  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

  // Prompt
  questionPrompt.textContent = q.prompt;

  // Streak celebration banner (every 3 correct in a row)
  removeStreakBanner();
  if (currentStreak > 0 && currentStreak % 3 === 0) {
    showStreakBanner(currentStreak);
  }

  if (q.type === "mc") {
    showMultipleChoice(q);
  } else {
    showTypeAnswer(q);
  }
}

// ── Multiple choice ──
function showMultipleChoice(q) {
  choicesContainer.classList.remove("hidden");
  typeAnswerContainer.classList.add("hidden");
  choicesContainer.innerHTML = "";

  const options = buildOptions(q.answer);
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleMCAnswer(btn, opt, q.answer));
    choicesContainer.appendChild(btn);
  });
}

// ── Type answer ──
function showTypeAnswer(q) {
  choicesContainer.classList.add("hidden");
  typeAnswerContainer.classList.remove("hidden");
  typeInput.value = "";
  typeInput.focus();
}

// ── Handle MC answer ──
function handleMCAnswer(btn, chosen, correct) {
  if (answerLocked) return;
  answerLocked = true;

  const allBtns = choicesContainer.querySelectorAll(".choice-btn");
  allBtns.forEach(b => b.disabled = true);

  if (chosen.toLowerCase() === correct.toLowerCase()) {
    btn.classList.add("correct");
    handleCorrect();
  } else {
    btn.classList.add("incorrect");
    // Reveal correct answer
    allBtns.forEach(b => {
      if (b.textContent.toLowerCase() === correct.toLowerCase()) {
        b.classList.add("reveal");
      }
    });
    handleIncorrect(correct);
  }
}

// ── Handle type answer ──
function handleTypeSubmit() {
  if (answerLocked) return;
  const q = questions[currentIndex];
  const userAnswer = typeInput.value.trim().toLowerCase();
  const correct    = q.answer.toLowerCase();

  if (!userAnswer) return;
  answerLocked = true;
  submitBtn.disabled = true;

  if (userAnswer === correct) {
    typeInput.style.borderColor = "#388e3c";
    handleCorrect();
  } else {
    typeInput.style.borderColor = "#c62828";
    handleIncorrect(q.answer);
  }
}

// ── Correct ──
function handleCorrect() {
  sessionScore++;
  sessionXP += 10;
  currentStreak++;
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  updateStatsBar();
  showFeedback(true, "");
}

// ── Incorrect ──
function handleIncorrect(correctAnswer) {
  currentStreak = 0;
  missedQuestions.push(questions[currentIndex]);

  updateStatsBar();
  showFeedback(false, correctAnswer);
}

// ── Show feedback ──
function showFeedback(isCorrect, correctAnswer) {
  feedbackBox.classList.remove("hidden", "correct-fb", "incorrect-fb");

  if (isCorrect) {
    feedbackBox.classList.add("correct-fb");
    const msg = CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)];
    feedbackText.textContent = msg;
  } else {
    feedbackBox.classList.add("incorrect-fb");
    const prefix = INCORRECT_MSGS[Math.floor(Math.random() * INCORRECT_MSGS.length)];
    feedbackText.textContent = `${prefix}: "${correctAnswer}"`;
  }

  // Determine next button label
  const isLast = currentIndex === questions.length - 1;
  nextBtn.textContent = isLast ? "See Results 🏆" : "Next →";
}

// ── Next question ──
nextBtn.addEventListener("click", () => {
  currentIndex++;
  typeInput.style.borderColor = "";
  submitBtn.disabled = false;

  if (currentIndex 
