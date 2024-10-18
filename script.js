let questions = []; 
let scores = {};
let currentQuestion;
let timeLeft;
let timerInterval;
let players = [];
let currentPlayerIndex = 0;
let totalRounds;
let currentRound = 0;

const presets = {
    simplePresent: [
        { question: "He _____ to the gym every day.", answer: "goes", hint: "Es un verbo en tercera persona." },
        { question: "They usually _____ breakfast at 8 AM.", answer: "have", hint: "Es un verbo que significa 'tener'." },
        { question: "She _____ a lot of books.", answer: "reads", hint: "Es un verbo que significa 'leer'." }
    ],
    continuousPresent: [
        { question: "I _____ a book right now.", answer: "am reading", hint: "Usa 'am' y un verbo en gerundio." },
        { question: "They _____ to the park at the moment.", answer: "are going", hint: "Usa 'are' seguido de un verbo." },
        { question: "He _____ dinner when I called.", answer: "was having", hint: "Usa 'was' seguido de un verbo." }
    ],
    geography: [
        { question: "¿Cuál es la capital de Francia?", answer: "París", hint: "Es famosa por la Torre Eiffel." },
        { question: "¿Qué océano está al este de los Estados Unidos?", answer: "Atlántico", hint: "Es uno de los océanos más grandes." },
        { question: "¿Qué país tiene la forma de una bota?", answer: "Italia", hint: "Famoso por su comida y arte." }
    ]
};

document.getElementById('addPlayer').addEventListener('click', addPlayer);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('submitAnswer').addEventListener('click', checkAnswer);
document.getElementById('loadPresets').addEventListener('click', loadPresets);
document.getElementById('customMode').addEventListener('click', openCustomMode);
document.getElementById('saveCustomQuestions').addEventListener('click', saveCustomQuestions);
document.getElementById('showInstructions').addEventListener('click', showInstructions);
document.getElementById('closeInstructions').addEventListener('click', closeInstructions);
document.getElementById('retryButton').addEventListener('click', retryGame);
document.getElementById('closeCustomMode').addEventListener('click', () => {
    document.getElementById('customModeModal').style.display = 'none';
});

function addPlayer() {
    const playerInput = document.getElementById('playerInput');
    const playerName = playerInput.value.trim();
    if (playerName) {
        players.push(playerName);
        scores[playerName] = { score: 0, correct: 0, incorrect: 0 };
        playerInput.value = '';
        updatePlayerList();
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });
}

function startGame() {
    if (players.length === 0) {
        alert("Por favor, añade al menos un jugador.");
        return;
    }
    totalRounds = parseInt(document.getElementById('roundsSelect').value);
    currentRound = 0;
    currentPlayerIndex = 0;
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    nextQuestion();
}

function loadPresets() {
    const selectedPreset = document.getElementById('presets').value;
    questions = presets[selectedPreset] || [];
    alert("Preguntas cargadas.");
}

function nextQuestion() {
    if (currentRound < totalRounds) {
        const currentPlayerName = players[currentPlayerIndex];
        document.getElementById('currentPlayerName').textContent = currentPlayerName;
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        document.getElementById('question').textContent = currentQuestion.question;
        document.getElementById('answer').disabled = false;
        document.getElementById('submitAnswer').disabled = false;
        timeLeft = parseInt(document.getElementById('timeSelect').value);
        document.getElementById('time').textContent = timeLeft;
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        endGame();
    }
}

function updateTimer() {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        checkAnswer();
    }
}

function checkAnswer() {
    clearInterval(timerInterval);
    const answerInput = document.getElementById('answer');
    const answer = answerInput.value.trim();
    const correctAnswer = currentQuestion.answer;

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        scores[players[currentPlayerIndex]].score++;
        alert("¡Correcto!");
    } else {
        scores[players[currentPlayerIndex]].score--;
        alert(`Incorrecto. La respuesta correcta era: ${correctAnswer}`);
    }

    answerInput.value = '';
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        currentRound++;
    }
    nextQuestion();
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('game').style.display = 'none';
    displayScores();
    document.getElementById('retryButton').style.display = 'block';
}

function displayScores() {
    const scoreboard = document.getElementById('scoreboard').getElementsByTagName('tbody')[0];
    scoreboard.innerHTML = '';
    for (const player in scores) {
        const row = scoreboard.insertRow();
        row.insertCell(0).textContent = player;
        row.insertCell(1).textContent = scores[player].score;
        row.insertCell(2).textContent = scores[player].score > 0 ? 'Ganó' : 'Perdió';
        row.insertCell(3).textContent = scores[player].correct;
        row.insertCell(4).textContent = scores[player].incorrect;
    }
    document.getElementById('scores').style.display = 'block';
}

function retryGame() {
    scores = {};
    players.forEach(player => {
        scores[player] = { score: 0, correct: 0, incorrect: 0 };
    });
    currentRound = 0;
    currentPlayerIndex = 0;
    document.getElementById('scores').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    nextQuestion();
}

function openCustomMode() {
    document.getElementById('customModeModal').style.display = 'block';
}

function saveCustomQuestions() {
    const customQuestionsText = document.getElementById('customQuestionsText').value.trim();
    const customQuestions = customQuestionsText.split('\n').map(line => {
        const parts = line.split('|');
        return {
            question: parts[0],
            answer: parts[1],
            hint: parts[2] || ''
        };
    });
    questions = customQuestions;
    alert("Preguntas personalizadas guardadas.");
    document.getElementById('customQuestionsText').value = '';
    document.getElementById('customModeModal').style.display = 'none';
}

function showInstructions() {
    document.getElementById('instructions').style.display = 'block';
}

function closeInstructions() {
    document.getElementById('instructions').style.display = 'none';
}
