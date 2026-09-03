const questions = [
  {
    type: "classic",
    question: 'What is the Swahili word for "hello"?',
    choices: ["jambo", "maji", "rafiki", "hapana"],
    answer: "jambo",
    hint: "It is a common greeting."
  },
  {
    type: "classic",
    question: 'What does "asante" mean in English?',
    choices: ["please", "thank you", "friend", "yes"],
    answer: "thank you",
    hint: "You say this when someone helps you."
  },
  {
    type: "fast",
    question: 'What is the Swahili word for "water"?',
    choices: ["chakula", "maji", "karibu", "kwaheri"],
    answer: "maji",
    hint: "You drink it."
  },
  {
    type: "fast",
    question: 'What does "ndiyo" mean in English?',
    choices: ["no", "food", "yes", "hello"],
    answer: "yes",
    hint: "It is the positive answer."
  },
  {
    type: "streak",
    question: 'What is the Swahili word for "no"?',
    choices: ["hapana", "jambo", "tafadhali", "maji"],
    answer: "hapana",
    hint: "It is the opposite of yes."
  },
  {
    type: "streak",
    question: 'What does "rafiki" mean in English?',
    choices: ["friend", "welcome", "food", "goodbye"],
    answer: "friend",
    hint: "A person you enjoy spending time with."
  },
  {
    type: "classic",
    question: 'What is the Swahili word for "goodbye"?',
    choices: ["kwaheri", "asante", "ndiyo", "rafiki"],
    answer: "kwaheri",
    hint: "You say this when leaving."
  },
  {
    type: "review",
    question: 'What does "chakula" mean in English?',
    choices: ["food", "water", "please", "hello"],
    answer: "food",
    hint: "You eat it."
  },
  {
    type: "review",
    question: 'What is the Swahili word for "please"?',
    choices: ["karibu", "tafadhali", "hapana", "jambo"],
    answer: "tafadhali",
    hint: "A polite word used when asking."
  },
  {
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

let currentQuestion = 0;
let score = 0;
let streak = 0;
let longestStreak = 0;
let sessionXP = 0;
let answered = false;

let savedProgress = JSON.parse(localStorage.getItem("swahiliProgress")) || {
  totalXP: 0,
  lessonsCompleted: 0
};

const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const questionCountEl = document.getElementById("questionCount");
const modeBadgeEl = document.getElementById("modeBadge");

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

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateTopbar() {
  scoreEl.textContent = `${score}/${questions.length}`;
  streakEl.textContent = streak;
  sessionXPEl.textContent = sessionXP;
  totalXPEl.textContent = savedProgress.totalXP;
}

function saveProgress() {
  localStorage.setItem("swahiliProgress", JSON.stringify(savedProgress));
}

function showQuestion() {
  answered = false;
  feedbackEl.className = "feedback";
  feedbackEl.innerHTML = "";

  const q = questions[currentQuestion];
  questionCountEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  questionText.textContent = q.question;
  modeBadgeEl.textContent = modeLabels[q.type] || "🌟 Practice Round";

  choicesEl.innerHTML = "";

  q.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = choice;
    button.addEventListener("click", () => handleAnswer(button, choice));
    choicesEl.appendChild(button);
  });
}

function handleAnswer(button, selectedChoice) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  const isCorrect = selectedChoice === q.answer;

  if (isCorrect) {
    button.classList.add("correct");
    score++;
    streak++;
    longestStreak = Math.max(longestStreak, streak);
    sessionXP += 10;

    let extraMessage = "";
    if (streakMessages[streak]) {
      extraMessage = `<br><strong>${streakMessages[streak]}</strong>`;
    }

    feedbackEl.className = "feedback correct show";
    feedbackEl.innerHTML = `✅ ${randomItem(encouragements.correct)} The correct answer is <strong>${q.answer}</strong>.${extraMessage}`;
  } else {
    button.classList.add("wrong");
    streak = 0;

    buttons.forEach((btn) => {
      if (btn.textContent === q.answer) {
        btn.classList.add("correct");
      }
    });

    feedbackEl.className = "feedback wrong show";
    feedbackEl.innerHTML = `💡 ${randomItem(encouragements.wrong)} The correct answer is <strong>${q.answer}</strong>.<br>Hint: ${q.hint}`;
  }

  updateTopbar();

  const nextButton = document.createElement("button");
  nextButton.className = "next-btn";
  nextButton.textContent =
    currentQuestion === questions.length - 1 ? "See Results" : "Next Question";
  nextButton.addEventListener("click", goToNextQuestion);

  feedbackEl.appendChild(document.createElement("br"));
  feedbackEl.appendChild(nextButton);
}

function goToNextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishSession();
  }
}

function finishSession() {
  sessionXP += 25;
  savedProgress.totalXP += sessionXP;
  savedProgress.lessonsCompleted += 1;
  saveProgress();
  updateTopbar();

  quizArea.style.display = "none";
  resultsEl.classList.add("show");

  finalScoreEl.textContent = `${score}/${questions.length}`;
  finalStreakEl.textContent = longestStreak;
  finalXPEl.textContent = sessionXP;
  finalLessonsEl.textContent = savedProgress.lessonsCompleted;
  savedXPNote.textContent = `Total saved XP: ${savedProgress.totalXP}`;
}

function restartGame() {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  longestStreak = 0;
  sessionXP = 0;
  answered = false;

  resultsEl.classList.remove("show");
  quizArea.style.display = "block";

  updateTopbar();
  showQuestion();
}

restartBtn.addEventListener("click", restartGame);

updateTopbar();
showQuestion();
