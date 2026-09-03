const baseQuestions = [
  {
    id: 1,
    type: "classic",
    question: 'What is the Swahili word for "hello"?',
    choices: ["jambo", "maji", "rafiki", "hapana"],
    answer: "jambo",
    hint: "It is a common greeting."
  },
  {
    id: 2,
    type: "classic",
    question: 'What does "asante" mean in English?',
    choices: ["please", "thank you", "friend", "yes"],
    answer: "thank you",
    hint: "You say this when someone helps you."
  },
  {
    id: 3,
    type: "fast",
    question: 'What is the Swahili word for "water"?',
    choices: ["chakula", "maji", "karibu", "kwaheri"],
    answer: "maji",
    hint: "You drink it."
  },
  {
    id: 4,
    type: "fast",
    question: 'What does "ndiyo" mean in English?',
    choices: ["no", "food", "yes", "hello"],
    answer: "yes",
    hint: "It is the positive answer."
  },
  {
    id: 5,
    type: "streak",
    question: 'What is the Swahili word for "no"?',
    choices: ["hapana", "jambo", "tafadhali", "maji"],
    answer: "hapana",
    hint: "It is the opposite of yes."
  },
  {
    id: 6,
    type: "streak",
    question: 'What does "rafiki" mean in English?',
    choices: ["friend", "welcome", "food", "goodbye"],
    answer: "friend",
    hint: "A person you enjoy spending time with."
  },
  {
    id: 7,
    type: "classic",
    question: 'What is the Swahili word for "goodbye"?',
    choices: ["kwaheri", "asante", "ndiyo", "rafiki"],
    answer: "kwaheri",
    hint: "You say this when leaving."
  },
  {
    id: 8,
    type: "classic",
    question: 'What does "chakula" mean in English?',
    choices: ["food", "water", "please", "hello"],
    answer: "food",
    hint: "You eat it."
  },
  {
    id: 9,
    type: "classic",
    question: 'What is the Swahili word for "please"?',
    choices: ["karibu", "tafadhali", "hapana", "jambo"],
    answer: "tafadhali",
    hint: "A polite word used when asking."
  },
  {
    id: 10,
    type: "classic",
    question: 'What does "karibu" mean in English?',
    choices: ["thank you", "welcome", "friend", "yes"],
    answer: "welcome",
    hint: "You might say this when greeting someone into a place."
  }
];

const modeLabels = {
  classic: "🌟 Classic Round",
  streak: "🔥 Streak Round",
  fast: "⚡ Fast Round",
  review: "🧠 Review Round"
};

const encouragements = {
  correct: [
    "Nice work!",
    "You got it!",
    "Great job!",
    "Awesome answer!",
    "That’s correct!"
  ],
  wrong: [
    "Good try!",
    "You’re learning!",
    "Nice effort!",
    "Keep going!",
    "You’ve got this!"
  ]
};

const streakMessages = {
  3: "🔥 3 in a row! You’re on a roll!",
  5: "🌈 5 in a row! Amazing streak!",
  10: "🏆 10 in a row! Incredible!"
};

const STORAGE_KEY = "swahiliSprintProgress";

let questionQueue = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let longestStreak = 0;
let sessionXP = 0;
let answered = false;
let missedQuestions = [];
let reviewStarted = false;
let sessionCompleted = false;

let savedProgress = loadProgress();

const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const questionCountEl = document.getElementById("questionCount");
const modeBadgeEl = document.getElementById("modeBadge");
const progressFill = document.getElementById("progressFill");

const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const sessionXPEl = document.getElementById("sessionXP");
const totalXPEl = document.getElementById("totalXP");

const quizArea = document.getElementById("quizArea");
const resultsEl = document.getElementById("results");

const finalScoreEl = document.getElementById("finalScore");
const finalStreakEl = document.getElementById("finalStreak");
const finalXPEl = document.getElementById("finalXP");
const finalLessonsEl = document.getElementById("finalLessons");
const savedXPNote = document.getElementById("savedXPNote");
const restartBtn = document.getElementById("restartBtn");

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      totalXP: 0,
      lessonsCompleted: 0
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      totalXP: Number(parsed.totalXP) || 0,
      lessonsCompleted: Number(parsed.lessonsCompleted) || 0
    };
  } catch (error) {
    return {
      totalXP: 0,
      lessonsCompleted: 0
    };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSessionQueue() {
  questionQueue = baseQuestions.map(question => ({ ...question }));
}

function getCurrentQuestion() {
  return questionQueue[currentIndex];
}

function updateTopbar() {
  scoreEl.textContent = `${score}/${baseQuestions.length}`;
  streakEl.textContent = streak;
  sessionXPEl.textContent = sessionXP;
  totalXPEl.textContent = savedProgress.totalXP;
}

function updateProgressBar() {
  const progress = Math.min((currentIndex / questionQueue.length) * 100, 100);
  progressFill.style.width = `${progress}%`;
}

function showQuestion() {
  answered = false;
  feedbackEl.className = "feedback";
  feedbackEl.innerHTML = "";

  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    finishSession();
    return;
  }

  const visibleNumber = Math.min(currentIndex + 1, questionQueue.length);
  questionCountEl.textContent = `Question ${visibleNumber} of ${questionQueue.length}`;
  modeBadgeEl.textContent = modeLabels[currentQuestion.type] || "🌟 Practice Round";
  questionText.textContent = currentQuestion.question;

  choicesEl.innerHTML = "";

  currentQuestion.choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => handleAnswer(choice, button));
    choicesEl.appendChild(button);
  });

  updateTopbar();
  updateProgressBar();
}

function handleAnswer(selectedChoice, selectedButton) {
  if (answered) return;
  answered = true;

  const currentQuestion = getCurrentQuestion();
  const buttons = document.querySelectorAll(".choice-btn");
  const isCorrect = selectedChoice === currentQuestion.answer;

  buttons.forEach(button => {
    button.disabled = true;
    if (button.textContent === currentQuestion.answer) {
      button.classList.add("correct");
    }
  });

  if (isCorrect) {
    score += 1;
    streak += 1;
    longestStreak = Math.max(longestStreak, streak);
    sessionXP += 10;

    let extraMessage = "";
    if (streakMessages[streak]) {
      extraMessage = `<br><strong>${streakMessages[streak]}</strong>`;
    }

    feedbackEl.className = "feedback correct show";
    feedbackEl.innerHTML = `✅ ${randomItem(encouragements.correct)} <strong>${currentQuestion.answer}</strong> is right.${extraMessage}`;
  } else {
    selectedButton.classList.add("wrong");
    streak = 0;

    const alreadyMissed = missedQuestions.some(question => question.id === currentQuestion.id);
    if (!alreadyMissed && currentQuestion.type !== "review") {
      missedQuestions.push(currentQuestion);
    }

    feedbackEl.className = "feedback wrong show";
    feedbackEl.innerHTML = `💡 ${randomItem(encouragements.wrong)} The correct answer is <strong>${currentQuestion.answer}</strong>.<br>Hint: ${currentQuestion.hint}`;
  }

  updateTopbar();

  const nextButton = document.createElement("button");
  nextButton.className = "next-btn";
  nextButton.type = "button";
  nextButton.textContent = getNextButtonLabel();
  nextButton.addEventListener("click", goToNextQuestion);

  feedbackEl.appendChild(document.createElement("br"));
  feedbackEl.appendChild(nextButton);
}

function getNextButtonLabel() {
  const isLastMainQuestion = currentIndex === questionQueue.length - 1 && !reviewStarted && missedQuestions.length === 0;
  const isBeforeReview = currentIndex === questionQueue.length - 1 && !reviewStarted && missedQuestions.length > 0;
  const isLastReviewQuestion = reviewStarted && currentIndex === questionQueue.length - 1;

  if (isLastMainQuestion) return "See Results";
  if (isBeforeReview) return "Start Review Round";
  if (isLastReviewQuestion) return "See Results";
  return "Next Question";
}

function startReviewRound() {
  reviewStarted = true;

  const reviewQuestions = missedQuestions.map(question => ({
    ...question,
    type: "review"
  }));

  questionQueue = [...questionQueue, ...reviewQuestions];
}

function goToNextQuestion() {
  const atEndOfMainRound = currentIndex === questionQueue.length - 1 && !reviewStarted;

  if (atEndOfMainRound && missedQuestions.length > 0) {
    startReviewRound();
  }

  currentIndex += 1;

  if (currentIndex < questionQueue.length) {
    showQuestion();
  } else {
    finishSession();
  }
}

function finishSession() {
  if (sessionCompleted) return;
  sessionCompleted = true;

  sessionXP += 25;
  savedProgress.totalXP += sessionXP;
  savedProgress.lessonsCompleted += 1;
  saveProgress();

  updateTopbar();
  progressFill.style.width = "100%";

  quizArea.style.display = "none";
  resultsEl.classList.add("show");

  finalScoreEl.textContent = `${score}/${baseQuestions.length}`;
  finalStreakEl.textContent = longestStreak;
  finalXPEl.textContent = sessionXP;
  finalLessonsEl.textContent = savedProgress.lessonsCompleted;
  savedXPNote.textContent = `Total saved XP: ${savedProgress.totalXP}`;
}

function resetSession() {
  currentIndex = 0;
  score = 0;
  streak = 0;
  longestStreak = 0;
  sessionXP = 0;
  answered = false;
  missedQuestions = [];
  reviewStarted = false;
  sessionCompleted = false;

  buildSessionQueue();
  updateTopbar();
  updateProgressBar();

  resultsEl.classList.remove("show");
  quizArea.style.display = "block";

  showQuestion();
}

restartBtn.addEventListener("click", resetSession);

buildSessionQueue();
updateTopbar();
showQuestion();
