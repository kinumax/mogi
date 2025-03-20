// DOM要素の取得
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.querySelector('.game-start-screen');
const playScreen = document.querySelector('.game-play-screen');
const startButton = document.getElementById('start-button');
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.querySelector('.progress');

// キャンバスのサイズ設定
canvas.width = 800;
canvas.height = 500;

// プレイヤークラス
class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = '#FF4081';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    }
}

// プレイヤー
let player = null;
let gameState = 1; // 1: スタート画面, 2: プレイ中

// ゲーム開始関数
function startGame() {
    console.log('ゲーム開始');
    gameState = 2;
    startScreen.style.display = 'none';
    playScreen.style.display = 'block';

    // プレイヤー初期化
    player = new Player(canvas.width / 2, canvas.height - 60, 40, 60);

    // ゲームループ開始
    requestAnimationFrame(render);
}

// 描画関数
function render() {
    if (gameState === 2) {
        // キャンバスのクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 地面の描画
        ctx.fillStyle = '#8BC34A';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        // プレイヤー描画
        if (player) {
            player.draw();
        }
    }
    requestAnimationFrame(render);
}

// ゲーム初期化
function init() {
    console.log('ゲーム初期化中...');
    loadImages().then(() => {
        console.log('画像の読み込み完了');
        loadingScreen.style.display = 'none';
        startScreen.style.display = 'flex';
    });
}

// 画像アセットの管理
const IMAGES = {};
const ASSET_PATHS = {
    player: {
        ninja: 'assets/player/ninja.png',
        samurai: 'assets/player/samurai.png'
    },
    background: {
        tokyo: 'assets/background/tokyo.png',
        fuji: 'assets/background/fuji.png'
    }
};

// 画像読み込み関数
function loadImages() {
    const promises = [];
    let loadedCount = 0;
    const totalImages = countTotalImages(ASSET_PATHS);

    function countTotalImages(obj) {
        let count = 0;
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                count += countTotalImages(obj[key]);
            } else {
                count++;
            }
        }
        return count;
    }

    function loadImageCategory(category, paths, target) {
        for (const key in paths) {
            if (typeof paths[key] === 'object') {
                target[key] = {};
                loadImageCategory(key, paths[key], target[key]);
            } else {
                const img = new Image();
                img.src = paths[key];
                img.onload = () => {
                    loadedCount++;
                    progressBar.style.width = `${(loadedCount / totalImages) * 100}%`;
                };
                target[key] = img;
                promises.push(new Promise(resolve => img.onload = resolve));
            }
        }
    }

    loadImageCategory('root', ASSET_PATHS, IMAGES);
    return Promise.all(promises);
}

// ゲーム開始ボタンクリック
startButton.addEventListener('click', startGame);

// 初期化実行
init();
