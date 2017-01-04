var p1Score = 0;
var p2Score = 0;

function startGame(){
	myGameArea.start();
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	p1 : new Component(10, 100, "red", 10, 0),
	p2 : new Component(10, 100, "blue", 460, 0),
	ball : new Component(10, 10, "black", 240, 135),
	start : function() {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
		this.clear();
		this.context.fillText(p1Score + " | " + p2Score, 230,30);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		//call into update loop every 20 ms
		this.interval = setInterval(update, 20);
		//adding event listeners for keyboard controls;
		window.addEventListener('keydown', function(e) {
			myGameArea.key = e.keyCode;
		});
		window.addEventListener('keyup', function(e) {
			myGameArea.key = false;
		});
		var neg = Math.random();
		this.ball.speedX = Math.random() * 3.5 + 1.5;
		this.ball.speedY = Math.random() * 3.5 + 1.5;
		if (neg < 0.5) {
			this.ball.speedX *= -1;
		}
		else {
			this.ball.speedY *= -1;
		}
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	point : function() {
		this.ball.speedX = Math.random() * 3.5 + 1.5;
		this.ball.speedY = Math.random() * 3.5 + 1.5;
		var neg = Math.random();
		if (neg < 0.5) {
			this.ball.speedX *= -1;
		}
		else {
			this.ball.speedY *= -1;
		}
	}
	
}


//Component drawing/positioning ctor
function Component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect (this.x, this.y, this.width, this.height);

	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.collisionXY = function(other) {
		var left = this.x;
		var right = this.x + this.width;
		var tp = this.y;
		var bot = this.y + this.height;
	        var otherTop = other.y;
		var otherBot = other.y + other.height;	
		var otherLeft = other.x;
		var otherRight = other.x + other.width;
		if (tp > otherTop && bot < otherBot) { 
			if (left < otherRight  && other === myGameArea.p1) {
				return true;		
			}
			else if (right > otherLeft && other === myGameArea.p2) {
				return true;
			}
			else { 
				return false;
			}
		}
		else {
			return false;
		}
	}
	//handle collisions w/ game area's top and bottom side.
	this.collisionGameArea = function() {
		var compTop = this.y;
		var compBot = this.y + this.height;
		var gameAreaTop = 0;
		var gameAreaBot = myGameArea.canvas.height;
		if (compTop < gameAreaTop) {
			this.y = 0;
			this.speedY *= -1
		}
		if(compBot > gameAreaBot) {
			this.y = gameAreaBot - this.height;
			this.speedY *= -1;
		}
	}
}

function scoreCondition() {
	if (myGameArea.ball.x < 0) {
		p2Score++;
		delete myGameArea.ball;
		myGameArea.ball =  new Component(10, 10, "black", 240, 135)
		myGameArea.point();	
			
	}
	else if (myGameArea.ball.x > myGameArea.canvas.width) {
		p1Score++;
		delete myGameArea.ball;
		myGameArea.ball =  new Component(10, 10, "black", 240, 135)
		myGameArea.point();	
	}
}
	
	
//update loop
function update() {
	myGameArea.clear();
	myGameArea.ball.update();
	//gotta reset speed so that we stop moving when keys aren't pressed;
	myGameArea.p1.speedY = 0;
	if (myGameArea.key && myGameArea.key == 38) {
		myGameArea.p1.speedY = -3;
	}
	if (myGameArea.key && myGameArea.key == 40) {
		myGameArea.p1.speedY = 3;
	}
	myGameArea.p1.update();	
	myGameArea.p2.update();
	myGameArea.p1.newPos();
	myGameArea.ball.update();
	myGameArea.ball.newPos();

	if (myGameArea.ball.collisionXY(myGameArea.p1) || myGameArea.ball.collisionXY(myGameArea.p2)) {
		myGameArea.ball.speedX *= -1;
	}
	myGameArea.p1.collisionGameArea();
	myGameArea.p2.collisionGameArea();	
	myGameArea.ball.collisionGameArea();
	scoreCondition();
	myGameArea.context.fillText(p1Score + " | " + p2Score, 230,30)
}



