"use strict";

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');
var canvasWidth = $('#canvas').width();
var canvasHeight = $('#canvas').height();
var gameLoopIntervalId

var snake = (function(context) {
  var tail = [];
  var direction = "right";

  [1, 2, 3].forEach(function(i) {
    tail.push(new Pixel(i, 1, 10, context));
  });
  var head = tail[tail.length - 1];

  var print = function() {
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
    // var head = get_head();
    if (head.x < 0 || head.x >= canvasWidth/10 || head.y < 0 || head.y >= canvasHeight/10) {
      clearInterval(gameLoopIntervalId);
    }
  };

  var check_food = function() {
    if (head.x === food.x && head.y === food.y) {
      tail.unshift(food);
      head = food;
      food = new Food(10, context);
      food.generateNewPosition();
      food.print();
    }
  }

  var game_background = function() {
    var imageObj = new Image();
    imageObj.onload = function() {
      var pattern = context.createPattern(imageObj, 'repeat');

      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = pattern;
      context.fill();
    };
    imageObj.src = 'http://preview.turbosquid.com/Preview/2012/06/25__16_53_03/360_tile_Grass.jpg35c1b446-6d9b-4a9e-bc5a-1a74920fbd9fLarge.jpg';
  }

  return {
    print: print,
    move: move,
    setDirection: setDirection,
    get_head: get_head,
    check_borders: check_borders,
    check_food: check_food,
    game_background: game_background,
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
    if(keyCodeToDirectionTable[e.which]) {
      e.preventDefault();
      cb(keyCodeToDirectionTable[e.which]);
    }
  })
}

var food = new Food(10, context);
food.generateNewPosition();

/*var gameLoopIntervalId = setInterval(function() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  //game_background();
  snake.print();
  snake.move();
  food.print();
  snake.check_borders();
  snake.check_food();
}, 100);*/

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
    this.x = Math.round(Math.random() * (canvasWidth - this.size) / this.size);
    this.y = Math.round(Math.random() * (canvasHeight - this.size) / this.size);
    this.color = "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
  }

  this.print = function() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
  }
}

function gameLoop() {
    gameLoopIntervalId = setInterval(function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    //game_background();
    snake.print();
    snake.move();
    food.print();
    snake.check_borders();
    snake.check_food();
  }, 100);
}

$(function() {
        console.log("I AM READY");
        var
            socket = new io("http://localhost:3000"),
            socketId = null,
            gameId = null;
        window.socket = socket;

        socket.on("connect", function(data) {
            socketId = socket.io.engine.id;
            runAfterSocketHasConnected();
        });

        socket.on("start", function(data) {
            console.log("game has started");
            console.log(data);
            gameLoop();
        });

        socket.on("render", function(data) {
            console.log("Should render now");
            console.log(data);
        });

        function runAfterSocketHasConnected() {
            $("#createGame").on("click", function() {
                $.ajax({
                    url: "http://localhost:3000/createGame",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        playerName: $("#playerName").val(),
                        socketId: socketId
                    })
                }).done(function(result) {
                    gameId = result.gameId;
                    console.log("Game is created with id: ", gameId);
                });
            });

            $("#joinGame").on("click", function() {
                gameId = $("#joinGameId").val();
                $.ajax({
                    url: "http://localhost:3000/joinGame",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        playerName: $("#playerName").val(),
                        socketId: socketId,
                        gameId: gameId
                    })
                }).done(function(result) {
                    console.log(result);
                });
            });
        }
    });
