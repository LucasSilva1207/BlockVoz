// Seletores
const $startGameButton = document.querySelector(".start-quiz");
const $nextQuestionButton = document.querySelector(".next-question");
const $questionsContainer = document.querySelector(".questions-container");
const $questionText = document.querySelector(".question");
const $answersContainer = document.querySelector(".answers-container");
const $coinsDisplay = document.querySelector(".coins");

// Áudios
const audioCorrect = new Audio("./sons/correto.mp3");
const audioIncorrect = new Audio("./sons/incorreto.mp3");

// Variáveis globais
let currentQuestionIndex = 0;
let totalCorrect = 0;
let totalCoins = 0; // Variável para contar moedas
const userId = "ID_DO_USUARIO"; // Substitua com o ID real do usuário

// Event Listeners
$startGameButton.addEventListener("click", startGame);
$nextQuestionButton.addEventListener("click", displayNextQuestion);

// Função para iniciar o jogo
function startGame() {
  $startGameButton.classList.add("hide");
  $questionsContainer.classList.remove("hide");
  shuffleQuestions();
  displayNextQuestion();
}

// Função para embaralhar as questões
function shuffleQuestions() {
  questions.sort(() => Math.random() - 0.5);
}

// Função para embaralhar respostas
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Exibir próxima questão
function displayNextQuestion() {
  resetState();

  if (questions.length === currentQuestionIndex) {
    return finishGame();
  }

  $questionText.textContent = questions[currentQuestionIndex].question;

  // Embaralha as respostas antes de exibi-las
  const shuffledAnswers = shuffleArray(questions[currentQuestionIndex].answers);

  shuffledAnswers.forEach(answer => {
    const newAnswer = document.createElement("button");
    newAnswer.classList.add("button", "answer");
    newAnswer.textContent = answer.text;
    if (answer.correct) {
      newAnswer.dataset.correct = answer.correct;
    }
    $answersContainer.appendChild(newAnswer);

    newAnswer.addEventListener("click", selectAnswer);
  });
}

// Resetar estado para próxima questão
function resetState() {
  while ($answersContainer.firstChild) {
    $answersContainer.removeChild($answersContainer.firstChild);
  }

  document.body.removeAttribute("class");
  $nextQuestionButton.classList.add("hide");
}

// Selecionar resposta
function selectAnswer(event) {
  const answerClicked = event.target;

  if (answerClicked.dataset.correct) {
    document.body.classList.add("correct");
    totalCorrect++;
    totalCoins += 10; // Incrementa 10 moedas para cada acerto
    $coinsDisplay.textContent = totalCoins; // Atualiza a exibição das moedas
    audioCorrect.play(); // Toca o som de resposta correta

    // Chama a função para atualizar as moedas no banco de dados
    atualizarMoedas(userId, 10); // Envia o ID do usuário e as moedas ganhas
  } else {
    document.body.classList.add("incorrect");
    audioIncorrect.play(); // Toca o som de resposta incorreta
  }

  // Desabilita as respostas após a escolha
  document.querySelectorAll(".answer").forEach(button => {
    button.disabled = true;

    if (button.dataset.correct) {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
  });

  // Mostra o botão de próxima questão
  $nextQuestionButton.classList.remove("hide");
  currentQuestionIndex++;
}

// Função para atualizar as moedas do usuário no backend
function atualizarMoedas(userId, moedasGanhas) {
  fetch('http://localhost:3000/api/auth/atualizarmoedas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      moedasGanhas: moedasGanhas,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.moedas !== undefined) {
        // Atualiza a exibição das moedas
        $coinsDisplay.textContent = data.moedas;
      }
    })
    .catch(error => {
      console.error('Erro ao atualizar as moedas:', error);
    });
}

// Finalizar o jogo
function finishGame() {
  const totalQuestions = questions.length;
  const performance = Math.floor((totalCorrect * 100) / totalQuestions);

  let message = "";

  switch (true) {
    case performance >= 90:
      message = "Excelente :)";
      break;
    case performance >= 70:
      message = "Muito bom :)";
      break;
    case performance >= 50:
      message = "Bom";
      break;
    default:
      message = "Pode melhorar :(";
  }

  $questionsContainer.innerHTML = 
  `
    <p class="final-message">
      Você acertou ${totalCorrect} de ${totalQuestions} questões!<br><br>
      <span>Resultado: ${message}</span><br><br>
      <span>Total de Moedas: ${totalCoins} moedas</span><br><br>
    </p>
    <button 
      onclick="window.location.reload()" 
      class="button"
    >
      Refazer teste
    </button>
  `;

  // Atualiza as moedas no banco de dados ao finalizar o jogo
  atualizarMoedas(userId, totalCoins); // Envia o ID do usuário e o total de moedas
}

// Questões do Quiz
const questions = [
  {
    question: "Qual é a principal lei no Brasil que protege mulheres contra a violência doméstica?",
    answers: [
      { text: "Lei Maria da Penha", correct: true },
      { text: "Lei da Ficha Limpa", correct: false },
      { text: "Código Penal", correct: false },
      { text: "Estatuto da Criança e do Adolescente", correct: false }
    ]
  },
  {
    question: "A violência contra a mulher pode ocorrer de várias formas. Qual das alternativas é um exemplo de violência psicológica?",
    answers: [
      { text: "Isolamento da vítima de amigos e familiares", correct: true },
      { text: "Agressão física", correct: false },
      { text: "Negação de recursos financeiros", correct: false },
      { text: "Divulgação de fotos íntimas sem consentimento", correct: false }
    ]
  },
  {
    question: "Qual dos seguintes é um canal de denúncia para vítimas de violência doméstica no Brasil?",
    answers: [
      { text: "Disque 100", correct: false },
      { text: "Disque 180", correct: true },
      { text: "190", correct: false },
      { text: "Central de Atendimento ao Trabalhador", correct: false }
    ]
  },
  {
    question: "O que caracteriza o feminicídio?",
    answers: [
      { text: "Assassinato de uma mulher por ser mulher", correct: true },
      { text: "Assassinato de uma mulher por vingança", correct: false },
      { text: "Qualquer homicídio envolvendo mulheres", correct: false },
      { text: "Crime de assédio contra mulheres", correct: false }
    ]
  },
  {
    question: "Em que ano foi sancionada a Lei Maria da Penha, que visa combater a violência doméstica no Brasil?",
    answers: [
      { text: "2006", correct: true },
      { text: "2010", correct: false },
      { text: "2000", correct: false },
      { text: "1995", correct: false }
    ]
  },
  {
    question: "A violência doméstica afeta apenas a vítima direta?",
    answers: [
      { text: "Não, ela também impacta familiares, especialmente crianças", correct: true },
      { text: "Sim, afeta apenas a pessoa agredida", correct: false },
      { text: "Não, mas só impacta o agressor", correct: false },
      { text: "Não afeta ninguém além da vítima direta", correct: false }
    ]
  }
];
