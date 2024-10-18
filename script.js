let questions = [];
let scores = {};
let currentQuestion;
let timeLeft;
let timerInterval;
let players = JSON.parse(localStorage.getItem('players')) || [];
let currentPlayerIndex = 0;
let totalRounds = localStorage.getItem('totalRounds') || 3;
let currentRound = 0;
let allowRepeats = localStorage.getItem('allowRepeats') === 'yes';

// Actualizar los controles del tiempo y las rondas desde localStorage
document.getElementById('timeSelect').value = localStorage.getItem('time') || 30;
document.getElementById('timeValue').textContent = `${localStorage.getItem('time') || 30} segundos`;
document.getElementById('roundsSelect').value = totalRounds;
document.getElementById('roundsValue').textContent = `${totalRounds} rondas`;
document.getElementById('repeatQuestions').value = allowRepeats ? 'yes' : 'no';

const presets = {
    simplePresent: [
        { question: "He _____ to the gym every day.", answer: "goes", hint: "Es un verbo en tercera persona." },
        { question: "They usually _____ breakfast at 8 AM.", answer: "have", hint: "Es un verbo que significa 'tener'." },
        { question: "She _____ a lot of books.", answer: "reads", hint: "Es un verbo que significa 'leer'." },
        { question: "It _____ cold in the winter.", answer: "gets", hint: "Verbo que indica cambio de estado." },
        { question: "I _____ work at 9 AM every day.", answer: "start", hint: "Verbo de acción." },
        { question: "He always _____ his keys.", answer: "forgets", hint: "Acción de no recordar." },
        { question: "We _____ pizza on Fridays.", answer: "eat", hint: "Verbo relacionado con alimentos." },
        { question: "She _____ for the bus every morning.", answer: "waits", hint: "Acción de quedarse hasta que llegue algo." },
        { question: "My brother _____ to school by bike.", answer: "goes", hint: "Usado para transporte." },
        { question: "They _____ the movie together.", answer: "watch", hint: "Verbo relacionado con entretenimiento visual." },
        { question: "The sun _____ in the east.", answer: "rises", hint: "Fenómeno natural de las mañanas." },
        { question: "Water _____ at 100 degrees Celsius.", answer: "boils", hint: "Proceso químico con calor." },
        { question: "We _____ soccer every weekend.", answer: "play", hint: "Actividad deportiva." },
        { question: "She _____ Spanish and English.", answer: "speaks", hint: "Habilidad lingüística." },
        { question: "He _____ very fast.", answer: "runs", hint: "Acción física de velocidad." },
        { question: "They _____ their homework after school.", answer: "do", hint: "Obligación académica." },
        { question: "The train _____ at 7 PM.", answer: "leaves", hint: "Acción de partida." },
        { question: "My mom _____ delicious cakes.", answer: "bakes", hint: "Actividad culinaria." },
        { question: "I _____ the guitar.", answer: "play", hint: "Habilidad musical." },
        { question: "He _____ his car every week.", answer: "washes", hint: "Acción de limpiar algo." },
        { question: "They _____ a lot of questions in class.", answer: "ask", hint: "Acción común en el aprendizaje." },
        { question: "She _____ letters to her friends.", answer: "writes", hint: "Acción con papel y lápiz." },
        { question: "He _____ a hat when it's sunny.", answer: "wears", hint: "Acción relacionada con la ropa." },
        { question: "We _____ our vacation in July.", answer: "take", hint: "Acción de descanso planeado." },
        { question: "The dog _____ at strangers.", answer: "barks", hint: "Sonido que hace un perro." },
        { question: "I _____ coffee every morning.", answer: "drink", hint: "Acción relacionada con bebidas." },
        { question: "She _____ her bedroom every Saturday.", answer: "cleans", hint: "Acción relacionada con la organización." },
        { question: "They _____ new languages easily.", answer: "learn", hint: "Acción relacionada con la adquisición de conocimiento." },
        { question: "He _____ video games after school.", answer: "plays", hint: "Actividad de entretenimiento electrónico." },
        { question: "We _____ to the radio in the car.", answer: "listen", hint: "Acción relacionada con el sentido auditivo." },
        { question: "The baby _____ at night.", answer: "cries", hint: "Acción relacionada con el malestar o hambre." },
        { question: "She _____ vegetables from her garden.", answer: "grows", hint: "Acción de cultivar algo." },
        { question: "They _____ in the park every Sunday.", answer: "jog", hint: "Acción de correr lentamente." },
        { question: "He _____ chess with his dad.", answer: "plays", hint: "Un juego de estrategia." },
        { question: "The teacher _____ the lesson every day.", answer: "explains", hint: "Acción de aclarar información." },
        { question: "She _____ with her parents on the phone.", answer: "talks", hint: "Acción comunicativa." }
    ],

    continuousPresent: [
        { question: "I _____ a book right now.", answer: "am reading", hint: "Usa 'am' y un verbo en gerundio." },
        { question: "They _____ to the park at the moment.", answer: "are going", hint: "Usa 'are' seguido de un verbo." },
        { question: "He _____ dinner when I called.", answer: "was having", hint: "Usa 'was' seguido de un verbo." },
        { question: "She _____ the guitar right now.", answer: "is playing", hint: "Acción en progreso." },
        { question: "We _____ lunch together.", answer: "are having", hint: "Acción relacionada con la comida." },
        { question: "The kids _____ in the garden.", answer: "are playing", hint: "Actividad recreativa al aire libre." },
        { question: "I _____ for the bus.", answer: "am waiting", hint: "Acción en proceso relacionada con el transporte." },
        { question: "They _____ a movie.", answer: "are watching", hint: "Acción de entretenimiento visual." },
        { question: "The sun _____.", answer: "is setting", hint: "Fenómeno natural al final del día." },
        { question: "The baby _____.", answer: "is crying", hint: "Acción de expresar malestar o hambre." },
        { question: "I _____ the dishes right now.", answer: "am washing", hint: "Acción doméstica en progreso." },
        { question: "She _____ her homework.", answer: "is doing", hint: "Obligación académica en curso." },
        { question: "He _____ a bike.", answer: "is riding", hint: "Acción relacionada con el transporte en dos ruedas." },
        { question: "We _____ to the radio.", answer: "are listening", hint: "Acción auditiva en progreso." },
        { question: "They _____ their new project.", answer: "are discussing", hint: "Acción comunicativa relacionada con un tema." },
        { question: "He _____ a letter.", answer: "is writing", hint: "Acción en progreso con papel y lápiz." },
        { question: "She _____ vegetables in her garden.", answer: "is growing", hint: "Acción agrícola en progreso." },
        { question: "The dog _____ in the yard.", answer: "is running", hint: "Acción rápida al aire libre." },
        { question: "They _____ about their trip.", answer: "are talking", hint: "Conversación en progreso." },
        { question: "I _____ for my keys.", answer: "am looking", hint: "Acción de buscar algo perdido." },
        { question: "She _____ the laundry.", answer: "is folding", hint: "Acción doméstica relacionada con la ropa." },
        { question: "The students _____ for the exam.", answer: "are preparing", hint: "Acción de estudio en curso." },
        { question: "He _____ dinner right now.", answer: "is cooking", hint: "Acción culinaria en progreso." },
        { question: "The birds _____ in the trees.", answer: "are singing", hint: "Sonido natural emitido por aves." },
        { question: "We _____ our house.", answer: "are cleaning", hint: "Acción doméstica en curso." },
        { question: "She _____ her presentation.", answer: "is practicing", hint: "Acción en preparación para algo." },
        { question: "They _____ for their trip tomorrow.", answer: "are packing", hint: "Acción relacionada con los preparativos para un viaje." },
        { question: "He _____ his car right now.", answer: "is fixing", hint: "Acción de reparación en curso." },
        { question: "The team _____ their next move.", answer: "is planning", hint: "Acción de estrategia en progreso." },
        { question: "I _____ to a podcast.", answer: "am listening", hint: "Acción auditiva relacionada con contenido en línea." },
        { question: "They _____ the new rules.", answer: "are discussing", hint: "Acción de conversación sobre un tema específico." },
        { question: "She _____ her vacation.", answer: "is planning", hint: "Acción de organización futura." },
        { question: "He _____ a speech.", answer: "is giving", hint: "Acción pública en progreso." },
        { question: "We _____ for our flight.", answer: "are waiting", hint: "Acción de espera en progreso." }
    ],

    geography: [
        { question: "¿Cuál es la capital de Francia?", answer: "París", hint: "Es famosa por la Torre Eiffel." },
        { question: "¿Qué océano está al este de los Estados Unidos?", answer: "Atlántico", hint: "Es uno de los océanos más grandes." },
        { question: "¿Qué país tiene la forma de una bota?", answer: "Italia", hint: "Famoso por su comida y arte." },
        { question: "¿Cuál es el río más largo del mundo?", answer: "Amazonas", hint: "Río que atraviesa América del Sur." },
        { question: "¿Qué montaña es la más alta del mundo?", answer: "Everest", hint: "Ubicada en Asia." },
        { question: "¿Cuál es el país más grande del mundo?", answer: "Rusia", hint: "País que ocupa dos continentes." },
        { question: "¿Qué continente está al sur de Europa?", answer: "África", hint: "Famoso por su biodiversidad y desiertos." },
        { question: "¿Qué país tiene más de 1,400 millones de habitantes?", answer: "China", hint: "País en Asia con una gran muralla." },
        { question: "¿Cuál es el desierto más grande del mundo?", answer: "Sahara", hint: "Ubicado en el norte de África." },
        { question: "¿En qué continente se encuentra Brasil?", answer: "América del Sur", hint: "Conocido por el Amazonas y el carnaval de Río." },
        { question: "¿Qué país tiene la Gran Barrera de Coral?", answer: "Australia", hint: "Famoso por su biodiversidad marina." },
        { question: "¿Cuál es la capital de Japón?", answer: "Tokio", hint: "Ciudad famosa por su tecnología y cultura pop." },
        { question: "¿Cuál es el país más pequeño del mundo?", answer: "Vaticano", hint: "Sede de la Iglesia Católica." },
        { question: "¿Cuál es el río más largo de Europa?", answer: "Volga", hint: "Río que atraviesa Rusia." },
        { question: "¿Qué país es conocido como 'La tierra del sol naciente'?", answer: "Japón", hint: "País insular en Asia." },
        { question: "¿En qué país está la Torre de Pisa?", answer: "Italia", hint: "Famoso por su inclinación." },
        { question: "¿Qué país es famoso por los tulipanes y los molinos de viento?", answer: "Países Bajos", hint: "Ubicado en Europa." },
        { question: "¿Cuál es el lago más profundo del mundo?", answer: "Baikal", hint: "Lago ubicado en Siberia." },
        { question: "¿Qué continente está al oeste de América del Norte?", answer: "Asia", hint: "Conectado por el estrecho de Bering." },
        { question: "¿Cuál es la capital de Canadá?", answer: "Ottawa", hint: "Ubicada en la provincia de Ontario." },
        { question: "¿Qué país africano tiene forma de triángulo invertido?", answer: "Sudáfrica", hint: "Ubicado en el extremo sur de África." },
        { question: "¿En qué continente se encuentra India?", answer: "Asia", hint: "País conocido por el Taj Mahal." },
        { question: "¿Qué país tiene la selva amazónica?", answer: "Brasil", hint: "País con el mayor porcentaje de la selva tropical." },
        { question: "¿En qué continente se encuentra Argentina?", answer: "América del Sur", hint: "Conocida por el tango y las pampas." },
        { question: "¿Qué país europeo es famoso por el chocolate y los relojes?", answer: "Suiza", hint: "Conocido por los Alpes." },
        { question: "¿Cuál es la capital de Egipto?", answer: "El Cairo", hint: "Cercana a las pirámides de Giza." },
        { question: "¿Qué isla europea es famosa por su volcán Vesubio?", answer: "Italia", hint: "El volcán está en Nápoles." },
        { question: "¿Qué país es conocido por los fiordos?", answer: "Noruega", hint: "Famoso por sus paisajes naturales." },
        { question: "¿Cuál es la capital de Rusia?", answer: "Moscú", hint: "Famosa por la Plaza Roja y el Kremlin." },
        { question: "¿En qué continente está Islandia?", answer: "Europa", hint: "País insular al norte del Atlántico." },
        { question: "¿Qué país tiene el mayor número de islas?", answer: "Suecia", hint: "Conocido por sus paisajes nórdicos." },
        { question: "¿Qué océano baña las costas de Chile?", answer: "Pacífico", hint: "El más grande del mundo." },
        { question: "¿Qué desierto se encuentra en Chile?", answer: "Atacama", hint: "Uno de los más áridos del mundo." },
        { question: "¿Qué país tiene la ciudad de Buenos Aires?", answer: "Argentina", hint: "Conocida por el Obelisco." },
        { question: "¿Qué país es famoso por la torre Eiffel?", answer: "Francia", hint: "Ubicada en París." }
    ],

    programming: [
        { question: "¿Qué se utiliza para imprimir en la consola en JavaScript?", answer: "console.log", hint: "Es un método." },
        { question: "¿Cómo se declara una variable en JavaScript?", answer: "let", hint: "También puedes usar 'var' o 'const'." },
        { question: "¿Qué es un bucle?", answer: "Una estructura que repite acciones.", hint: "Se puede usar 'for', 'while', etc." },
        { question: "¿Qué estructura permite elegir entre varias opciones?", answer: "if else", hint: "Es una declaración condicional." },
        { question: "¿Cómo se define una función en JavaScript?", answer: "function", hint: "Palabra clave para definir funciones." },
        { question: "¿Qué símbolo se usa para comentarios en JavaScript?", answer: "//", hint: "Usado para añadir notas al código." },
        { question: "¿Qué significa HTML?", answer: "HyperText Markup Language", hint: "Es el lenguaje de marcado para la web." },
        { question: "¿Qué se usa para darle estilo a una página web?", answer: "CSS", hint: "Lenguaje de estilos." },
        { question: "¿Qué es una API?", answer: "Application Programming Interface", hint: "Permite la comunicación entre aplicaciones." },
        { question: "¿Qué es un array?", answer: "Una estructura de datos que almacena elementos.", hint: "Puede contener múltiples valores." },
        { question: "¿Qué es un objeto en JavaScript?", answer: "Una colección de propiedades y métodos.", hint: "Es un tipo de dato complejo." },
        { question: "¿Qué comando en Git guarda los cambios?", answer: "commit", hint: "Es parte del sistema de control de versiones." },
        { question: "¿Qué significa JSON?", answer: "JavaScript Object Notation", hint: "Formato ligero para intercambio de datos." },
        { question: "¿Qué es una promesa en JavaScript?", answer: "Un objeto que representa un valor eventual.", hint: "Manejo de operaciones asíncronas." },
        { question: "¿Qué palabra clave se usa para manejar errores?", answer: "try catch", hint: "Estructura para captura de excepciones." },
        { question: "¿Qué framework se usa comúnmente con JavaScript para desarrollo web?", answer: "React", hint: "Es una biblioteca para construir interfaces." },
        { question: "¿Qué lenguaje se utiliza para interactuar con bases de datos?", answer: "SQL", hint: "Usado para realizar consultas en bases de datos." },
        { question: "¿Qué comando instala paquetes en Node.js?", answer: "npm install", hint: "Es parte del gestor de paquetes de Node." },
        { question: "¿Qué es DOM?", answer: "Document Object Model", hint: "Representa la estructura de documentos HTML y XML." },
        { question: "¿Qué protocolo se usa para la comunicación entre un cliente y un servidor?", answer: "HTTP", hint: "Protocolo de transferencia de hipertexto." },
        { question: "¿Qué es una función de callback?", answer: "Una función pasada como argumento a otra función.", hint: "Se ejecuta después de otra operación." },
        { question: "¿Qué es una función anónima?", answer: "Una función sin nombre.", hint: "A menudo se usa como argumento en otras funciones." },
        { question: "¿Qué herramienta se usa para el control de versiones?", answer: "Git", hint: "Permite rastrear cambios en el código." },
        { question: "¿Qué es un servidor?", answer: "Un sistema que responde a las solicitudes de los clientes.", hint: "Es fundamental en la arquitectura web." },
        { question: "¿Qué lenguaje se usa principalmente para el backend en Node.js?", answer: "JavaScript", hint: "Permite el desarrollo del lado del servidor." },
        { question: "¿Qué comando en Git crea una nueva rama?", answer: "git branch", hint: "Permite trabajar en diferentes versiones del código." },
        { question: "¿Qué es un IDE?", answer: "Integrated Development Environment", hint: "Herramienta para escribir y depurar código." },
        { question: "¿Qué es un servidor web?", answer: "Un software que sirve contenido web a los navegadores.", hint: "Es clave en el desarrollo web." },
        { question: "¿Qué lenguaje se usa para describir la estructura de una página web?", answer: "HTML", hint: "Es el lenguaje básico para crear páginas web." },
        { question: "¿Qué biblioteca se usa para manipular el DOM en JavaScript?", answer: "jQuery", hint: "Facilita la interacción con el DOM." },
        { question: "¿Qué significa API REST?", answer: "Representational State Transfer", hint: "Es un estilo de arquitectura para servicios web." },
        { question: "¿Qué comando en Linux se usa para listar archivos?", answer: "ls", hint: "Muestra los archivos y carpetas en un directorio." },
        { question: "¿Qué es una variable global?", answer: "Una variable accesible desde cualquier parte del código.", hint: "Se declara fuera de las funciones." },
        { question: "¿Qué es Node.js?", answer: "Un entorno de ejecución de JavaScript del lado del servidor.", hint: "Permite usar JavaScript fuera del navegador." },
        { question: "¿Qué es una clase en programación?", answer: "Un modelo para crear objetos.", hint: "Contiene propiedades y métodos." },
        { question: "¿Qué significa CRUD?", answer: "Create, Read, Update, Delete", hint: "Son operaciones básicas en bases de datos." },
        { question: "¿Qué es el Hoisting en JavaScript?", answer: "Un comportamiento donde las declaraciones son movidas al tope del código.", hint: "Afecta variables y funciones." }
    ],
    math: [
        { question: "¿Cuánto es 5 + 7?", answer: "12", hint: "Suma dos números." },
        { question: "¿Cuál es el área de un cuadrado con lados de 4?", answer: "16", hint: "Multiplica el lado por sí mismo." },
        { question: "¿Cuánto es 9 * 9?", answer: "81", hint: "Es el cuadrado de 9." }
    ],
    history: [
        { question: "¿Quién fue el primer presidente de los EE. UU.?", answer: "George Washington", hint: "Sirvió de 1789 a 1797." },
        { question: "¿En qué año comenzó la Segunda Guerra Mundial?", answer: "1939", hint: "Fue un conflicto global." },
        { question: "¿Quién fue Cleopatra?", answer: "Reina de Egipto", hint: "Conocida por su belleza." }
    ]
};

// Recuperar la lista de jugadores si hay jugadores almacenados
updatePlayerList();

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
    document.getElementById('editQuestionsModal').style.display = 'none';
});
document.getElementById('hintButton').addEventListener('click', giveHint);

const timeSelect = document.getElementById('timeSelect');
timeSelect.addEventListener('input', function() {
    document.getElementById('timeValue').textContent = `${timeSelect.value} segundos`;
    localStorage.setItem('time', timeSelect.value); // Guardar el tiempo en localStorage
});

const roundsSelect = document.getElementById('roundsSelect');
roundsSelect.addEventListener('input', function() {
    document.getElementById('roundsValue').textContent = `${roundsSelect.value} rondas`;
    localStorage.setItem('totalRounds', roundsSelect.value); // Guardar las rondas en localStorage
});

const repeatQuestionsSelect = document.getElementById('repeatQuestions');
repeatQuestionsSelect.addEventListener('change', function() {
    allowRepeats = repeatQuestionsSelect.value === 'yes';
    localStorage.setItem('allowRepeats', allowRepeats ? 'yes' : 'no'); // Guardar la opción de repetir preguntas
});

function addPlayer() {
    const playerInput = document.getElementById('playerInput');
    const playerName = playerInput.value.trim();
    if (playerName) {
        players.push(playerName);
        scores[playerName] = { score: 0, correct: 0, incorrect: 0 };
        playerInput.value = '';
        updatePlayerList();
        localStorage.setItem('players', JSON.stringify(players)); // Guardar los nombres de los jugadores en localStorage
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = player;

        // Añadir botón para quitar jugadores
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Quitar';
        removeButton.addEventListener('click', () => {
            removePlayer(index);
        });

        li.appendChild(removeButton);
        playerList.appendChild(li);
    });
}

function removePlayer(index) {
    const playerName = players[index];
    players.splice(index, 1); // Eliminar jugador de la lista
    delete scores[playerName]; // Eliminar el puntaje del jugador
    updatePlayerList(); // Actualiza la lista
    localStorage.setItem('players', JSON.stringify(players)); // Actualizar los jugadores en localStorage
}

function startGame() {
    if (players.length === 0) {
        alert("Por favor, añade al menos un jugador.");
        return;
    }
    totalRounds = parseInt(roundsSelect.value);
    currentRound = 0;
    currentPlayerIndex = 0;
    allowRepeats = repeatQuestionsSelect.value === 'yes';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    nextRound();
}

function loadPresets() {
    const selectedPreset = document.getElementById('presets').value;
    questions = presets[selectedPreset] || [];
    alert("Preguntas cargadas.");
}

function nextRound() {
    if (players.length === 1) {
        alert(`${players[0]} es el ganador!`);
        endGame();
        return;
    }

    if (currentRound < totalRounds) {
        currentPlayerIndex = 0; // Reiniciar el índice del jugador para cada nueva ronda
        askNextQuestion();
    } else {
        endGame();
    }
}

function askNextQuestion() {
    if (currentPlayerIndex < players.length) {
        const currentPlayerName = players[currentPlayerIndex];
        document.getElementById('currentPlayerName').textContent = currentPlayerName;

        if (!allowRepeats) {
            // Filtrar preguntas ya usadas
            questions = questions.filter(q => !q.used);
            if (questions.length === 0) {
                alert("No hay más preguntas disponibles. Fin del juego.");
                endGame();
                return;
            }
        }

        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        document.getElementById('question').textContent = currentQuestion.question;
        document.getElementById('hint').style.display = 'none';
        document.getElementById('answer').disabled = false;
        document.getElementById('submitAnswer').disabled = false;
        timeLeft = parseInt(document.getElementById('timeSelect').value);
        document.getElementById('time').textContent = timeLeft;
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        // Todos los jugadores respondieron, iniciar la siguiente ronda
        currentRound++;
        nextRound();
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
        scores[players[currentPlayerIndex]].correct++;
        alert("¡Correcto!");
    } else {
        scores[players[currentPlayerIndex]].score--;
        scores[players[currentPlayerIndex]].incorrect++;
        alert(`Incorrecto. La respuesta correcta era: ${correctAnswer}`);
    }

    // Marcar la pregunta como usada si no se permiten repeticiones
    if (!allowRepeats) {
        currentQuestion.used = true;
    }

    // Verificar si el jugador debe ser descalificado
    if (scores[players[currentPlayerIndex]].score <= 0) {
        alert(`${players[currentPlayerIndex]} ha sido descalificado.`);
        players.splice(currentPlayerIndex, 1); // Elimina al jugador
        localStorage.setItem('players', JSON.stringify(players)); // Actualiza los jugadores en localStorage

        if (players.length === 1) {
            alert(`${players[0]} es el ganador!`);
            endGame();
            return;
        }

    } else {
        answerInput.value = '';
    }

    currentPlayerIndex++; // Pasar al siguiente jugador
    askNextQuestion(); // Continuar con la siguiente pregunta
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('game').style.display = 'none';
    displayScores();
    document.getElementById('retryButton').style.display = 'block';
    localStorage.clear(); // Limpiar localStorage al final del juego
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
    players = [];
    scores = {};
    currentRound = 0;
    currentPlayerIndex = 0;
    document.getElementById('scores').style.display = 'none';
    document.getElementById('retryButton').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
}

function openCustomMode() {
    document.getElementById('editQuestionsModal').style.display = 'block';
}

function saveCustomQuestions() {
    const customQuestionsText = document.getElementById('customQuestionsText').value;
    const customQuestions = customQuestionsText.split('\n').map(line => {
        const parts = line.split('|');
        return {
            question: parts[0],
            answer: parts[1],
            hint: parts[2] || ''
        };
    });
    questions = [...questions, ...customQuestions]; // Agregar preguntas personalizadas
    alert("Preguntas personalizadas guardadas.");
    document.getElementById('customQuestionsText').value = '';
    document.getElementById('editQuestionsModal').style.display = 'none';
}

function showInstructions() {
    document.getElementById('instructions').style.display = 'block';
}

function closeInstructions() {
    document.getElementById('instructions').style.display = 'none';
}

function giveHint() {
    if (currentQuestion && currentQuestion.hint) {
        alert(`Pista: ${currentQuestion.hint}`);
        scores[players[currentPlayerIndex]].score--; // Descuenta 1 punto
    } else {
        alert("No hay pista disponible para esta pregunta.");
    }
}
