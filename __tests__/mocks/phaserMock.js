const PhaserMock = {
    AUTO: 'AUTO',
    Physics: {
        Arcade: {
            Sprite: class Sprite {
            constructor(scene, x, y, texture) {
                this.scene = scene;
                this.x = x;
                this.y = y;
                this.texture = texture;
                this.body = {
                velocity: { x: 0, y: 0 },
                setSize: jest.fn(),
                setOffset: jest.fn(),
                setVelocity: jest.fn((vx, vy) => {
                    this.body.velocity.x = vx;
                    this.body.velocity.y = vy;
                }),
                };
                this.active = true;
                this.visible = true;
                this._tint = 0xffffff;
            }
            setDisplaySize(w, h) { this.displayWidth = w; this.displayHeight = h; return this; }
            setVelocity(x, y) { this.body.velocity.x = x; this.body.velocity.y = y; return this; }
            setVelocityX(x) { this.body.velocity.x = x; return this; }
            setVelocityY(y) { this.body.velocity.y = y; return this; }
            setCollideWorldBounds(value) { this.collideWorldBounds = value; return this; }
            setCircle(radius) { this.circleRadius = radius; return this; }
            setTint(color) { this._tint = color; return this; }
            clearTint() { this._tint = 0xffffff; return this; }
            setVisible(value) { this.visible = value; return this; }
            setActive(value) { this.active = value; return this; }
            destroy() { 
                this.active = false; 
                this.visible = false;
                if (this.scene) {
                this.scene = null;
                }
            }
        }
    }
    },
};

PhaserMock.Math = {
  Distance: {
    Between: (x1, y1, x2, y2) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
  },
  Between: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  Angle: {
    Between: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)
  }
};

PhaserMock.Input = {
  Keyboard: {
    KeyCodes: {
      ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53,
      SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57
    },
    JustDown: (key) => key._justDown || false
  }
};

PhaserMock.Scene = class Scene {
    constructor(config) {
      this.key = config.key || config;
      this.time = {
        now: 0,
        addEvent: jest.fn((config) => {
          return { remove: jest.fn() };
        }),
        delayedCall: jest.fn()
      };
      this.events = {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn()
      };
      this.physics = {
        add: {
          group: jest.fn(() => ({
            children: { entries: [] },
            add: jest.fn(function(sprite) {
              this.children.entries.push(sprite);
            }),
            active: true
          })),
          overlap: jest.fn(),
          existing: jest.fn()
        }
      };
      this.add = {
        existing: jest.fn((obj) => obj),
        circle: jest.fn((x, y, radius, color, alpha) => ({
          x, y, radius, color, alpha,
          setPosition: jest.fn().mockReturnThis(),
          setStrokeStyle: jest.fn().mockReturnThis(),
          setFillStyle: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        })),
        rectangle: jest.fn().mockReturnValue({
          setStrokeStyle: jest.fn().mockReturnThis(),
          setScale: jest.fn().mockReturnThis(),
          setAlpha: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          setFillStyle: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        }),
        text: jest.fn().mockReturnValue({
          setOrigin: jest.fn().mockReturnThis(),
          setScale: jest.fn().mockReturnThis(),
          setAlpha: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
          setStyle: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          off: jest.fn().mockReturnThis(),
          disableInteractive: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        }),
        line: jest.fn().mockReturnValue({
          setLineWidth: jest.fn().mockReturnThis(),
          setPosition: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        }),
        sprite: jest.fn().mockReturnValue({
          setDisplaySize: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          setScale: jest.fn().mockReturnThis(),
          setAlpha: jest.fn().mockReturnThis(),
          setPosition: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        }),
        graphics: jest.fn().mockReturnValue({
          lineStyle: jest.fn().mockReturnThis(),
          lineBetween: jest.fn().mockReturnThis(),
          setTint: jest.fn().mockReturnThis(),
          clearTint: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        })
      };
      this.tweens = {
        add: jest.fn()
      };
      this.input = {
        keyboard: {
          createCursorKeys: jest.fn(() => ({
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
            down: { isDown: false }
          })),
          on: jest.fn(),
          off: jest.fn(),
          addKey: jest.fn((keyCode) => ({
            keyCode,
            _justDown: false
          }))
        }
      };
      this.scale = {
        width: 1000,
        height: 640
      };
      this.load = {
        image: jest.fn()
      };

      this.enemyManager = {
        enemies: {
          children: {
            entries: []
          }
        },
        onEnemyKilled: jest.fn()
      };
    }
};

PhaserMock.Game = class Game {
  constructor(config) {
    this.config = config;
  }
};

// Exportar como default y named export
module.exports = PhaserMock;
module.exports.Phaser = PhaserMock;
module.exports.default = PhaserMock;

// Hacer disponible globalmente
global.Phaser = PhaserMock;

