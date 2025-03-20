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

// ゲーム状態に変数を追加
let powerups = [];
let activePowerups = [];

// パワーアップの生成
function generatePowerups() {
    // 一定確率でパワーアップを生成
    if (Math.random() < 0.01) { // 1%の確率
        const lane = Math.floor(Math.random() * GAME_CONFIG.lanes);
        const typeKeys = Object.keys(POWERUP_TYPES);
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const powerup = new PowerUp(randomType, lane, -50);
        powerups.push(powerup);
    }
}

// update関数にパワーアップの処理を追加
function update(deltaTime) {
    // 既存のコード...
    
    // パワーアップの生成
    generatePowerups();
    
    // パワーアップの更新
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        powerup.update();
        
        // 画面外に出たパワーアップの削除
        if (powerup.y > canvas.height) {
            powerups.splice(i, 1);
            continue;
        }
        
        // パワーアップ収集判定
        if (!powerup.collected && checkCollision(player, powerup)) {
            powerup.collected = true;
            
            // パワーアップ効果の適用
            activePowerups.push({
                type: powerup.type,
                endTime: performance.now() + powerup.config.duration
            });
            
            // 効果の開始を表示
            showPowerupEffect(powerup.config.name);
            
            // パワーアップを削除
            powerups.splice(i, 1);
        }
    }
    
    // アクティブなパワーアップの効果を適用
    applyPowerupEffects(deltaTime);
    
    // 期限切れのパワーアップを削除
    for (let i = activePowerups.length - 1; i >= 0; i--) {
        if (performance.now() > activePowerups[i].endTime) {
            // 効果の終了を表示
            showPowerupEndEffect(POWERUP_TYPES[activePowerups[i].type].name);
            activePowerups.splice(i, 1);
        }
    }
}

// パワーアップ効果の適用
function applyPowerupEffects(deltaTime) {
    for (const powerup of activePowerups) {
        switch (powerup.type) {
            case 'MAGNET':
                // コインを引き寄せる効果
                for (const coin of coinItems) {
                    const dx = player.x - coin.x;
                    const dy = player.y - coin.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 200) {
                        coin.x += dx * 0.05;
                        coin.y += dy * 0.05;
                    }
                }
                break;
                
            case 'BALLOON':
                // 浮遊効果（障害物を回避）
                player.isFloating = true;
                break;
                
            case 'DARUMA':
                // 無敵効果
                player.isInvincible = true;
                break;
                
            case 'SANDALS':
                // スピードアップ効果
                speed = Math.min(speed * 1.5, GAME_CONFIG.maxSpeed * 1.5);
                break;
        }
    }
    
    // パワーアップがない場合、効果をリセット
    if (!activePowerups.some(p => p.type === 'BALLOON')) {
        player.isFloating = false;
    }
    if (!activePowerups.some(p => p.type === 'DARUMA')) {
        player.isInvincible = false;
    }
}

// パワーアップ効果の表示
function showPowerupEffect(name) {
    const effectDiv = document.createElement('div');
    effectDiv.className = 'powerup-effect';
    effectDiv.textContent = `${name} 発動!`;
    document.body.appendChild(effectDiv);
    
    setTimeout(() => {
        effectDiv.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(effectDiv);
        }, 1000);
    }, 2000);
}

// パワーアップ効果終了の表示
function showPowerupEndEffect(name) {
    const effectDiv = document.createElement('div');
    effectDiv.className = 'powerup-end-effect';
    effectDiv.textContent = `${name} 終了`;
    document.body.appendChild(effectDiv);
    
    setTimeout(() => {
        effectDiv.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(effectDiv);
        }, 1000);
    }, 1000);
}

// 衝突判定に無敵状態のチェックを追加
if (checkCollision(player, obstacle)) {
    // 無敵状態または浮遊状態なら衝突しない
    if (player.isInvincible || (player.isFloating && obstacle.y < player.y)) {
        continue;
    }
    
    gameOver();
    return;
}

// レベル定義
const LEVELS = [
    {
        name: '東京',
        distance: 0,
        background: 'tokyo',
        obstacleFrequency: 0.02,
        coinFrequency: 0.05,
        powerupFrequency: 0.01,
        speedMultiplier: 1.0
    },
    {
        name: '京都',
        distance: 1000,
        background: 'kyoto',
        obstacleFrequency: 0.025,
        coinFrequency: 0.06,
        powerupFrequency: 0.012,
        speedMultiplier: 1.1
    },
    {
        name: '大阪',
        distance: 2000,
        background: 'osaka',
        obstacleFrequency: 0.03,
        coinFrequency: 0.07,
        powerupFrequency: 0.015,
        speedMultiplier: 1.2
    },
    {
        name: '富士山',
        distance: 3000,
        background: 'fuji',
        obstacleFrequency: 0.035,
        coinFrequency: 0.08,
        powerupFrequency: 0.02,
        speedMultiplier: 1.3
    }
];

// 現在のレベル
let currentLevel = 0;
let levelChanged = false;

// レベルの更新
function updateLevel() {
    const newLevel = LEVELS.findIndex((level, index, array) => {
        return distance >= level.distance && 
              (index === array.length - 1 || distance < array[index + 1].distance);
    });
    
    if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        levelChanged = true;
        showLevelChangeEffect(LEVELS[currentLevel].name);
        return true;
    }
    
    return false;
}

// レベル変更エフェクトの表示
function showLevelChangeEffect(levelName) {
    const effectDiv = document.createElement('div');
    effectDiv.className = 'level-change-effect';
    effectDiv.innerHTML = `<h2>${levelName}</h2><p>に到着しました！</p>`;
    document.body.appendChild(effectDiv);
    
    setTimeout(() => {
        effectDiv.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(effectDiv);
        }, 1000);
    }, 2000);
}
