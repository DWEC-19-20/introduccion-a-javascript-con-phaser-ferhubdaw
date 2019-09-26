// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;
var veneno;
var estrella;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  veneno = game.add.physicsGroup();
  estrella = game.add.physicsGroup();
  createItem(530, 300, 'coin');
  createItem(580, 500, 'coin');
  createItem(220, 500, 'coin');
  createItem(370, 400, 'coin');
  createItem(660, 250, 'coin');
  createItem(570, 150, 'coin');
  createItem(120, 250, 'coin');
  createItem(250, 200, 'coin');
  createPoison(370, 500, 'poison');
  createPoison(375, 80, 'poison');
  createStar(175, 40, 'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(550, 200, 'platform2');
  platforms.create(100, 550, 'platform');
  platforms.create(450, 550, 'platform');
  platforms.create(300, 450, 'platform2');
  platforms.create(400, 350, 'platform2');
  platforms.create(70, 300, 'platform');
  platforms.create(650, 300, 'platform');
  platforms.create(180, 250, 'platform');
  platforms.create(275, 130, 'platform');
  platforms.create(130, 75, 'platform2');
  
 
  platforms.setAll('body.immovable', true);
}



// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

function createPoison(left, top, image) {
  var item = veneno.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}
function createStar(left, top, image) {
  var item = estrella.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  currentScore = currentScore + 10;
  if (currentScore === winningScore) {
      createBadge();
  }
}

function poisonHandler(player, veneno) {
  veneno.kill();
  currentScore = currentScore - 10;
  if (currentScore === winningScore) {
    createBadge();
}
}
function starHandler(player, estrella) {
  estrella.kill();
  currentScore = currentScore + 50;
  if (currentScore === winningScore) {
    createBadge();
}
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    
    //Load spritesheets
    game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, veneno, poisonHandler);
    game.physics.arcade.overlap(player, estrella, starHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {

  }

};
