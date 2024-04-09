let fill = 90;
let intervalId = null;
const fishbowl = document.getElementById('fishbowl');
const fish = document.getElementById('fish');
const tap = document.getElementById('tap');
const message = document.getElementById('message');
const warning = document.getElementById('warning');
const caption = document.getElementById('caption');
const countdown = document.getElementById('countdown');
const WATER_CAPACITY = 90;

const updateWaterLevel = () => {
    fishbowl.style.setProperty('--filling', fill);
};

const showMessage = (msg, color) => {
    message.innerText = msg;
    message.style.color = color;
};

const checkFishStatus = () => {
    if (fill <= 0) {
        clearInterval(intervalId);
        fish.classList.add('fishbowl__fish--dead');
        caption.classList.remove('hidden');
        warning.classList.remove('hidden');
        showMessage(warning, "The fish died because you didn't drink water!", "message--danger");
        hideRefillMessage(); // Hide refill message if fish dies
    } else if (fill < 40) {
        fish.classList.add('fishbowl__fish--dying');
        warning.classList.remove('hidden');
        showMessage(warning, "The fish died because you didn't drink water!", "message--warning"); // Set warning message in yellow
        showRefillMessage(); // Show refill message after the low water level warning
    } else {
        fish.classList.remove('fishbowl__fish--dying');
        fish.classList.remove('fishbowl__fish--dead');
        warning.classList.add('message--happy');
        warning.innerText = "The fish died!"; // Display refill message when water level is normal
        showMessage(warning, "The fish died because you didn't drink water!!", "message--happy"); // Set message color to green
        hideRefillMessage(); // Hide the message "Your fish misses water. Drink up!"
    }
};

const startCountdown = (duration) => {
    countdown.innerText = duration;
    countdown.classList.remove('hidden');

    const timer = setInterval(() => {
        duration--;
        countdown.innerText = duration;

        if (duration <= 0) {
            clearInterval(timer);
            countdown.classList.add('hidden');
            checkFishStatus(); // Check fish status after countdown ends
        }
    }, 1000); // 1 second intervals

    return timer;
};

const emptyingFn = (duration) => {
    startCountdown(duration);
    const decreaseRate = WATER_CAPACITY / duration;

    return setInterval(() => {
        fill -= decreaseRate;
        fill = Math.max(fill, 0); // Ensure fill is not negative
        updateWaterLevel();
        checkFishStatus();
    }, 1000);
};

const startSimulation = () => {
    let userDuration = parseInt(prompt("How many minutes until your next glass of water?"));
    userDuration = isNaN(userDuration) ? 1 : userDuration;
    intervalId = emptyingFn(userDuration);
};

startSimulation();

tap.addEventListener('click', () => {
    tap.classList.add('fishbowl__tap--active');
    setTimeout(() => tap.classList.remove('fishbowl__tap--active'), 500);

    clearInterval(intervalId); // Clear any existing intervals
    if (fill <= 0) {
        fill = WATER_CAPACITY;
        updateWaterLevel();
        showRefillMessage(); // Show refill message after filling water
        startSimulation();
    } else {
        fill = Math.min(fill + 20, WATER_CAPACITY);
        updateWaterLevel();
        checkFishStatus();
        showRefillMessage(); // Show refill message after filling water
    }
});
