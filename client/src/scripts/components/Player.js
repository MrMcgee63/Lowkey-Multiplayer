import Game from "scripts/components/Game";
import Bullet from "scripts/components/Bullet";
import Socket from "scripts/components/Socket";

export default (function() {
  //Player Ship Code Starts
  function PlayerShip(id, x = 30, y = 30,angle = 0,username = "unset") {
    this.width = 30;
    this.color = "white";
    this.height = 30;
    this.speed = 0;
    this.angle = angle;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.bullets = [];
    this.canFire = true;
    this._id = id;
    this.lastState = {};
    this.colided = false;
    this.life = 100;
    this.capacity = 8;
    this.alive = true;
    this.username = username;
    this.fastMode = false;
    this.killCount = 0;
  }

  PlayerShip.prototype.copyfrom = function (v){
    this.x = v.x;
    this.y = v.y; 
  }

  PlayerShip.prototype.newPos = function() {
    this.lastState = {
      x: this.x,
      y: this.y,
      angle: this.angle
    };
    console.log();
    this.angle = parseFloat((this.angle + (this.moveAngle * Math.PI/ 180)).toFixed(2));
    this.x = parseInt((this.x + (this.speed * Math.sin(this.angle))).toFixed(2));
    this.y = parseInt((this.y - (this.speed * Math.cos(this.angle))).toFixed(2));
  };

  PlayerShip.prototype.update = function() {
    
    Game.ctx.save();
    Game.ctx.lineWidth = 3;
    Game.ctx.translate(this.x+Game.Viewport.x, this.y+Game.Viewport.y);
    // Game.ctx.translate(this.x, this.y);
    Game.ctx.rotate(this.angle);
    Game.ctx.fillStyle = this.color;
    Game.ctx.fillRect(
      this.width / -2,
      this.height / -2,
      this.width,
      this.height
    );
    Game.ctx.strokeRect(
      this.width / -2,
      this.height / -2,
      this.width,
      this.height
    );

    Game.ctx.fillStyle = "black";
    Game.ctx.fillRect(-2, -this.height + 5, 4, 10);
    Game.ctx.rotate(-this.angle);
    Game.ctx.fillStyle = "black";
    Game.ctx.font = "bold 11px Arial";
    Game.ctx.fillText(this.life, -9.5, 5);
    Game.ctx.fillStyle = "black";
    Game.ctx.font = "bold 12px Arial";
    Game.ctx.rotate(this.angle);
    Game.ctx.fillText(this.username, -15, 30);
    Game.ctx.restore();
  };

  PlayerShip.prototype.fireBullet = function() {
    if (this.canFire) {
      var thisPlayerShip = this;
      if (this.capacity == 0) {
        this.canFire = false;
        setTimeout(function() {
          thisPlayerShip.canFire = true;
          thisPlayerShip.capacity = 8;
        }, 1000);
      } else {
        this.canFire = false;
        this.bullets.push(
          new Bullet.Bullet(this._id, this.x, this.y, this.angle, this.speed)
        );
        Socket.sendData([5, this._id, this.x, this.y, this.angle]);
        
        setTimeout(function() {
          thisPlayerShip.canFire = true;
        }, 150);
        this.capacity = this.capacity - 1;
      }
    }
  };

  PlayerShip.prototype.pos = function() {
    return {
      _id: this._id,
      x: this.x,
      y: this.y,
      angle: this.angle
    };
  };

  PlayerShip.prototype.collision = function(flag) {
    this.colided = flag;
    if (flag && this.lastState) {
      this.x = this.lastState.x;
      this.y = this.lastState.y;
      this.angle = this.lastState.angle;
    }
  };

  PlayerShip.prototype.updateLastPressed = function(key) {};
  return {
    PlayerShip
  };
})();
