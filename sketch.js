//declaring variables
var path, pathImg;
var player, palyerImg, playerCollided;

var bgImage;

var lavaBall, lavaBall_Img;
var energy, energyImg;
var bullet, bulletImg;

var lavaBallGroup, energyGroup, bulletGroup;

var fuelsLeft = 5;
var lavaBallsDestroyed = 0;

var sound1, sound2, sound3;

//gameStates-
var PLAY = 0;
var END = 1;
var gameState = 0;

//function to laod Images, Animations, Sounds, etc...
function preload(){
  //loading images
  pathImg  = loadImage("bg.jpg");
  palyerImg = loadImage("plane2.png");
  lavaBall_Img = loadImage("lava.png");
  energyImg = loadImage("energy.png");
  bulletImg = loadImage("bullet.png");
  bgImage = loadImage("BackgroundImg.png");
  playerCollided = loadImage("option2.jpg");
  //loading sound
  sound1 = loadSound("shoot.mp3");
  sound2 = loadSound("gameSound.mp3");
  sound3 = loadSound("lose.mp3");
}

//setup function -
function setup(){
  //canvas
  createCanvas(400, 500);

  //creating the path
  path = createSprite(200, 200);
  path.addImage(pathImg);
  path.scale = 1.3;
  path.velocityY = 4;

  //creating the player
  player = createSprite(200, 500, 50, 50);
  player.addImage(palyerImg);
  player.scale = 0.7;
  player.setCollider("circle", 20, 20, 60);

  //creating the bullet
  bullet = createSprite(200, 475);
  bullet.addImage(bulletImg);
  bullet.scale = 0.31;
  bullet.visible = false;

  //creating the groups -
  lavaBallGroup = new Group();
  energyGroup = new Group();
  bulletGroup = new Group();
  speedUpGroup = new Group();
}

//draw function -
function draw(){
  //background color
  background("orange");

  //gameState -
   if(gameState === PLAY){
     //making infinite path
    if(path.y > 300){
      path.y = height/2;
     }
   
     //giving movement to the player
     player.x = World.mouseX;
     bullet.x = player.x;
     
     //calling the functions -
  appearLavaBalls();
  appearEnergy();
  appearBullets();

  //game adptivity -
  if(lavaBallsDestroyed === 5){
    //increasing velocity -
    path.velocityY = 5;
    lavaBallGroup.setVelocityYEach(5);
    energyGroup.setVelocityYEach(5);
  }
  //game adptivity -
  else if(lavaBallsDestroyed === 10){
    //increasing velocity -
    path.velocityY = 6;
    lavaBallGroup.setVelocityYEach(6);
    energyGroup.setVelocityYEach(6);
  }

  //Touching functions -
  if (energyGroup.isTouching(player)) {
    //destroying energy 
    energyGroup.destroyEach();

    ///incrementing fuels left
    fuelsLeft = fuelsLeft + 1;

    //playing sound
    sound2.play();
  }
  else if(bulletGroup.isTouching(lavaBallGroup)){
    //destroying lava balls
    lavaBallGroup.destroyEach();
    //bullet y position
    bullet.y = -10;
    ///incrementing lava balls destroyed
    lavaBallsDestroyed += 1;
  }
  else if(keyWentDown("enter")){
    //decreasing fuels left
    fuelsLeft = fuelsLeft - 2;
  }
  else if (lavaBallGroup.isTouching(player)) {
  //changing gameState -
    gameState = END;

    //destroying and setting veocity as 0 -
    energyGroup.destroyEach();
    energyGroup.setVelocityYEach(0);
    lavaBallGroup.destroyEach();
    lavaBallGroup.setVelocityYEach(0);
    bulletGroup.destroyEach();
    bulletGroup.setVelocityYEach(0);

    path.velocityY = 0;
    //making path invisible
    path.visible = false;

    //adding background image
    background(bgImage);

    //changing player image
    player.addImage(playerCollided);
  } 
   }
   //gameState -
   else if(gameState === END){
     //showing texts
     fill("blue");
    text("You lost !! Try better next time.", 150, 200);
    text("To fly again with your jet press (CTRL + R) or refresh.", 50, 250);

    //drawing a line
   line(0, 35, 400, 35);

   //playing sound
   sound3.play();
  }
   
   //creating edges and colliding the player with it.
   edges = createEdgeSprites();
   player.collide(edges);

   //drawing everything
  drawSprites();

  //text styles-
  textSize(20);
  fill("white");
  textFont("Papyrus");
  text("Fuels Left is "+ fuelsLeft, 10, 20);
  text("|| Lava Balls Destroyed :- "+lavaBallsDestroyed, 145, 20);
}
//function to spawn lava balls -
function appearLavaBalls(){
  if(World.frameCount % 150 === 0){
  lavaBall = createSprite(Math.round(random(50, 350),40, 10, 10));
  lavaBall.velocityY = 4;
  lavaBall.lifetime = 150;
  lavaBall.addImage(lavaBall_Img);
  lavaBall.scale = 0.31;

  lavaBallGroup.add(lavaBall);
  }
}

//function to spawn energy -
function appearEnergy(){
  if(World.frameCount % 200 === 0){
  energy = createSprite(Math.round(random(20, 300),40, 10, 10));
  energy.velocityY = 4;
  energy.lifetime = 150;
  energy.addImage(energyImg);
  energy.scale = 0.31;
  
  energyGroup.add(energy);
  }
}

//function to spawn bullets -
function appearBullets(){
  if(keyDown("enter")){
  bullet.velocityY = -4;
  bullet.visible = true;
  //playing sound
  sound1.play();
 }

 if(bullet.y < 0){
   bullet.y = player.y + 25;
   bullet.x = player.x + 50;
   bullet.velocityY = 0;
   bullet.visible = false;
 }

 bulletGroup.add(bullet);
}
