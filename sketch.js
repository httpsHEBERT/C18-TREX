var JOGANDO = 0;
var PARADO = 1;
var estado = JOGANDO;

var pontuacao = 0;

var morteS, puloS, placarS;

var trex, trexParado, trexCorrendo, trexBateu;

var solo, soloImg, soloInvisivel;

var nuvem, nuvemImg;

var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var perdeu, perdeuImg;
var reset, resetImg;

function preload(){
  
  morteS = loadSound("morte.mp3");
  puloS = loadSound("pulo.mp3");
  placarS = loadSound("placar.mp3");
  
  trexParado = loadImage("trex0.png");
  trexCorrendo = loadAnimation("trex1.png", "trex2.png");
  trexBateu = loadAnimation("trex3.png");
  
  soloImg = loadImage("solo.png");
  
  nuvemImg = loadImage("nuvem.png");
  
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");
  
  perdeuImg = loadImage("gameOver.png");
  resetImg = loadImage("reiniciar.png");
}

function setup(){
  
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(width-width+50, height-60, 50, 70);
  trex.addAnimation(trexParado);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("bateu", trexBateu);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);
  
  solo = createSprite(width/2, height-50, 50, 50);
  solo.addAnimation("infinito", soloImg);
  
  soloInvisivel = createSprite(width/2, height-30, width, 20);
  soloInvisivel.visible = false;
  
  grupoObstaculos = new Group();
  grupoNuvens = new Group();
  
  perdeu = createSprite(width/2, height/2-70);
  perdeu.addImage(perdeuImg);
  perdeu.scale = 0.7;
  
  reset = createSprite(width/2, height/2);
  reset.addImage(resetImg);
  reset.scale = 0.5;
}

function draw(){
  
  background("white");
  
  if(estado === JOGANDO){
    
    noCursor();
    
    solo.velocityX = -6;
    
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    if(pontuacao > 0 && pontuacao % 100 === 0){
      
      placarS.play();
    }
    
    soloInfinito();
    saltar();
    gerarNuvem();
    gerarObstaculos();
    
    if(trex.isTouching(grupoObstaculos)){
      
      morteS.play();
      estado = PARADO;
    }
    
    perdeu.visible = false;
    reset.visible = false;
    
  }else if(estado === PARADO){
    
    cursor();
    
    solo.velocityX = 0;
    trex.velocityY = 0;
    
    trex.changeAnimation("bateu", trexBateu);
    
    grupoNuvens.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    
    grupoObstaculos.setVelocityXEach(0);
    grupoObstaculos.setLifetimeEach(-1);
    
    perdeu.visible = true;
    reset.visible = true;
    
    resetar();
  }
  
  trex.collide(soloInvisivel);
  
  drawSprites();
  
  textSize(20);
  text(pontuacao, width-width+30, height-height+40);  
}

function soloInfinito(){
  
  if(solo.x < 0){
    solo.x = solo.width/2;
  }
}

function gerarNuvem(){
  
  var distancia = [Math.round(random(50, 90))];
  var escala = [0.2, 0.25, 0.3, 0.35, 0.4];
  
  if(frameCount % random(distancia) === 0){
    
    nuvem = createSprite(width+50, height-height+40);
    nuvem.y = Math.round(random(30, 100));
    nuvem.addImage("nuvens", nuvemImg);
    nuvem.scale = random(escala);
    nuvem.velocityX =  Math.round(random(-3, -1));
    nuvem.depth = trex.depth - 1;
    nuvem.lifetime = 700; 
    grupoNuvens.add(nuvem);
  }
}

function saltar(){
  
  if((touches.length > 0 || keyDown("space")) &&
      trex.y > height-62){
    
    puloS.play();
    trex.velocityY = -9;
    touches = [];
  }
  
  trex.velocityY = trex.velocityY + 0.5;
}

function gerarObstaculos(){
  
  if(frameCount % 45 === 0){
    
    var escolha = Math.round(random(1, 6));
    
    obstaculo = createSprite(width+50, height-60);
    obstaculo.velocityX = -6;
    obstaculo.scale = 0.6;
    obstaculo.depth = trex.depth - 1;
    obstaculo.lifetime = 300;
    grupoObstaculos.add(obstaculo);
    
    switch(escolha){
        
      case 1: obstaculo.addImage(obstaculo1);
      break;
      
      case 2: obstaculo.addImage(obstaculo2);
      break;
      
      case 3: obstaculo.addImage(obstaculo3);
      break;
      
      case 4: obstaculo.addImage(obstaculo4);
      break;
      
      case 5: obstaculo.addImage(obstaculo5);
      break;
      
      case 6: obstaculo.addImage(obstaculo6);
      break;
      default: break;
    }
  }
}

function resetar(){
  
  if(mouseIsOver(reset)){
    reset.scale = 0.6;
  }else{
    reset.scale = 0.5;
  }
  
  if(touches.length > 0 || mousePressedOver(reset)){
    
    estado = JOGANDO;
    
    reset.visible = false;
    perdeu.visible = false;
    grupoObstaculos.destroyEach();
    grupoNuvens.destroyEach();
    pontuacao = 0;
    trex.changeAnimation("correndo", trexCorrendo);
    touches = [];
  }
}