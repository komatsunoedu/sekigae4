let numbers = [];
let positions = [];
let running = false;
let currentSlot = 0; // 確定するスロットの位置
let interval = 1000; // 各スロットが止まる間隔
let nextStopTime = 0; // 次のスロットが止まる時間
let gridCols = 6; // 横の列数を固定
let gridRows; // 縦の行数を人数に応じて計算
let cellWidth = 120;
let cellHeight = 60;
let totalStudents = 24; // デフォルトの人数
let inputBox, startButton;
let soundEffect; // 効果音用の変数

function preload() {
  // 効果音を読み込む（適切な音声ファイルを用意）
  soundEffect = loadSound('happyou.mp3'); // ファイル名は適宜変更
}

function setup() {
  createCanvas(800, 700);
  textAlign(CENTER, CENTER);
  textSize(24);

  // 入力欄を作成
  inputBox = createInput(totalStudents.toString());
  inputBox.position(50, 20);
  inputBox.size(100);

  // スタートボタンを作成
  startButton = createButton("スタート");
  startButton.position(170, 20);
  startButton.mousePressed(startRandomization);

  setupSeats(); // 初期の座席レイアウトを設定
}

function setupSeats() {
  // 入力から人数を取得
  totalStudents = parseInt(inputBox.value());
  if (isNaN(totalStudents) || totalStudents <= 0) {
    totalStudents = 24; // デフォルト人数
  }

  // 配列の初期化
  numbers = [];
  positions = [];
  for (let i = 1; i <= totalStudents; i++) {
    numbers.push(i);
  }

  // 行数を計算
  gridRows = ceil(totalStudents / gridCols);

  // 座席位置を設定
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      if (numbers.length <= row * gridCols + col) break;
      positions.push({
        x: 50 + col * cellWidth,
        y: 150 + row * cellHeight
      });
    }
  }

  shuffle(numbers, true); // ランダム化した状態で始める
}

function draw() {
  background(240);

  // 黒板を表示
  fill(0, 100, 0);
  rect(50, 80, width - 100, 50);
  fill(255);
  text("黒板", width / 2, 105);

  // 座席を表示
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];
    fill(200);
    rect(pos.x, pos.y, cellWidth - 10, cellHeight - 10, 10);
    fill(0);
    if (running && i > currentSlot) {
      // ランダムな数字を表示（確定前）
      text(floor(random(1, totalStudents + 1)), pos.x + (cellWidth - 10) / 2, pos.y + (cellHeight - 10) / 2);
    } else {
      // 確定した数字を表示
      text(numbers[i], pos.x + (cellWidth - 10) / 2, pos.y + (cellHeight - 10) / 2);
    }
  }

  // スロットの確定処理
  if (running && millis() > nextStopTime) {
    if (currentSlot < numbers.length - 1) {
      if (soundEffect && soundEffect.isLoaded()) {
        soundEffect.play(); // 効果音を再生
      }
      currentSlot++;
      nextStopTime = millis() + interval; // 次のスロットを止める時間
    } else {
      running = false; // 全スロット確定後に終了
    }
  }
}

function startRandomization() {
  setupSeats(); // 座席を再配置
  running = true;
  currentSlot = 0; // 最初のスロットから開始
  nextStopTime = millis() + interval; // 最初のスロットを止める時間
}
