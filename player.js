import { Sitting, Running, Jumping, Falling, Rolling } from "./playerStates.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY=5;
        this.width = 100;
        this.vy = 0;
        this.height = 91.3;
        this.x = 0;
        this. y = this.game.height - this.height - this.game.groundMargin;
        this.speed = 100;
        this.maxSpeed = 10;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.weight = 1;
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this), new Rolling(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontial movement
        
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x <0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //vertical movement
        this.y +=  this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        //sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height); 
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        console.log(state);
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y) {
                    enemy.markedForDeletion = true;
                    this.game.score += 1;
            } else {

            }
        })
    }
}