/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Component = /** @class */ (function () {
    function Component(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.offset = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
    }
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Key;
(function (Key) {
    Key[Key["Space"] = 32] = "Space";
    Key[Key["Left"] = 37] = "Left";
    Key[Key["Right"] = 39] = "Right";
})(Key = exports.Key || (exports.Key = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Play"] = 0] = "Play";
    GameStatus[GameStatus["Win"] = 1] = "Win";
    GameStatus[GameStatus["Loss"] = 2] = "Loss";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = __webpack_require__(1);
var brick_1 = __webpack_require__(5);
var ball_1 = __webpack_require__(4);
var paddle_1 = __webpack_require__(6);
var status_1 = __webpack_require__(7);
var logger_1 = __webpack_require__(9);
var Playground = /** @class */ (function () {
    function Playground(options, parent) {
        this.options = options;
        this.parent = parent;
        var opts = this.options;
        this.width = opts.screen.width;
        this.height = opts.screen.height;
        this.autoPlay = opts.autoPlay;
        this.createCanvas();
        this.createPaddle();
        this.createBall();
        this.createStatus();
    }
    Playground.prototype.newGame = function () {
        this.gameStatus = enums_1.GameStatus.Play;
        this.status.reset();
        this.createBricks();
        this.movePaddleToCenter();
        this.captureBall(!this.autoPlay);
    };
    Playground.prototype.createCanvas = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.parent.appendChild(canvas);
        this.canvasRect = canvas.getBoundingClientRect();
    };
    Playground.prototype.createPaddle = function () {
        var opts = this.options, x = 0, y = Math.round(this.height - opts.paddle.offsetBottom - opts.paddle.height);
        this.paddle = new paddle_1.Paddle(this.ctx, x, y, opts.paddle);
        this.movePaddleToCenter();
        this.paddleStep = 0.02 * this.width;
    };
    Playground.prototype.createBall = function () {
        var opts = this.options;
        this.ball = new ball_1.Ball(this.ctx, 0, 0, this.options.ball);
        this.moveBallToPaddleCenter();
        this.ballXStep = 9;
        this.ballYStep = -this.ballXStep;
    };
    Playground.prototype.createBricks = function () {
        var bricks = [], brickOpts = this.options.brick, width = brickOpts.width, height = brickOpts.height;
        var offsetX = 100, offsetY = 70, gap = 20, rows = Math.round((this.height * 0.35) / (height + gap)), cols = Math.round((this.width - offsetX * 2) / (width + gap));
        var x = offsetX, y = offsetY;
        for (var i = 0; i < rows; ++i) {
            for (var j = 0; j < cols; ++j) {
                bricks.push(new brick_1.Brick(this.ctx, x, y, brickOpts));
                x += width + gap;
            }
            x = offsetX;
            y += height + gap;
        }
        this.bricks = bricks;
        this.bricksLen = bricks.length;
    };
    Playground.prototype.createStatus = function () {
        this.status = new status_1.Status(this.ctx, 0, 0, this.options.status);
    };
    Playground.prototype.clear = function () {
        var opts = this.options, ctx = this.ctx;
        ctx.fillStyle = opts.bg.fill;
        ctx.clearRect(0, 0, opts.screen.width, opts.screen.height);
    };
    Playground.prototype.draw = function () {
        this.clear();
        this.processCollision();
        this.drawPaddle();
        this.drawBall();
        this.drawBricks();
        this.drawStatus();
        if (this.gameStatus !== enums_1.GameStatus.Play) {
            this.drawGameEnd();
        }
    };
    Playground.prototype.drawPaddle = function () {
        var paddle = this.paddle, ball = this.ball;
        if (this.autoPlay) {
            this.movePaddle(ball.x - paddle.options.width / 2);
        }
        paddle.draw();
    };
    Playground.prototype.drawBall = function () {
        var ball = this.ball;
        if (this.ballCaptured) {
            this.moveBallToPaddleCenter();
        }
        else {
            ball.moveX(ball.x + this.ballXStep);
            ball.moveY(ball.y + this.ballYStep);
        }
        ball.draw();
    };
    Playground.prototype.drawBricks = function () {
        var bricks = this.bricks, bricksLen = this.bricksLen, brick;
        var activeBlocks = false;
        for (var i = 0; i < bricksLen; ++i) {
            brick = bricks[i];
            if (brick.alive()) {
                brick.draw();
                activeBlocks = true;
            }
        }
        if (!activeBlocks) {
            this.gameStatus = enums_1.GameStatus.Win;
        }
    };
    Playground.prototype.drawStatus = function () {
        this.status.draw();
    };
    Playground.prototype.drawGameEnd = function () {
        var ctx = this.ctx, opts = this.options, text = this.gameStatus === enums_1.GameStatus.Win ? 'Well Done!' : 'You Lose';
        // Cover
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, 0, this.width, this.height);
        // Text
        ctx.globalAlpha = 1;
        ctx.fillStyle = opts.status.fill;
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, Math.round(this.width / 2), Math.round(this.height / 2));
    };
    Playground.prototype.movePaddle = function (x) {
        var paddle = this.paddle;
        var xMin = 0, xMax = this.width - paddle.options.width;
        x = (x < xMin) ? xMin : (x > xMax) ? xMax : x;
        paddle.x = Math.round(x);
    };
    Playground.prototype.movePaddleByMouse = function (event) {
        if (this.autoPlay) {
            return;
        }
        this.movePaddle(event.clientX - this.canvasRect.left - (this.paddle.options.width / 2));
    };
    Playground.prototype.movePaddleLeft = function () {
        if (this.autoPlay) {
            return;
        }
        this.movePaddle(this.paddle.x - this.paddleStep);
    };
    Playground.prototype.movePaddleRight = function () {
        if (this.autoPlay) {
            return;
        }
        this.movePaddle(this.paddle.x + this.paddleStep);
    };
    Playground.prototype.movePaddleToCenter = function () {
        this.movePaddle(this.width / 2 - this.paddle.options.width / 2);
    };
    Playground.prototype.captureBall = function (capture) {
        if (capture === undefined) {
            capture = !this.ballCaptured;
        }
        if (!capture && this.ballCaptured) {
            // Move ball up to 1px to skip paddle collision detection
            var ball = this.ball;
            ball.moveY(ball.y - 1);
        }
        this.ballCaptured = capture;
    };
    Playground.prototype.moveBallToPaddleCenter = function () {
        var ball = this.ball, paddle = this.paddle;
        ball.moveX(paddle.x + paddle.options.width / 2);
        ball.moveY(paddle.y - ball.options.radius);
    };
    Playground.prototype.destroy = function () {
        this.parent.removeChild(this.canvas);
    };
    Playground.prototype.processCollision = function () {
        if (this.ballCaptured) {
            return;
        }
        this.processBorderCollision() ||
            this.processPaddleCollision() ||
            this.processBrickCollision();
    };
    Playground.prototype.processBorderCollision = function () {
        var ball = this.ball, offset = ball.offset;
        // Left border
        if (offset.left <= 0) {
            logger_1.logger.log('Border left collision');
            ball.moveX(ball.options.radius);
            this.ballXStep = -this.ballXStep;
            return true;
        }
        // Right border
        if (offset.right >= this.width) {
            logger_1.logger.log('Border right collision');
            ball.moveX(this.width - ball.options.radius);
            this.ballXStep = -this.ballXStep;
            return true;
        }
        // Top border
        if (offset.top <= 0) {
            logger_1.logger.log('Border top collision');
            ball.moveY(ball.options.radius);
            this.ballYStep = -this.ballYStep;
            return true;
        }
        // Bottom border
        if (offset.bottom >= this.height) {
            logger_1.logger.log('Border bottom collision');
            logger_1.logger.log('Lost life');
            var status_2 = this.status;
            if (status_2.alive()) {
                this.captureBall(true);
            }
            else {
                this.gameStatus = enums_1.GameStatus.Loss;
                logger_1.logger.log('Game over');
            }
            status_2.decreaseLife();
            return true;
        }
        return false;
    };
    Playground.prototype.processPaddleCollision = function () {
        var paddle = this.paddle, paddleRight = paddle.x + paddle.options.width, paddleBottom = paddle.y + paddle.options.height;
        var ball = this.ball, offset = ball.offset;
        var collide = ((offset.bottom >= paddle.y && offset.top < paddle.y) &&
            ((offset.left > paddle.x && offset.left < paddleRight) ||
                (offset.right > paddle.x && offset.right < paddleRight)));
        if (collide) {
            logger_1.logger.log('Paddle collision');
            ball.moveY(paddle.y - ball.options.radius);
            this.ballYStep = -this.ballYStep;
        }
        return collide;
    };
    Playground.prototype.processBrickCollision = function () {
        var ball = this.ball, ballOffset = ball.offset;
        var bricks = this.bricks, bricksLen = this.bricksLen, brickOffset, brick;
        for (var i = 0; i < bricksLen; ++i) {
            brick = bricks[i];
            brickOffset = brick.offset;
            if (!brick.alive()) {
                continue;
            }
            // Top/bottom
            if (((ballOffset.bottom >= brickOffset.top && ballOffset.top < brickOffset.top) ||
                (ballOffset.top <= brickOffset.bottom && ballOffset.bottom > brickOffset.bottom)) &&
                (ball.x > brickOffset.left && ball.x < brickOffset.right)) {
                logger_1.logger.log('Brick top/bottom collision');
                brick.decreaseLife();
                this.status.increaseScore();
                this.ballYStep = -this.ballYStep;
                return true;
            }
            // Left/right
            if (((ballOffset.right >= brickOffset.left && ballOffset.left < brickOffset.left) ||
                (ballOffset.left <= brickOffset.right && ballOffset.right > brickOffset.right)) &&
                (ball.y > brickOffset.top && ball.y < brickOffset.bottom)) {
                logger_1.logger.log('Brick left/right collision');
                brick.decreaseLife();
                this.status.increaseScore();
                this.ballXStep = -this.ballXStep;
                return true;
            }
        }
        return false;
    };
    return Playground;
}());
exports.Playground = Playground;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getKeyCode(event) {
    return event.keyCode || event.which;
}
exports.getKeyCode = getKeyCode;
function merge(target) {
    var objs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objs[_i - 1] = arguments[_i];
    }
    var obj, prop, val;
    for (var i = 0; i < objs.length; ++i) {
        obj = objs[i];
        for (prop in obj) {
            val = obj[prop];
            if (Array.isArray(val)) {
                target[prop] = val.slice();
            }
            else if (typeof val === 'object') {
                if (typeof target[prop] !== 'object') {
                    target[prop] = {};
                }
                merge(target[prop], obj[prop]);
            }
            else {
                target[prop] = val;
            }
        }
    }
    return target;
}
exports.merge = merge;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = __webpack_require__(0);
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(ctx, x, y, options) {
        var _this = _super.call(this, ctx, x, y) || this;
        _this.options = options;
        _this.moveX(x);
        _this.moveY(y);
        return _this;
    }
    Ball.prototype.draw = function () {
        var ctx = this.ctx, opts = this.options;
        ctx.fillStyle = opts.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, opts.radius, 0, 2 * Math.PI);
        ctx.fill();
    };
    Ball.prototype.moveX = function (x) {
        var r = this.options.radius;
        this.x = x;
        this.offset.left = x - r;
        this.offset.right = x + r;
    };
    Ball.prototype.moveY = function (y) {
        var r = this.options.radius;
        this.y = y;
        this.offset.top = y - r;
        this.offset.bottom = y + r;
    };
    return Ball;
}(component_1.Component));
exports.Ball = Ball;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = __webpack_require__(0);
var Brick = /** @class */ (function (_super) {
    __extends(Brick, _super);
    function Brick(ctx, x, y, options) {
        var _this = _super.call(this, ctx, x, y) || this;
        _this.options = options;
        var offset = _this.offset;
        offset.left = x;
        offset.right = options.width + x;
        offset.top = y;
        offset.bottom = options.height + y;
        _this.life = _this.options.fill.length;
        return _this;
    }
    Brick.prototype.alive = function () {
        return this.life > 0;
    };
    Brick.prototype.decreaseLife = function () {
        if (this.life > 0) {
            this.life -= 1;
        }
    };
    Brick.prototype.draw = function () {
        var ctx = this.ctx, opts = this.options;
        ctx.fillStyle = opts.fill[this.life - 1];
        ctx.fillRect(this.x, this.y, opts.width, opts.height);
    };
    return Brick;
}(component_1.Component));
exports.Brick = Brick;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = __webpack_require__(0);
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    function Paddle(ctx, x, y, options) {
        var _this = _super.call(this, ctx, x, y) || this;
        _this.options = options;
        return _this;
    }
    Paddle.prototype.draw = function () {
        var opts = this.options, ctx = this.ctx;
        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, opts.width, opts.height);
    };
    return Paddle;
}(component_1.Component));
exports.Paddle = Paddle;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = __webpack_require__(0);
var Status = /** @class */ (function (_super) {
    __extends(Status, _super);
    function Status(ctx, x, y, options) {
        var _this = _super.call(this, ctx, x, y) || this;
        _this.options = options;
        _this.reset();
        return _this;
    }
    Status.prototype.reset = function () {
        this.score = 0;
        this.life = 3;
    };
    Status.prototype.increaseScore = function () {
        this.score += 10;
    };
    Status.prototype.decreaseLife = function () {
        this.life -= 1;
    };
    Status.prototype.alive = function () {
        return this.life > 1;
    };
    Status.prototype.draw = function () {
        var ctx = this.ctx, opts = this.options;
        // Status
        ctx.fillStyle = opts.fill;
        ctx.font = opts.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText("Score: " + this.score, 30, 30);
        // Life
        ctx.textAlign = 'right';
        ctx.textBaseline = 'left';
        ctx.fillText("Life: " + this.life, this.ctx.canvas.width - 30, 30);
    };
    return Status;
}(component_1.Component));
exports.Status = Status;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var playground_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(3);
var Game = /** @class */ (function () {
    function Game(options, parent) {
        if (parent === void 0) { parent = document.body; }
        this.parent = parent;
        this.keys = {};
        this.options = utils_1.merge({}, Game.defaultOptions, options);
        this.bindMethods();
        this.createPlaygroud();
        this.newGame();
    }
    Game.prototype.bindMethods = function () {
        this.onNewFrame = this.onNewFrame.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    };
    Game.prototype.createPlaygroud = function () {
        var pg = new playground_1.Playground(this.options, this.parent);
        this.playground = pg;
        this.canvas = pg.canvas;
    };
    Game.prototype.newGame = function () {
        this.playground.newGame();
        var canvas = this.canvas;
        canvas.addEventListener('mousemove', this.onMouseMove);
        canvas.addEventListener('click', this.onMouseClick);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        var FPS = 50;
        this.frameId = setInterval(this.onNewFrame, 1000 / FPS);
    };
    Game.prototype.stopGame = function () {
        var canvas = this.canvas;
        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('click', this.onMouseClick);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        clearInterval(this.frameId);
    };
    Game.prototype.onNewFrame = function () {
        var pg = this.playground, keys = this.keys;
        if (pg.gameStatus !== enums_1.GameStatus.Play) {
            this.stopGame();
            return;
        }
        pg.draw();
        if (keys[enums_1.Key.Left]) {
            pg.movePaddleLeft();
        }
        if (keys[enums_1.Key.Right]) {
            pg.movePaddleRight();
        }
    };
    Game.prototype.onMouseMove = function (event) {
        this.playground.movePaddleByMouse(event);
    };
    Game.prototype.onMouseClick = function (event) {
        this.playground.captureBall(false);
    };
    Game.prototype.onKeyDown = function (event) {
        var key = utils_1.getKeyCode(event);
        this.keys[key] = true;
        if (key === enums_1.Key.Space) {
            this.playground.captureBall();
        }
    };
    Game.prototype.onKeyUp = function (event) {
        var key = utils_1.getKeyCode(event);
        this.keys[key] = false;
    };
    Game.prototype.destroy = function () {
        this.stopGame();
        this.playground.destroy();
        this.playground = null;
        this.options = null;
        this.parent = null;
    };
    Game.defaultOptions = {
        screen: {
            width: 800,
            height: 600
        },
        bg: { fill: 'white' },
        paddle: {
            width: 150,
            height: 30,
            offsetBottom: 30,
            fill: '#000289'
        },
        ball: {
            radius: 10,
            fill: '#000000'
        },
        brick: {
            width: 100,
            height: 25,
            fill: ['#000000', '#a7a7a7']
        },
        status: {
            fill: 'gray',
            font: '16px sans-serif'
        },
        autoPlay: false
    };
    return Game;
}());
exports.Game = Game;
// Save game constructor to global scope
window['Breakout'] = Game;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.log = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (true) {
            console.log.apply(console, [msg].concat(args));
        }
    };
    return Logger;
}());
exports.Logger = Logger;
exports.logger = new Logger();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map