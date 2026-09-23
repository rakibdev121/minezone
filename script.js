const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
const userId = user?.id || "123";

const API_URL = "https://website-berlin-overnight-network.trycloudflare.com";

const balanceElement = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");

let balance = 0;
let miningAvailable = true;

async function loadUser() {
    try {
        const response = await fetch(`${API_URL}/api/user/${userId}`);
        const data = await response.json();

        if (data.success) {
            balance = data.balance;
            updateBalance();
        }
    } catch (error) {
        console.error(error);
        showMessage("❌ Server connection failed");
    }
}

async function claimBonus() {
    try {
        const response = await fetch(
            `${API_URL}/api/bonus/${userId}`,
            { method: "POST" }
        );

        const data = await response.json();

        if (data.success) {
            balance = data.balance;
            updateBalance();
            showMessage(`🎁 +${data.bonus} Points Added!`);
        } else {
            showMessage("⏳ " + data.message);
        }
    } catch (error) {
        console.error(error);
        showMessage("❌ Server connection failed");
    }
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

        timer.textContent = `${hours}h ${minutes}m ${secs}s`;
    }, 1000);
}

function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
}

function showMessage(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

updateBalance();
loadUser();
