//display the following message in the "startGame" element
var id = document.getElementById("startGame");
id.innerHTML = "Regi Shehi" + "<br/>" + "INF275a Project" + "<br/>" + "Press left/right arrows to move the object" + "<button class = \"button1\" id=\"btn1\" onclick=\"game()\">Start Game</button>";

//main function of the game
function game()
{
	//define ID for different elements used to make the game
	var but1 = document.getElementById("btn1");
	var id1 = document.getElementById("endGame");

	but1.style.display = "none";
	id.style.display = "none";
	id1.style.display = "none";

	//define canvas and its properties
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = 500;
	canvas.height = 600;

	//variable to check if the canvas sides are touched or not
	var already_touched = true;
		 
	var playsound = document.getElementById("collide");
	var endsound = document.getElementById("end");
	var count = 0;
	var touchright = false;
	var touchleft = true;

	//object definition for user controlled block
	var mySprite = {
		x: 0,
		y: 550,
		width: 50,
		height: 50,
		speed: 200,
		color: 'red'
	};
	
	//object Sprites defines all the other square falling objects and its properties 	
	var Sprites = {
		mySprite1: {
			x: Math.floor(0 + (1+450-0)*Math.random()),
			y: 35,
			width: 50,
			height: 50,
			speed: 200,
			color: 'blue'
		},

		mySprite2: {
			x: Math.floor(0 + (1+460-0)*Math.random()),
			y: 35,
			width: 40,
			height: 40,
			speed: 100,
			color: 'green'
		},
			 
		mySprite3: {
			x: Math.floor(0 + (1+480-0)*Math.random()),
			y: 35,
			width: 20,
			height: 20,
			speed: 120,
			color: 'yellow'
		},
		
		mySprite4: {
			x: Math.floor(0 + (1+420-0)*Math.random()),
			y: 35,
			width: 80,
			height: 80,
			speed: 220,
			color: 'purple'
		}
	};
	
	//circle falling object
	var ball = {
			x: Math.floor(0 + (1+475-0)*Math.random()),
			y: 50,
			r: 25,
			width: 20,
			height: 20,
			c: "red",
			speed: 150,
			draw: function()
			{
				ctx.beginPath();
				ctx.fillStyle = this.c;
				ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
				ctx.fill();
			}
		};
	
	//object that draws the white line that separates the score from the rest of the canvas
	var line = {
		draw: function()
		{
			ctx.beginPath();
			ctx.moveTo(0, 35);
			ctx.lineTo(500, 35);
			ctx.lineWidth = 5;

			// set line color
			ctx.strokeStyle = '#ff0000';
			ctx.stroke();
		}
	};

	//function to draw canvas
	function paintCanvas()
	{
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,500,600);
	}

	//function to draw user controlled object
	function player()
	{
		ctx.fillStyle = mySprite.color;
		ctx.fillRect(mySprite.x, mySprite.y, mySprite.width, mySprite.height);
	}
	
	//function to draw the falling objects
	function fallingObjects()
	{
		ctx.fillStyle = Sprites[index].color;
		ctx.fillRect(Sprites[index].x, Sprites[index].y, Sprites[index].width, Sprites[index].height);
		ball.draw();
	}

	//definition for event listener
	var keysDown = {};
	window.addEventListener('keydown', function (e)
	{
		keysDown[e.keyCode] = true;
	});

	window.addEventListener('keyup', function (e)
	{
		delete keysDown[e.keyCode];
	});

	//function to recognize the key pressed and update score each time the moving block makes a full trip from side to side
	function update(mod)
	{
		if (37 in keysDown)
		{
			mySprite.x -= mySprite.speed * mod;
			if(mySprite.x<0)
			mySprite.x = 0;
			
			if(mySprite.x == 0 && !touchleft)
			{		
				count+=10; 
				var alert1 = document.getElementById("score");
				
				updateScore();
				touchright=false;
				touchleft=true;		
			}			
		}
		
		if (39 in keysDown)
		{
			mySprite.x += mySprite.speed * mod;
			if(mySprite.x>450)
			mySprite.x = 450;
			
			if(mySprite.x == 450 && !touchright)
			{		
				count+=10; 
				var alert1 = document.getElementById("score");
				
				updateScore();
				touchright=true;
				touchleft=false;		
			}
		}
	}
	
	//function to make the falling objects fall vertically
	function update1(mod)
	{
		for (index in Sprites)
		{
			if (Sprites.hasOwnProperty(index))
			{
				Sprites[index].y += Sprites[index].speed * mod;
			}
		}
		
		ball.y += ball.speed * mod;
	}

	//function that updates score each time a full trip is made
	function updateScore()
	{
		ctx.fillStyle = "white";
		ctx.font = "16px Arial, sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Score: " + count, 10, 10 );
		
		line.draw();
	}
			 
	//main function to draw the canvas and every element in it
	function render()
	{
		playsound.play();
			
		//canvas		 
		paintCanvas();	

		//moving red object
		player();
		updateScore();
					 
		//falling objects
		for (index in Sprites)
		{
			fallingObjects();			
				 
			if (Sprites[index].y > 600) //Repeat the object when it falls out of view
			{ 			
				Sprites[index].y = 30; //Account for the image size
				Sprites[index].x = Math.floor(0 + (1+420-0)*Math.random()); //Make it appear randomly along the width  
			}
			
			//if condition to detect collision for falling rectangle objects
			if (Sprites[index].x < mySprite.x + mySprite.width && Sprites[index].x + Sprites[index].width > mySprite.x && Sprites[index].y < mySprite.y + mySprite.height && Sprites[index].y + Sprites[index].height > mySprite.y)
			{
				playsound.pause();		
				clearInterval(collision);	
				id1.style.display = "block";	
				id1.innerHTML = "Game Over" + "<br/>" + "You scored " + count + " points" + "<button class = \"button2\" id=\"btn2\" onclick=\"refresh()\">Replay</button>" 
				+ "<button class = \"button3\" id=\"btn2\" onclick=\"closeWin()\">Close</button>" 
				endsound.play();
			}
			
			if (ball.y > 600) //Repeat the object when it falls out of view
			{ 			
				ball.y = 50; //Account for the image size
				ball.x = Math.floor(0 + (1+475-0)*Math.random()); //Make it appear randomly along the width  
			}
			
			//if condition to detect collision for falling circle object
			if (ball.x < mySprite.x + mySprite.width && ball.x + ball.width > mySprite.x && ball.y < mySprite.y + mySprite.height && ball.y + ball.height > mySprite.y)
			{
				playsound.pause();		
				clearInterval(collision);	
				id1.style.display = "block";	
				id1.innerHTML = "Game Over" + "<br/>" + "You scored " + count + " points" + "<button class = \"button2\" id=\"btn2\" onclick=\"refresh()\">Replay</button>" 
				+ "<button class = \"button3\" id=\"btn2\" onclick=\"closeWin()\">Close</button>" 	 
				endsound.play();
			}
		}
	}

	//run the game at the given time
	function run()
	{
		update(0.01);
		update1(0.01);
		render();
	}

	var collision = setInterval(run, 10);
}

//function to start e new game
function refresh()
{
	window.location.reload();
}

//function to end game
function closeWin()
{
	window.close();                                            
}