const questions = [
  { question: 'What is the Swahili word for "hello"?', answer: "jambo" },
  { question: 'What does "asante" mean in English?', answer: "thank you" },
  { question: 'What is the Swahili word for "water"?', answer: "maji" },
  { question: 'What does "ndiyo" mean in English?', answer: "yes" },
  { question: 'What is the Swahili word for "no"?', answer: "hapana" },
  { question: 'What does "rafiki" mean in English?', answer: "friend" },
  { question: 'What is the Swahili word for "goodbye"?', answer: "kwaheri" },
  { question: 'What does "chakula" mean in English?', answer: "food" },
  { question: 'What is the Swahili word for "please"?', answer: "tafadhali" },
  { question: 'What does "karibu" mean in English?', answer: "welcome" }
];

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const feedback = document.getElementById("feedback");

const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const xpEl = document.getElementById("xp");
const totalXpEl = document.getElementById("total-xp");

const quizCard = document.getElementById("quiz-card");
const results = document.getElementById("results");
const finalScore = document.getElementById("final-score");
const finalStreak = document.getElementById("final-streak");
const finalXp = document.getElementById("final-xp");
const finalTotalXp = document.getElementById("final-total-xp");
const lessonsCompletedEl = document.getElementById("lessons-completed");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;
let streak = 0;
let longestStreak = 0;
let xp = 0;
let answered = false;

let totalXp = parseInt(localStorage.getItem("totalXp")) || 0;
let lessonsCompleted = parseInt(localStorage.getItem("lessonsCompleted")) || 0;

const correctMessages = [
  "Great job!",
  "Nice work!",
  "Awesome!",
  "You got it!",
  "Excellent!"
];

const wrongMessages = [
  "Good try!",
  "Keep going!",
  "Nice effort!",
  "You’re learning!",
  "Try the next one!"
];

function randomMessage(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  xpEl.textContent = xp;
  totalXpEl.textContent = totalXp;
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  questionText.textContent = q.question;
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.classList.add("hidden");
  feedback.textContent = "";
  feedback.className = "feedback";
  answered = false;
}

function checkAnswer() {
  if (answered) return;

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();

  if (userAnswer === "") {
    feedback.textContent = "Please type an answer first.";
    feedback.className = "feedback incorrect";
    return;
  }

  answered = true;
  answerInput.disabled = true;
  submitBtn.disabled = true;

  if (userAnswer === correctAnswer) {
    score++;
    streak++;
    xp += 10;

    if (streak > longestStreak) {
      longestStreak = streak;
    }

    let message = randomMessage(correctMessages);

    if (streak === 3) {
      message += " 3 in a row!";
    } else if (streak === 5) {
      message += " 5 in a row!";
    }

    feedback.textContent = `${message} Correct answer: ${questions[currentQuestion].answer}`;
    feedback.className = "feedback correct";
  } else {
    streak = 0;
    feedback.textContent = `${randomMessage(wrongMessages)} Correct answer: ${questions[currentQuestion].answer}`;
    feedback.className = "feedback incorrect";
  }

  updateStats();
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  xp += 25;
  totalXp += xp;
  lessonsCompleted += 1;

  localStorage.setItem("totalXp", totalXp);
  localStorage.setItem("lessonsCompleted", lessonsCompleted);

  finalScore.textContent = `${score}/${questions.length}`;
  finalStreak.textContent = longestStreak;
  finalXp.textContent = xp;
  finalTotalXp.textContent = totalXp;
  lessonsCompletedEl.textContent = lessonsCompleted;

  updateStats();

  quizCard.classList.add("hidden");
  results.classList.remove("hidden");
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  longestStreak = 0;
  xp = 0;
  answered = false;

  results.classList.add("hidden");
  quizCard.classList.remove("hidden");

  updateStats();
  loadQuestion();
}

submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

answerInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (!answered) {
      checkAnswer();
    } else {
      nextQuestion();
    }
  }
});

updateStats();
loadQuestion();
