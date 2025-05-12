let timer;
let isRunning = false;
let isBreak = false;
let timeLeft = 25 * 60;

function updateTime() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("time").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateTime();
    if (timeLeft <= 0) {
      logSession();
      isBreak = !isBreak;
      const focus = parseInt(localStorage.getItem("focus") || 25);
      const brk = parseInt(localStorage.getItem("break") || 5);
      timeLeft = (isBreak ? brk : focus) * 60;
      document.getElementById("status").textContent = isBreak ? "Break Time" : "Focus Time";
      updateTime();
      if (!(localStorage.getItem("autoStart") === "true")) {
        clearInterval(timer);
        isRunning = false;
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  const focus = parseInt(localStorage.getItem("focus") || 25);
  timeLeft = focus * 60;
  isBreak = false;
  document.getElementById("status").textContent = "Focus Time";
  updateTime();
}

function saveOptions() {
  const focus = document.getElementById("focusTime").value;
  const brk = document.getElementById("breakTime").value;
  const auto = document.getElementById("autoStart").checked;
  const bgColor = document.getElementById("bgColor").value;
  localStorage.setItem("focus", focus);
  localStorage.setItem("break", brk);
  localStorage.setItem("autoStart", auto);
  localStorage.setItem("bgColor", bgColor);
  document.querySelector(".container").style.background = bgColor;
  resetTimer();
}

function logSession() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const now = new Date().toLocaleTimeString();
  history.push(`${now} - ${isBreak ? "Break Ended" : "Focus Ended"}`);
  localStorage.setItem("history", JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.slice(-5).reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;
document.getElementById("saveOptions").onclick = saveOptions;
document.getElementById("clearHistory").onclick = () => {
  localStorage.removeItem("history");
  displayHistory();
};

window.onload = () => {
  const focus = localStorage.getItem("focus") || 25;
  const brk = localStorage.getItem("break") || 5;
  document.getElementById("focusTime").value = focus;
  document.getElementById("breakTime").value = brk;
  document.getElementById("autoStart").checked = localStorage.getItem("autoStart") === "true";
  const bgColor = localStorage.getItem("bgColor");
  if (bgColor) {
    document.querySelector(".container").style.background = bgColor;
    document.getElementById("bgColor").value = bgColor;
  }
  timeLeft = focus * 60;
  updateTime();
  displayHistory();
};
