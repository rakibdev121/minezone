const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

if (user) {
    console.log("Telegram User ID:", user.id);
    console.log("First Name:", user.first_name);
    console.log("Username:", user.username);
} else {
    console.log("Telegram user information পাওয়া যায়নি।");
}


let balance = 125;
let miningAvailable = true;

const balanceElement = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");


function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
}


mineBtn.addEventListener("click", function () {

    if (!miningAvailable) {
        showMessage("⏳ Mining is not available yet!");
        return;
    }

    balance += 10;

    updateBalance();

    miningAvailable = false;

    mineBtn.textContent = "Mining Completed ✓";
    mineBtn.style.opacity = "0.6";

    showMessage("⛏️ +10 Points Added!");

    startTimer();
});


function startTimer() {

    let seconds = 24 * 60 * 60;

    const timer = document.getElementById("timer");

    const interval = setInterval(() => {

        seconds--;

        if (seconds <= 0) {

            clearInterval(interval);

            miningAvailable = true;

            mineBtn.textContent = "Start Mining";
            mineBtn.style.opacity = "1";

            timer.textContent = "Ready!";

            return;
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        timer.textContent =
            `${hours}h ${minutes}m ${secs}s`;

    }, 1000);
}


function showMessage(name) {

    const toast = document.getElementById("toast");

    toast.textContent =
        `${name} page coming soon 🚀`;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}


updateBalance();
