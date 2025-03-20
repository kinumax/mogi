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

// プレイヤーの描画関数を修正
Player.prototype.draw = function() {
    if (IMAGES.player && IMAGES.player.ninja) {
        // 画像を使用して描画
        ctx.drawImage(
            IMAGES.player.ninja,
            this.x - this.width / 2,
            this.y - this.height,
            this.width,
            this.height
        );
    } else {
        // フォールバック（画像がない場合）
        ctx.fillStyle = '#FF4081';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    }
};

// 障害物の描画関数を修正
Obstacle.prototype.draw = function() {
    if (IMAGES.obstacles && IMAGES.obstacles.torii) {
        ctx.drawImage(
            IMAGES.obstacles.torii,
            this.x - this.width / 2,
            this.y - this.height,
            this.width,
            this.height
        );
    } else {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    }
};
