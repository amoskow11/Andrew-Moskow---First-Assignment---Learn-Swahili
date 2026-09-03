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
  { question: 'What does "karibu" mean in English?', answer: "welcome" },
  { question: 'What is the Swahili word for "book"?', answer: "kitabu" },
  { question: 'What does "shule" mean in English?', answer: "school" },
  { question: 'What is the Swahili word for "teacher"?', answer: "mwalimu" },
  { question: 'What does "mtoto" mean in English?', answer: "child" },
  { question: 'What is the Swahili word for "house"?', answer: "nyumba" },
  { question: 'What does "mbwa" mean in English?', answer: "dog" },
  { question: 'What is the Swahili word for "cat"?', answer: "paka" },
  { question: 'What does "jua" mean in English?', answer: "sun" },
  { question: 'What is the Swahili word for "moon"?', answer: "mwezi" },
  { question: 'What does "barabara" mean in English?', answer: "road" },
  { question: 'What is the Swahili word for "tree"?', answer: "mti" },
  { question: 'What does "meza" mean in English?', answer: "table" },
  { question: 'What is the Swahili word for "chair"?', answer: "kiti" },
  { question: 'What does "dirisha" mean in English?', answer: "window" },
  { question: 'What is the Swahili word for "door"?', answer: "mlango" },
  { question: 'What does "soko" mean in English?', answer: "market" },
  { question: 'What is the Swahili word for "fruit"?', answer: "tunda" },
  { question: 'What does "samaki" mean in English?', answer: "fish" },
  { question: 'What is the Swahili word for "milk"?', answer: "maziwa" },
  { question: 'What does "ugali" mean in English?', answer: "cornmeal dish" }
];

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const feedbackMessage = document.getElementById("feedback-message");

const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const longestStreakDisplay = document.getElementById("longest-streak");
const sessionXpDisplay = document.getElementById("session-xp");
const totalXpDisplay = document.getElementById("total-xp");
const lessonsCompletedDisplay = document.getElementById("lessons-completed");

const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const finalScore = document.getElementById("final-score");
const finalLongestStreak = document.getElementById("final-longest-streak");
const finalSessionXp = document.getElementById("final-session-xp");
const finalTotalXp = document.getElementById("final-total-xp");
const finalLessonsCompleted = document.getElementById("final-lessons-completed");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let longestStreak = 0;
let sessionXp = 0;
let answerSubmitted = false;

let totalXp = parseInt(localStorage.getItem("totalXp")) || 0;
let lessonsCompleted = parseInt(localStorage.getItem("lessonsCompleted")) || 0;

const correctMessages = [
  "Great job!",
  "Nice work!",
  "You got it!",
  "Excellent!",
  "Awesome answer!",
  "Well done!"
];

const wrongMessages = [
  "Good try!",
  "You're still learning!",
  "Nice effort!",
  "Keep going!",
  "Mistakes help us learn!"
];

function updatePersistentDisplays() {
  totalXpDisplay.textContent = totalXp;
  lessonsCompletedDisplay.textContent = lessonsCompleted;
}

function updateStats() {
  scoreDisplay.textContent = score;
  streakDisplay.textContent = streak;
  longestStreakDisplay.textContent = longestStreak;
  sessionXpDisplay.textContent = sessionXp;
  updatePersistentDisplays();
}

function getRandomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionText.textContent = currentQuestion.question;
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.classList.add("hidden");
  feedbackMessage.textContent = "";
  feedbackMessage.style.color = "#374151";
  answerSubmitted = false;
  answerInput.focus();
}

function checkAnswer() {
  if (answerSubmitted) return;

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

  if (userAnswer === "") {
    feedbackMessage.textContent = "Please type an answer first.";
    feedbackMessage.style.color = "#b45309";
    return;
  }

  answerSubmitted = true;
  answerInput.disabled = true;
  submitBtn.disabled = true;

  if (userAnswer === correctAnswer) {
    score++;
    streak++;
    sessionXp += 10;

    if (streak > longestStreak) {
      longestStreak = streak;
    }

    let message = getRandomMessage(correctMessages);

    if (streak === 3) {
      message += " 3 in a row!";
    } else if (streak === 5) {
      message += " 5 in a row!";
    } else if (streak === 10) {
      message += " 10 in a row!";
    }

    feedbackMessage.textContent = `${message} Correct: ${questions[currentQuestionIndex].answer}`;
    feedbackMessage.style.color = "#15803d";
  } else {
    streak = 0;
    const message = getRandomMessage(wrongMessages);
    feedbackMessage.textContent = `${message} The correct answer is: ${questions[currentQuestionIndex].answer}`;
    feedbackMessage.style.color = "#b91c1c";
  }

  updateStats();
  nextBtn.classList.remove("hidden");
}

function showResults() {
  sessionXp += 25;
  totalXp += sessionXp;
  lessonsCompleted += 1;

  localStorage.setItem("totalXp", totalXp);
  localStorage.setItem("lessonsCompleted", lessonsCompleted);

  finalScore.textContent = `${score}/${questions.length}`;
  finalLongestStreak.textContent = longestStreak;
  finalSessionXp.textContent = sessionXp;
  finalTotalXp.textContent = totalXp;
  finalLessonsCompleted.textContent = lessonsCompleted;

  updatePersistentDisplays();

  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
}

function goToNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  longestStreak = 0;
  sessionXp = 0;
  answerSubmitted = false;

  resultsScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  updateStats();
  loadQuestion();
}

submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", restartQuiz);

answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!answerSubmitted) {
      checkAnswer();
    } else {
      goToNextQuestion();
    }
  }
});

updateStats();
loadQuestion();
