//Here's the source code for a very simple zombie game. It's not finished yet, of course.
//Current version - 10-18-2025

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const spawnedZombies = []
const spawnedBullets = []
var zombieInterval = 0
var zombieKills = 0
var zombieSpawnLoc = 0
var globalBulletHit = 0

//Player
var player = new function() {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.dx = 0
    this.dy = 0
    this.speed = 2
	this.dead = 0
    this.direction = 1
	this.firing = 0
	this.fireRate = 0
	this.weapon = 3
	this.customIcon = new Image
    //Draws the sprite.
    this.draw = function() {
		ctx.fillStyle = "white"
		if (this.dead == 0) {
			//The player sprite :0
		    ctx.fillText("🚶", this.x, this.y, 24)
			//Anything UI related.
			ctx.fillText(String(zombieKills), 12, 25)
			if (this.weapon == 1) {
			    ctx.fillText("🔫", 425, 335)
			} else if (this.weapon == 2) {
			    ctx.fillText("🏹", 425, 335)
		    } else {
				ctx.drawImage(this.customIcon, 405, 300, 48, 48)
				this.customIcon.src = "ak.png"
			}
		} else {
			ctx.fillText("GAME OVER", 12, 25)
			ctx.fillText("You killed " + String(zombieKills) + " zombies.", 12, 50)
		}
    }
	this.fire = function () {
		if (this.firing == 1 && this.fireRate < 1 && this.dead == 0) {
			spawnedBullets.push(new bullet(this.x, this.y, this.direction))
			if (this.weapon == 1) {
			    this.fireRate = 16
			} else if (this.weapon == 2) {
			    this.fireRate = 24
		    } else {
				this.fireRate = 12
			}
		}
	}
}
//Directions: 1 = right, 2 = down, 3 = left, 4 = up

//Zombies
class zombie {
    constructor(spawnX, spawnY){
		this.x = spawnX
	    this.y = spawnY
	    this.dx = 0
	    this.dy = 0
	    this.speed = 0.5
		this.dead = 0
	}
	//Draws the sprite.
	draw(){
		if (this.dead == 0) {
		    ctx.fillStyle = "#2B7C33"
		    ctx.fillText("💃", this.x, this.y, 24)
		}
	}
	//Makes the zombie move towards the player.
	moveTowardsPlayer(){
	    if (this.dead == 0 && player.dead == 0) {
		    if (this.x > player.x + 5)this.dx = this.speed * -1
		    if (this.x < player.x - 5)this.dx = this.speed
		    if (this.y > player.y + 5)this.dy = this.speed * -1
		    if (this.y < player.y - 5)this.dy = this.speed
		}
	}
    hitDetector() {
		for (let i = 0; i < spawnedBullets.length; i++) {
			if (spawnedBullets[i].x > this.x - 15 && spawnedBullets[i].x < this.x + 15 && spawnedBullets[i].y > this.y - 15 && spawnedBullets[i].y < this.y + 15 && this.dead == 0) this.dead = 1, zombieKills += 1, globalBulletHit = 1
		}
	}
    attackPlayer() {
		if (this.x > player.x - 15 && this.x < player.x + 15 && this.y > player.y - 15 && this.y < player.y + 15 && this.dead == 0 && player.dead == 0) player.dead = 1
    }
}

//Bullets
class bullet {
    constructor(spawnX, spawnY, spawnDirection){
		this.x = spawnX
	    this.y = spawnY
		this.dx = 0
		this.dy = 0
		this.hit = 0
		this.direction = spawnDirection
	    this.speed = 12
	}
	    //Draws the sprite.
	    draw(){
			if (this.hit == 0) {
		    ctx.fillStyle = "yellow"
		    ctx.fillText("*", this.x, this.y, 24)
			}
		}
	    //Controls the bullets.
	    move(){
			if (this.hit == 0) {
		        if (this.direction == 1)this.dx = this.speed
			    if (this.direction == 2)this.dy = this.speed 
			    if (this.direction == 3)this.dx = this.speed * -1
			    if (this.direction == 4)this.dy = this.speed * -1
			}
	    }
		hitDetector() {
		for (let i = 0; i < spawnedZombies.length; i++) {
			if (this.x > spawnedZombies[i].x - 15 && this.x < spawnedZombies[i].x + 15 && this.y > spawnedZombies[i].y - 15 && this.y < spawnedZombies[i].y + 15 && this.hit == 0 && globalBulletHit == 1) {
				this.hit = 1
				this.x = null
				this.y = null
				this.dy = null
				this.dy = null
				this.direction = null
				globalBulletHit = 0
			}
		}
	}
}
//Movement and stuff.
addEventListener("keydown", function(e){
    if (player.dead == 0) {
        if (e.code == "KeyW") player.dy = player.speed * -1, player.direction = 4
        if (e.code == "KeyS") player.dy = player.speed, player.direction = 2
        if (e.code == "KeyA") player.dx = player.speed * -1, player.direction = 3
        if (e.code == "KeyD") player.dx = player.speed, player.direction = 1
        if (e.code == "KeyE") player.firing = 1
	}
})
addEventListener("keyup", function(e){
   if (e.code == "KeyW") player.dy = 0
   if (e.code == "KeyS") player.dy = 0
   if (e.code == "KeyA") player.dx = 0
   if (e.code == "KeyD") player.dx = 0
   if (e.code == "KeyE") player.firing = 0
})

function zombieBehavior(){
    for (let i = 0; i < spawnedZombies.length; i++) {
        spawnedZombies[i].x += spawnedZombies[i].dx
        spawnedZombies[i].y += spawnedZombies[i].dy
        spawnedZombies[i].moveTowardsPlayer()
        spawnedZombies[i].draw()
		spawnedZombies[i].hitDetector()
		spawnedZombies[i].attackPlayer()
    }
	if (zombieInterval > 20) {
		if (zombieSpawnLoc == 1){
		    spawnedZombies.push(new zombie(canvas.width, Math.floor(Math.random() * canvas.height) + 12))
	    } else {
		    spawnedZombies.push(new zombie(-20, Math.floor(Math.random() * canvas.height) + 12))
		}
		zombieInterval = 0
		zombieSpawnLoc = Math.floor(Math.random() * 2) + 1
	}
}
function bulletBehavior() {
	for (let i = 0; i < spawnedBullets.length; i++) {
		spawnedBullets[i].x += spawnedBullets[i].dx
		spawnedBullets[i].y += spawnedBullets[i].dy
		spawnedBullets[i].move()
		spawnedBullets[i].draw()
		spawnedBullets[i].hitDetector()
	}
}

//Updates the game. May be an unorganized mess and all that.
function update(){
    //Cleans the background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
	//Draws the background
    ctx.fillStyle = "#0C0C0C"
    ctx.fillRect(0, 0, canvas.width, canvas.height) 
    //Sets the font to those good ol' Windows 8 emojis.
    ctx.font = "24px segoe ui symbol"
    //Any player functions.
    player.x += player.dx
    player.y += player.dy
    player.draw()
	player.fire()
	//Bullet functions
	bulletBehavior()
    //Zombie functions
    zombieBehavior()
    //This loops the game
	zombieInterval += 1
	player.fireRate -= 1
	canvas.requestFullscreen()
    requestAnimationFrame(update)
}
update()
//Now, I'm not a very good programmer and this is a first time project, since I usually make Scratch stuff. If this is a hard to read document then yea apologies haha
