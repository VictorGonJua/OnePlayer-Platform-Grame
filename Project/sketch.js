var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var treePos_y;
var clouds;
var mountains_x;
var collectables;
var canyon;

var game_score;

var flagpole;

var lives;

var jumpSound;
var coinSound;
var fallingSound;
var gamewinSound;
var gameoverSound;
var platforms;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(0.1);
    fallingSound = loadSound('assets/falling.wav');
    fallingSound.setVolume(0.1);
    gameoverSound = loadSound('assets/gameover.wav');
    gameoverSound.setVolume(0.008);
    gamewinSound = loadSound('assets/gamewin.wav');
    gamewinSound.setVolume(0.008);
}

function setup()
{
    startGame();
    lives = 3;
}

function draw()
{    
if(lives == 0)
    {
        gameOver();
    }
else
{
    checkPlayerDies();
    
    //SKY & FLOOR
    noStroke();
    fill(176,196,222)
    rect(0,0,width,floorPos_y*0.33)
    fill(173,216,230)
    rect(0,floorPos_y*0.33,width,floorPos_y*0.33)
    fill(176,224,230)
    rect(0,floorPos_y*0.66,width,floorPos_y*0.34)
    fill(0,100,0)
    rect(0, floorPos_y, width, height - floorPos_y);
             
    push();
    translate(scrollPos,0);
    drawClouds();
    drawMountains();
    drawTrees();
    
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }

    for(var i = 0; i < canyon.length;i++)
        {
            drawCanyon(canyon[i]);
            checkCanyon(canyon[i]);
                if(canyon[i].CharInCanyon == true && gameChar_y >= floorPos_y-45)
                    {
                        gameChar_y += 4;
                        isFalling = true;
                        isLeft = false;
                        isRight = false;
                        if(gameChar_y < floorPos_y +1)
                            {
                                fallingSound.play();
                            }
                    }
        }

    for(var i = 0; i < collectables.length;i++)
        {
            if(collectables[i].isFound == false)
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
            }
        }
    
    render_flagpole();
    
    pop();
	
	drawGameChar();
    
    fill(47,79,79);
    noStroke();
    textSize(20);
    textAlign();
    textStyle();
    textAlign(LEFT);
    text("Collected stars: " + game_score, 20, 60);
    text("Remaining lives: " + lives, 20, 30);

	// Make character move
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if(isPlummeting == true && gameChar_y == floorPos_y-45)
        {
            gameChar_y = floorPos_y-175;
            jumpSound.play();
        }
    else if(gameChar_y < floorPos_y-45)
        {
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_x - scrollPos,gameChar_y) == true)
                        {
                            isContact = true;
                            isFalling = false;
                            if(isPlummeting == true)
                                {
                                    jumpSound.play();
                                    gameChar_y = platforms[i].y - 145;
                                }
                            break;
                        }
                }
            if(isContact == false)
                {
                    gameChar_y += 2;
                    isFalling = true;                    
                }
        }
    else
        {
            isFalling = false;
        }
    if(flagpole.isReached == false)
        {
            checkFlagpole();            
        }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}
}

// Key control functions

function keyPressed(){    
    if(keyCode == 37)
        {
        //console.log("left arrow");
        isLeft = true;
        }
    else if(keyCode == 39)
        {
        //console.log("right arrow");
        isRight = true;
        }
    else if(keyCode == 32)
        {
        //console.log("space bar");
        isPlummeting = true;
        }

}

function keyReleased()
{
	//console.log("keyReleased: " + key);
	//console.log("keyReleased: " + keyCode);   
    if(keyCode == 37)
        {
        //console.log("left arrow");
        isLeft = false;
        }
    else if(keyCode == 39)
        {
        //console.log("right arrow");
        isRight = false;
        }
    else if(keyCode == 32)
        {
        //console.log("space bar");
        isPlummeting = false;
        }

}

// Function to draw the game character.
function drawGameChar()
{
    if(isLeft && isFalling)
	{
            position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79); triangle(position.x+3,position.y+40,position.x+5,position.y+45,position.x-6,position.y+50);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x-12,position.y+10);
            vertex(position.x-6,position.y+20);
            vertex(position.x-3,position.y+15);
            endShape();
    }
    
	else if(isRight && isFalling)
	{
		    position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79);
            triangle(position.x-3,position.y+40,position.x+5,position.y+50,position.x-5,position.y+45);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x+12,position.y+10);
            vertex(position.x+6,position.y+20);
            vertex(position.x+3,position.y+15);
            endShape();

	}
	else if(isLeft)
	{
            position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79); triangle(position.x+3,position.y+40,position.x+5,position.y+45,position.x-8,position.y+45);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x-12,position.y+25);
            vertex(position.x-3,position.y+20);
            vertex(position.x-3,position.y+15);
            endShape();
	}
	else if(isRight)
	{
             position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79);
            triangle(position.x-3,position.y+40,position.x+7,position.y+45,position.x-5,position.y+45);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x+12,position.y+25);
            vertex(position.x+3,position.y+20);
            vertex(position.x+3,position.y+15);
            endShape();
            }
	
    else if(isFalling || isPlummeting)
	{
            position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79);
            triangle(position.x-3,position.y+40,position.x-1,position.y+45,position.x-5,position.y+50);
            triangle(position.x+3,position.y+40,position.x+5,position.y+50,position.x+1,position.y+45);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x-12,position.y+10);
            vertex(position.x-6,position.y+15);
            vertex(position.x-3,position.y+15);
            endShape();
            beginShape();
            vertex(position.x+12,position.y+10);
            vertex(position.x+6,position.y+15);
            vertex(position.x+3,position.y+15);
            endShape();
	}
	else
	{
		// add your standing front facing code
            //variable - only first time
    
            var position;
            position={x:gameChar_x,y:gameChar_y};
            //body
            fill(139,0,0)
            triangle(position.x,position.y,position.x-8,position.y+40,position.x+8,position.y+40)
            //face
            fill(255,160,122);
            ellipse(position.x,position.y-5,7,20);
            //feet
            fill(47,79,79);
            triangle(position.x-3,position.y+40,position.x-1,position.y+45,position.x-5,position.y+45);
            triangle(position.x+3,position.y+40,position.x+5,position.y+45,position.x+1,position.y+45);
            //arms
            strokeWeight(1);
            stroke(120);
            noFill();
            beginShape();
            vertex(position.x-12,position.y+20);
            vertex(position.x-6,position.y+15);
            vertex(position.x-3,position.y+15);
            endShape();
            beginShape();
            vertex(position.x+12,position.y+20);
            vertex(position.x+6,position.y+15);
            vertex(position.x+3,position.y+15);
            endShape();
        }
}

// Background render functions
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        noStroke();
        fill(220);
        ellipse(clouds[i].x+50,clouds[i].y,60,60);
        ellipse(clouds[i].x+20,clouds[i].y,40,40);
        ellipse(clouds[i].x+80,clouds[i].y,40,40);
        ellipse(clouds[i].x,clouds[i].y,20,20);
        ellipse(clouds[i].x+100,clouds[i].y,20,20);
        noStroke();
    } 
}

function drawMountains()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(102,205,170)
        arc(mountains_x[i], floorPos_y, 400, 300, PI, TWO_PI, CHORD);
        arc(mountains_x[i]+125, floorPos_y, 400, 400, PI, TWO_PI, CHORD);
    }   
}

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(105,105,105)
        rect(trees_x[i],treePos_y,10,-50)
        fill(189,183,107)
        triangle(trees_x[i]-25,treePos_y-20,trees_x[i]+35,treePos_y-20,trees_x[i]+5,treePos_y-60)
        fill(189,183,107)
        triangle(trees_x[i]-15,treePos_y-40,trees_x[i]+25,treePos_y-40,trees_x[i]+5,treePos_y-80)
    }
}

// Canyon render and check functions
function drawCanyon(t_canyon)
{
    noStroke();
    fill(102,205,170)
    beginShape();
    vertex(t_canyon.x_pos,floorPos_y);
    vertex(t_canyon.x_pos,floorPos_y+(height-floorPos_y));
    vertex(t_canyon.x_pos+40,floorPos_y+(height-floorPos_y));
    vertex(t_canyon.x_pos+40,floorPos_y);
    endShape(CLOSE);
    fill(65,105,225);
    rect(t_canyon.x_pos,floorPos_y+t_canyon.depth,40,(height-floorPos_y-t_canyon.depth));
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(t_canyon.x_pos+3 < gameChar_world_x && gameChar_world_x < t_canyon.x_pos + 37)
        {
            t_canyon.CharInCanyon = true;
        }
    else
        {
            t_canyon.CharInCanyon = false;
        }
}

// Function to draw collectable objects.
function drawCollectable(t_collectable)
    {
        fill(0,255,0);
        triangle(t_collectable.x_pos,t_collectable.y_pos-25,t_collectable.x_pos-7.5,t_collectable.y_pos-15,t_collectable.x_pos+7.5,t_collectable.y_pos-15);
        triangle(t_collectable.x_pos,t_collectable.y_pos-12.5,t_collectable.x_pos-7.5,t_collectable.y_pos-22.5,t_collectable.x_pos+7.5,t_collectable.y_pos-22.5);   
    }

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{   
    if(dist(t_collectable.x_pos,t_collectable.y_pos-45, gameChar_world_x, gameChar_y) < 20)
        {
            t_collectable.isFound = true;
            game_score += 1;
            coinSound.play();
        }
    else 
        {
            t_collectable.isFound == false;
        }
}

// Functions to create & check flagpole
function render_flagpole()
{
    push();
    strokeWeight(1);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 100);
    if(flagpole.isReached)
        {
            fill(211,211,211);
            rect(flagpole.x_pos, floorPos_y - 100,33,33);
            noStroke();
            fill(0,128,0);
            triangle(flagpole.x_pos+17,floorPos_y-65-25,flagpole.x_pos+17-7.5,floorPos_y-65-15,flagpole.x_pos+17+7.5,floorPos_y-65-15);
            triangle(flagpole.x_pos+17,floorPos_y-65-12.5,flagpole.x_pos+17-7.5,floorPos_y-65-22.5,flagpole.x_pos+17+7.5,floorPos_y-65-22.5); 
            gameWin();
        }
    else
        {
            fill(211,211,211);
            rect(flagpole.x_pos, floorPos_y - 33,33,33);
            noStroke();
            fill(128,0,0);
            triangle(flagpole.x_pos+17,floorPos_y-65+67-25,flagpole.x_pos+17-7.5,floorPos_y-65+67-15,flagpole.x_pos+17+7.5,floorPos_y-65+67-15);
            triangle(flagpole.x_pos+17,floorPos_y-65+67-12.5,flagpole.x_pos+17-7.5,floorPos_y-65+67-22.5,flagpole.x_pos+17+7.5,floorPos_y-65+67-22.5);
        }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
        {
            flagpole.isReached = true;
        }
}

// Functions to re-start & end game

function checkPlayerDies()
{
    if(gameChar_y > height+50)
        {
            if(lives == 1)
                {
                    lives = 0;
                    gameOver();
                }
            else if(lives >= 2)
                {
                    lives -= 1;
                    startGame();
                }
        }
}

function startGame()
{
	createCanvas(1024, 576);
	floorPos_y = height * (3/4);
	gameChar_x = 120;
	gameChar_y = floorPos_y-45;
	// Variable to control the background scrolling.
	scrollPos = 0;
	// Variable to store the real position of the gameChar in the game
	gameChar_world_x = gameChar_x - scrollPos;
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	// Arrays of scenery objects.
    trees_x = [-88,-75,100,300,650,710,900,1400,1030,1100];
    treePos_y = floorPos_y;
    clouds = [
        {x: -750,y: 125},
        {x: -250,y: 150},
        {x: -150,y: 100},
        {x: 150,y: 100},
        {x: 250,y: 150},
        {x: 800,y: 125},
        {x: 1100,y: 125},
        {x: 1250,y: 100},
        {x: 1450,y: 150}
        ];
    mountains_x = [-550,150,300,1000,1500,1550];
    collectables= [
        {x_pos:200,y_pos:floorPos_y+5,isFound:false},
        {x_pos:400,y_pos:floorPos_y+5,isFound:false},
        {x_pos:600,y_pos:floorPos_y+5,isFound:false},
        {x_pos:1000,y_pos:floorPos_y+5,isFound:false},
        {x_pos:-50,y_pos:floorPos_y+5,isFound:false},
        {x_pos:-100,y_pos:floorPos_y+5,isFound:false},
        {x_pos:1200,y_pos:floorPos_y+5,isFound:false}
        ];
    canyon=[
        {x_pos:-350,depth:100,CharInCanyon:false},
        {x_pos:350,depth:60,CharInCanyon:false},
        {x_pos:750,depth:30,CharInCanyon:false},
        {x_pos:1050,depth:50,CharInCanyon:false}
        ];
    platforms = [];
    
    platforms.push(createPlatform(400,350,100));
    platforms.push(createPlatform(600,350,100));
    
    game_score = 0;
    flagpole = {isReached: false, x_pos: 1600};
}       

function createPlatform(x,y,length)
    {
        var p = 
            {
                x: x,
                y: y,
                length: length,
                draw: function()
                        {
                            fill(0,100,0);
                            rect(this.x,this.y,this.length, 15);
                        },
                checkContact: function(gc_x,gc_y)
                        {
                            if(gc_x > this.x && gc_x < (this.x + this.length))
                                {
                                    var d = this.y - gc_y - 42;
                                    console.log("d "+d);
                                    console.log("this.y "+y);
                                    console.log("gc_y "+gc_y);
                                    console.log("floorPos_y "+floorPos_y);
                                    if( d >= 0 && d < 5)
                                        {
                                            return true;
                                        }
                                }
                            return false;
                        }
            }
        return p;
    }  

function gameOver()
{
    textSize(30);
    textAlign(CENTER);
    fill(0,100,0);
    text("You died my friend :(",width/2 - scrollPos,height/2-10);
    text("Press Intro to play again",width/2 - scrollPos,height/2+30);
    gameoverSound.play();
        if(keyCode == 13)
        {
        startGame();
        lives = 3;
        }
}

function gameWin()
{
    textSize(30);
    textAlign(CENTER);
    fill(0,100,0);
    text("The victory is yours my friend :)",width/2 - scrollPos,height/2-10);
    text("Press Intro to play again",width/2 - scrollPos,height/2+30);
    isFalling = true;
    isLeft = false;
    isRight = false;
    gamewinSound.play();
        if(keyCode == 13)
        {
        startGame();
        lives = 3;
        }
}
