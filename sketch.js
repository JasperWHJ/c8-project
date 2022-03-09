var ninja, ninjaImg;
var enemy, enemyImg;
var gameOver, gameOverImg;
var goal;
var enemyGroup;
var state = "play";

function preload() {
  ninjaImg = loadImage("ninja.png");
  enemyImg = loadImage("enemy.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(400, 400);

  ninja = createSprite(50, 50);
  ninja.addImage(ninjaImg);
  ninja.scale = 0.3;
  //ninja.debug = true;
  ninja.setCollider("circle", 0, 0, 80)

  gameOver = createSprite(width / 2, height / 2, 40, 40);
  gameOver.addImage("gameover", gameOverImg);
  gameOver.visible = false;

  goal = createSprite(360, 360, 80, 80)
  goal.shapeColor = "green";
  goal.depth = ninja.depth - 1;

  enemyGroup = new Group();

  edges = createEdgeSprites();
  createEnemy();
}

function ninjaMovement() {
  if (keyDown("a")) {
    ninja.x += -3;
  } else if (keyDown("d")) {
    ninja.x += 3;
  } else if (keyDown("w")) {
    ninja.y += -3;
  } else if (keyDown("s")) {
    ninja.y += 3;
  }
}

function draw() {
  background("white");

  enemyGroup.bounceOff(edges);

  if(ninja.isTouching(goal)){
    enemyGroup.setLifetimeEach(-1);
    enemyGroup.setVelocityXEach(0);
    enemyGroup.setVelocityYEach(0);
    state = "win"
  }

  if (state == "play") {
    ninja.debug = false;
    ninjaMovement();
    createEnemy();
    if (ninja.isTouching(enemyGroup) || enemyGroup.isTouching(ninja)) {
      state = "end";
    }
  } else if (state == "end") {
    ninja.debug = true;
    enemyGroup.setLifetimeEach(-1);
    enemyGroup.setVelocityXEach(0);
    enemyGroup.setVelocityYEach(0);
    gameOver.depth = 100;
    gameOver.visible = true;
    setTimeout(function () {
      ninja.x = 50;
      ninja.y = 50;
      gameOver.visible = false;
      state = "play";
      enemyGroup.destroyEach();
    }, 5000)
  } else if(state == "win"){
    textSize(50);
    textAlign(CENTER);
    text("WELLDONE!", 200, 200)
    setTimeout(function () {
      ninja.x = 50;
      ninja.y = 50;
      gameOver.visible = false;
      state = "play";
      enemyGroup.destroyEach();
    }, 5000)
  }
  drawSprites();
}

function createEnemy() {
  if (frameCount % 10 == 0) {
    // enemy setup
    enemy = createSprite(600, 100, 40, 10);
    enemy.addImage(enemyImg);
    enemy.scale = 0.2;

    // enemy position
    enemy.y = Math.round(random(50, 350));
    enemy.x = Math.round(random(50, 350));
    enemy.depth = ninja.depth + 1;

    // enemy velocity
    var espeed = Math.round(random(1, 4));
    switch (espeed) {
      case 1: enemy.velocityY = 3;
        break;
      case 2: enemy.velocityX = 3;
        break;
      case 3: enemy.velocityY = 3;
        enemy.velocityX = -3;
        break;
      case 4: enemy.velocityY = -3;
        enemy.velocityX = 3;
        break;
    }
    enemy.lifetime = 160;
    enemyGroup.add(enemy);
  }
}
