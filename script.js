// ゲーム開始ボタンの取得
const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');

// フルーツ生成関数
function createFruit() {
    const fruit = document.createElement('div');
    fruit.classList.add('fruit');
    fruit.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    fruit.style.top = `${Math.random() * (gameArea.clientHeight - 50)}px`;

    // フルーツをランダムに選ぶ
    const fruitTypes = ['🍎', '🍊', '🍌', '🍇', '🍓'];
    fruit.innerHTML = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

    gameArea.appendChild(fruit);

    // フルーツクリックで取得
    fruit.addEventListener('click', () => {
        fruit.style.transform = 'scale(0)';
        setTimeout(() => fruit.remove(), 200);
    });
}

// ゲーム開始イベント
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    gameLoop();
});

// ゲームループ
function gameLoop() {
    setInterval(createFruit, 1000); // 1秒ごとにフルーツ追加
}
