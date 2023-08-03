// Selecionar todos os elementos relevantes do HTML usando atributos data-* e classes
const $celulas = document.querySelectorAll("[data-cell]");
const $board = document.querySelector("[data-board]");
const $winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const $winningMessage = document.querySelector("[data-winning-message]");
const $restartgeButton = document.querySelector("[data-restartgeButton]");
const $modeButtons = document.querySelectorAll(".mode-button");
const $modeContainer = document.querySelector(".mode-container");
const $gameBoard = document.querySelector(".board");

// Variáveis para controlar o estado do jogo
let isCircleTurn; // Define se é a vez do círculo (true) ou do "X" (false)
let isComputerMode; // Define se o modo de jogo é contra o computador (true) ou contra outro jogador (false)

// Conjunto de combinações que levam à vitória em um jogo da velha
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Event listener para os botões de seleção de modo, quando um deles é clicado, inicia o jogo com o modo selecionado
$modeButtons.forEach((button) => {
    button.addEventListener("click", startGameWithMode);
});

// Função para iniciar o jogo com o modo selecionado
function startGameWithMode(event) {
    const mode = event.target.getAttribute("data-mode"); // Obtém o modo do botão clicado
    // Esconde os botões de seleção de modo e a tela de seleção de modo
    $modeButtons.forEach((button) => {
        button.classList.add("hide");
        $modeContainer.classList.add("hide");
    });
    // Exibe o tabuleiro do jogo
    $gameBoard.classList.remove("hide");
    // Inicia o jogo com o modo selecionado
    startGame(mode);
}

// Função para iniciar o jogo com o modo selecionado
function startGame(mode) {
    isComputerMode = mode === "computer"; // Define se o modo de jogo é contra o computador ou outro jogador
    isCircleTurn = false; // Define que o jogo começa com o símbolo "X"
    fimDeGame = false; // Variável para verificar se o jogo terminou

    // Limpar a marcação das células e adicionar os eventos de clique
    for (const celula of $celulas) {
        celula.classList.remove('circle');
        celula.classList.remove('x');
        celula.removeEventListener("click", handleClick);
        celula.removeEventListener("click", handleClickAgainstComputer);
        celula.addEventListener("click", isComputerMode ? handleClickAgainstComputer : handleClick, { once: true });
    }

    // Define a classe CSS do tabuleiro de acordo com o símbolo do jogador atual
    setBoardHoverClass();
    $winningMessage.classList.remove("show-winning-message");

    if (isComputerMode && !isCircleTurn) {
        // Se o computador começa, faz um movimento inicial
        setTimeout(handleComputerMove, 500);
    }
}

// Função para encerrar o jogo e exibir a mensagem de vitória ou empate
function endGame(vencedor = null) {
    fimDeGame = true; // Define que o jogo terminou


    // Define o texto da mensagem de vitória ou empate
    if (vencedor === null) {
        $winningMessageTextElement.innerText = "Empate!";
    } else if (vencedor === "circle") {
        $winningMessageTextElement.innerText = "Círculo Venceu!";
    } else {
        $winningMessageTextElement.innerText = "X Venceu!";
    }

    // Exibe a mensagem de vitória ou empate
    $winningMessage.classList.add("show-winning-message");
}

// Função para verificar se algum jogador venceu o jogo
function checkForWin(currentPlayer) {
    // Verifica se alguma combinação de células no tabuleiro leva à vitória para o jogador atual
    const vencedor = winningCombinations.some((combination) => {
        return combination.every((index) => {
            return $celulas[index].classList.contains(currentPlayer);
        });
    });

    return vencedor; // Retorna true se houver um vencedor, ou false caso contrário
}

// Função para verificar se o jogo terminou em empate
function checkForDraw() {
    // Verifica se todas as células estão marcadas com "X" ou "O"
    return [...$celulas].every((celula) => {
        return celula.classList.contains('x') || celula.classList.contains('circle');
    });
}

// Função para marcar uma célula com o símbolo do jogador atual
function placeMark(cell, classToAdd) {
    cell.classList.add(classToAdd);
}

// Função para definir a classe CSS do tabuleiro de acordo com o símbolo do jogador atual
function setBoardHoverClass() {
    $board.classList.remove("circle");
    $board.classList.remove("x");

    if (isCircleTurn && !isComputerMode) {
        $board.classList.add("circle");
    } else {
        $board.classList.add("x");
    }
}

// Função para alternar o turno entre o jogador "X" e o círculo
function swapTurns() {
    isCircleTurn = !isCircleTurn;
    setBoardHoverClass();
}

// Função para lidar com o clique do jogador em uma célula
function handleClick(celulaElement) {
    const cell = celulaElement.target;
    const classToAdd = isCircleTurn ? "circle" : "x"; // Define o símbolo do jogador atual como "X" ou círculo

    placeMark(cell, classToAdd); // Marca a célula com o símbolo do jogador atual


    // Verifica se o jogador atual venceu o jogo ou se houve empate
    const isWin = checkForWin(classToAdd);
    const isDraw = checkForDraw();

    if (isWin) {
        endGame(classToAdd); // Exibe a mensagem de vitória do jogador atual
    } else if (isDraw) {
        endGame(); // Exibe a mensagem de empate
    } else {
        swapTurns(); // Alterna o turno para o próximo jogador
    }
}

// Função para lidar com o clique do jogador contra o computador em uma célula
function handleClickAgainstComputer(celulaElement) {
    const cell = celulaElement.target;
    if (!cell.classList.contains("x") && !cell.classList.contains("circle")) {
        // Somente se a célula ainda não foi marcada por "X" ou círculo
        const classToAdd = isCircleTurn ? "circle" : "x"; // Define o símbolo do jogador atual como "X" ou círculo
        placeMark(cell, classToAdd); // Marca a célula com o símbolo do jogador atual


        // Verifica se o jogador atual venceu o jogo ou se houve empate
        const isWin = checkForWin(classToAdd);
        const isDraw = checkForDraw();

        if (isWin) {
            endGame(classToAdd); // Exibe a mensagem de vitória do jogador atual
        } else if (isDraw) {
            endGame(); // Exibe a mensagem de empate
        } else {
            setTimeout(handleComputerMove, 700); // Faz o movimento do computador após um pequeno intervalo
        }
    }
}

// Função para fazer o movimento do computador
function handleComputerMove() {
    // Cria uma lista de células vazias
    const emptyCells = [...$celulas].filter(celula => !celula.classList.contains("x") && !celula.classList.contains("circle"));
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellToPlay = emptyCells[randomIndex];
    placeMark(cellToPlay, "circle"); // Marca uma célula com o símbolo "O" (círculo)


    // Verifica se o computador venceu o jogo ou se houve empate
    const isWin = checkForWin("circle");
    const isDraw = checkForDraw();

    if (isWin) {
        endGame("circle"); // Exibe a mensagem de vitória do computador
    } else if (isDraw) {
        endGame(); // Exibe a mensagem de empate
    }
}

// Função para exibir os botões de seleção de modo e esconder o tabuleiro do jogo
function showModeSelectionButtons() {
    $modeButtons.forEach((button) => {
        button.classList.remove("hide");
    });
    $modeContainer.classList.remove("hide");
    $gameBoard.classList.add("hide");
}

// Função para lidar com o clique do botão "restart"
function handleRestartButtonClick() {
    // Exibe a tela de seleção de modo de jogo
    showModeSelectionButtons();
    // Remove a mensagem de vitória ou empate
    $winningMessage.classList.remove("show-winning-message");

    // Reinicia o jogo com o modo selecionado após 1 segundo
    setTimeout(() => {
        startGameWithMode(isComputerMode ? "computer" : "normal");
    }, 1000);
}

// Adiciona evento de clique ao botão de reiniciar o jogo
$restartgeButton.addEventListener("click", handleRestartButtonClick);

// Inicia o jogo
startGame();
