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

// パワーアップの種類
const POWERUP_TYPES = {
    MAGNET: {
        name: '招き猫',
        duration: 5000,
        image: 'magnet'
    },
    BALLOON: {
        name: '紙風船',
        duration: 4000,
        image: 'balloon'
    },
    DARUMA: {
        name: 'だるま',
        duration: 6000,
        image: 'daruma'
    },
    SANDALS: {
        name: '雲雀の草履',
        duration: 3000,
        image: 'sandals'
    }
};

// パワーアップクラス
class PowerUp {
    constructor(type, lane, y) {
        this.type = type;
        this.lane = lane;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.x = (lane * GAME_CONFIG.laneWidth) + (GAME_CONFIG.laneWidth / 2);
        this.collected = false;
        this.config = POWERUP_TYPES[type];
    }
    
    update() {
        this.y += speed;
        this.x = (this.lane * GAME_CONFIG.laneWidth) + (GAME_CONFIG.laneWidth / 2);
    }
    
    draw() {
        if (!this.collected) {
            if (IMAGES.items && IMAGES.items[this.config.image.toLowerCase()]) {
                ctx.drawImage(
                    IMAGES.items[this.config.image.toLowerCase()],
                    this.x - this.width / 2,
                    this.y - this.height,
                    this.width,
                    this.height
                );
            } else {
                // フォールバック描画
                ctx.fillStyle = '#9C27B0';
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFF';
                ctx.font = '12px Arial';
                ctx.fillText(this.config.name, this.x - this.width / 3, this.y - this.height / 4);
            }
        }
    }
}

