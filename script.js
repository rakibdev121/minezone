const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

const userId = user?.id || "123";

const API_URL = "http://127.0.0.1:3000";

const balanceElement = document.getElementById("balance");
const mineBtn = document.getElementById("mineBtn");

let balance = 0;
let miningAvailable = true;


// =========================
// LOAD USER BALANCE
// =========================

async function loadUser() {
    try {
        const response = await fetch(
            `${API_URL}/api/user/${userId}`
        );

        const data = await response.json();

        if (data.success) {
            balance = Number(data.balance);
            updateBalance();
        }

    } catch (error) {
        console.log("Backend connection error:", error);
        showMessage("⚠️ Backend connection failed");
    }
}


// =========================
// UPDATE BALANCE
// =========================

function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
}


// =========================
// DAILY BONUS
// =========================

async function claimBonus() {

    try {

        const response = await fetch(
            `${API_URL}/api/bonus/${userId}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (data.success) {

            balance = Number(data.balance);

            updateBalance();

            showMessage(
                `🎁 +${data.bonus} Points Added!`
            );

        } else {

            showMessage(
                "⏳ Daily Bonus already claimed!"
            );
        }

    } catch (error) {

        console.log(error);

        showMessage(
            "⚠️ Backend connection failed"
        );
    }
}


// =========================
// MINING
// =========================

mineBtn.addEventListener("click", async function () {

    if (!miningAvailable) {

        showMessage(
            "⏳ Mining is not available yet!"
        );

        return;
    }

    // আপাতত frontend mining
    balance += 10;

    updateBalance();

    miningAvailable = false;

    mineBtn.textContent =
        "Mining Completed ✓";

    mineBtn.style.opacity = "0.6";

    showMessage(
        "⛏️ +10 Points Added!"
    );

    startTimer();
});


// =========================
// 24 HOUR TIMER
// =========================

function startTimer() {

    let seconds = 24 * 60 * 60;

    const timer =
        document.getElementById("timer");

    const interval =
        setInterval(() => {

            seconds--;

            if (seconds <= 0) {

                clearInterval(interval);

                miningAvailable = true;

                mineBtn.textContent =
                    "Start Mining";

                mineBtn.style.opacity = "1";

                timer.textContent =
                    "Ready!";

                return;
            }

            const hours =
                Math.floor(seconds / 3600);

            const minutes =
                Math.floor(
                    (seconds % 3600) / 60
                );

            const secs =
                seconds % 60;

            timer.textContent =
                `${hours}h ${minutes}m ${secs}s`;

        }, 1000);
}


// =========================
// BUTTON ACTIONS
// =========================

function showMessage(name) {

    // Daily Bonus button
    if (name === "Daily Bonus") {

        claimBonus();

        return;
    }

    const toast =
        document.getElementById("toast");

    toast.textContent =
        `${name} page coming soon 🚀`;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);
}


// =========================
// START
// =========================

updateBalance();

loadUser();
