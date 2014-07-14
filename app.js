"use strict";

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var snake = (function(context) {
  var tail = [];
  var direction = "right";
  var food = new Food(10, context);

  [1, 2, 3].forEach(function(i) {
    tail.push(new Pixel(i, 1, 10, context));
  });
  var head = tail[tail.length - 1];

  var print = function() {food.print();
    tail.forEach(function(p) {
      p.print();
    })
  };

  var move = function() {
    switch(direction) {
      case "up":
        var new_head = new Pixel(head.x, head.y - 1, 10,context);
        break;
      case "down":
        var new_head = new Pixel(head.x, head.y + 1, 10, context);
        break;
      case "left":
        var new_head = new Pixel(head.x - 1, head.y, 10, context);
        break;
      case "right":
        var new_head = new Pixel(head.x + 1, head.y, 10, context);
        break;
    }
    tail.push(new_head);
    tail.shift();
    head = new_head;
  }

  var setDirection = function(dir) {
    if(dir === "left" && direction === "right" || dir === "right" && direction === "left" || dir === "up" && direction === "down" || dir === "down" && direction === "up" ) {
      return false;
    }
    else {
      direction = dir;
    }
  };

  var get_head = function() {
    return head;
  };

  var check_borders = function() {
    if (get_head().x < 0 || get_head().x >= 60 || get_head().y < 0 || get_head().y >= 30) {
      clearInterval(gameLoopIntervalId);
    }
  };

  return {
    print: print,
    move: move,
    setDirection: setDirection,
    get_head: get_head,
    check_borders: check_borders,
  };

}(context));

initKeyController(function(direction){
  snake.setDirection(direction);
});

function initKeyController(cb) {
  var keyCodeToDirectionTable = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  $(document).keydown(function(e) {
    cb(keyCodeToDirectionTable[e.which]);
  })
}

var gameLoopIntervalId = setInterval(function(){
  context.clearRect(0, 0, 600, 300);
  snake.print();
  snake.move();
  snake.check_borders();
}, 100);

function Pixel(x, y, size, context) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.context = context;

  this.print = function() {
    this.context.fillStyle = "red";
    this.context.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
  }
}

function Food(size, context) {
  this.size = size;
  this.context = context;

  this.generateNewPosition = function() {
    this.x = Math.round(Math.random() * (600 - this.size) / this.size);
    this.y = Math.round(Math.random() * (300 - this.size) / this.size);;
  }

  this.print = function() {
    this.generateNewPosition();
console.log(this.x);
    this.context.fillStyle = "red";
    this.context.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
  }
}

function getRandomizer(bottom, top) {
  return function() {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
  }
}
