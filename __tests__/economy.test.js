import Phaser from 'phaser';
import { Player } from '../src/entities/player.js';
import { Enemy, EnemyManager } from '../src/entities/enemy.js';
import { ShopScene } from '../src/scenes/shop.js';
import { ITEMS_POOL } from '../src/config/items.js';

describe('Simulacion de Wave Completa con Economia y Powerups', () => {
    let scene;
    let player;
    let enemyManager;
    let shopScene;

    beforeEach(() => {
        // Crear escena mock de Phaser
        scene = new Phaser.Scene({ key: 'TestScene' });
        
        // Crear jugador
        player = new Player(scene, 500, 300);
        
        // Crear manager de enemigos
        enemyManager = new EnemyManager(scene);
        enemyManager.setPlayer(player);
        
        // Crear escena de tienda
        shopScene = new ShopScene();
        shopScene.scene = {
            stop: jest.fn(),
            resume: jest.fn(),
            get: jest.fn(() => ({ enemyManager }))
        };
        shopScene.add = scene.add;
        shopScene.tweens = scene.tweens;
        shopScene.scale = scene.scale;
    });

    test('Wave completa: eliminar enemigos, ganar monedas, comprar powerup y verificar efecto', () => {
        // === FASE 1: CONFIGURACIoN DE LA WAVE ===
        expect(player.coins).toBe(0);
        expect(player.health).toBe(100);
        expect(player.damage).toBe(20);
        expect(enemyManager.currentWave).toBe(1);
        expect(enemyManager.enemiesPerWave).toBe(5);
        expect(enemyManager.enemiesKilledThisWave).toBe(0);
        expect(enemyManager.waveInProgress).toBe(true);

        // === FASE 2: SIMULAR SPAWN Y ELIMINACIoN DE ENEMIGOS ===
        const enemiesSpawned = [];
        for (let i = 0; i < 5; i++) {
            const enemy = new Enemy(scene, 100 + i * 50, 100, 30, 80, 10);
            enemy.setTarget(player);
            enemyManager.enemies.add(enemy);
            enemiesSpawned.push(enemy);
        }

        // Verificar que hay 5 enemigos
        expect(enemyManager.enemies.children.entries.length).toBe(5);

        // Eliminar cada enemigo y verificar que se ganan monedas
        enemiesSpawned.forEach((enemy, index) => {
            const coinsBeforeKill = player.coins;
            
            // Simular que el enemigo muere
            enemyManager.onEnemyKilled(enemy.coinReward);
            
            // Verificar que se ganaron monedas
            expect(player.coins).toBe(coinsBeforeKill + 10);
            
            // Verificar el conteo de enemigos eliminados
            expect(enemyManager.enemiesKilledThisWave).toBe(index + 1);
        });

        // === FASE 3: VERIFICAR COMPLETACIoN DE LA WAVE ===
        expect(player.coins).toBe(50); // 5 enemigos * 10 monedas
        expect(enemyManager.waveInProgress).toBe(false);
        expect(enemyManager.enemiesKilledThisWave).toBe(5);

        // Verificar que se detuvo el spawn
        expect(enemyManager.spawnTimer).toBeNull();

        // === FASE 4: SIMULAR APERTURA DE LA TIENDA ===
        shopScene.init({ player: player, wave: enemyManager.currentWave });
        expect(shopScene.player).toBe(player);
        expect(shopScene.currentWave).toBe(1);

        // === FASE 5: COMPRAR UN POWERUP ESPECiFICO (DAMAGE BOOST) ===
        const damageBoostItem = ITEMS_POOL.find(item => item.id === 'damage_boost');
        expect(damageBoostItem).toBeDefined();
        expect(damageBoostItem.cost).toBe(90);

        // El jugador no tiene suficientes monedas aun (50 < 90)
        expect(player.coins).toBe(50);
        expect(player.coins < damageBoostItem.cost).toBe(true);

        // Dar monedas adicionales para poder comprar
        player.addCoins(40);
        expect(player.coins).toBe(90);

        // Guardar el daño original
        const damageBeforePurchase = player.damage;
        expect(damageBeforePurchase).toBe(20);

        // Realizar la compra
        const purchaseSuccess = player.spendCoins(damageBoostItem.cost);
        expect(purchaseSuccess).toBe(true);
        expect(player.coins).toBe(0);

        // Aplicar el efecto del item
        damageBoostItem.effect(player);

        // === FASE 6: VERIFICAR EFECTO REAL DEL POWERUP ===
        expect(player.damage).toBe(30); // 20 + 10 de daño
        expect(player.damage).toBe(damageBeforePurchase + 10);

        // === FASE 7: VERIFICAR QUE EL POWERUP AFECTA EL COMBATE ===
        // Crear un nuevo enemigo en la siguiente wave
        const newEnemy = new Enemy(scene, 200, 200, 30, 80, 10);
        newEnemy.setTarget(player);

        // Simular un ataque del jugador con el nuevo daño
        const enemyHealthBefore = newEnemy.health;
        newEnemy.takeDamage(player.damage);
        
        // Verificar que el daño aumentado se aplico correctamente
        expect(newEnemy.health).toBe(enemyHealthBefore - 30);
        expect(newEnemy.health).toBe(0); // 30 inicial - 30 daño = 0
        expect(newEnemy.alive).toBe(false);

        // === FASE 8: SIMULAR INICIO DE SIGUIENTE WAVE ===
        enemyManager.startNextWave();
        
        expect(enemyManager.currentWave).toBe(2);
        expect(enemyManager.waveInProgress).toBe(true);
        expect(enemyManager.enemiesKilledThisWave).toBe(0);
        expect(enemyManager.enemiesPerWave).toBe(7); // 5 + 2
    });

    test('Comprar multiples powerups y verificar efectos acumulados', () => {
        // Dar monedas suficientes al jugador
        player.addCoins(500);
        expect(player.coins).toBe(500);

        // Stats iniciales
        const initialDamage = player.damage; // 20
        const initialSpeed = player.speed; // 200
        const initialMaxHealth = player.maxHealth; // 100

        // Comprar Espada Afilada (+10 daño, cuesta 90)
        const damageItem = ITEMS_POOL.find(item => item.id === 'damage_boost');
        player.spendCoins(damageItem.cost);
        damageItem.effect(player);
        expect(player.damage).toBe(initialDamage + 10);

        // Comprar Botas Rpidas (+30 velocidad, cuesta 70)
        const speedItem = ITEMS_POOL.find(item => item.id === 'speed_boost');
        player.spendCoins(speedItem.cost);
        speedItem.effect(player);
        expect(player.speed).toBe(initialSpeed + 30);

        // Comprar Corazon Extra (+20 vida mxima, cuesta 70)
        const healthItem = ITEMS_POOL.find(item => item.id === 'health_boost');
        player.spendCoins(healthItem.cost);
        healthItem.effect(player);
        expect(player.maxHealth).toBe(initialMaxHealth + 20);
        expect(player.health).toBe(initialMaxHealth + 20); // Tambien aumenta la vida actual

        // Verificar monedas gastadas
        expect(player.coins).toBe(500 - 90 - 70 - 70); // 270
        expect(player.coins).toBe(270);

        // Verificar todos los stats mejorados
        expect(player.damage).toBe(30);
        expect(player.speed).toBe(230);
        expect(player.maxHealth).toBe(120);
        expect(player.health).toBe(120);
    });

    test('Intentar comprar sin suficientes monedas', () => {
        player.addCoins(50);
        expect(player.coins).toBe(50);

        const expensiveItem = ITEMS_POOL.find(item => item.id === 'double_damage');
        expect(expensiveItem.cost).toBe(135);

        // Intentar comprar sin suficientes monedas
        const purchaseSuccess = player.spendCoins(expensiveItem.cost);
        expect(purchaseSuccess).toBe(false);
        expect(player.coins).toBe(50); // Las monedas no cambiaron

        // El efecto no deberia aplicarse
        const damageBeforeAttempt = player.damage;
        // No aplicar el efecto si la compra fallo
        if (purchaseSuccess) {
            expensiveItem.effect(player);
        }
        expect(player.damage).toBe(damageBeforeAttempt); // Sin cambios
    });

    test('Ciclo completo de 2 waves con powerups entre waves', () => {
        // === WAVE 1 ===
        enemyManager.waveInProgress = true;
        
        // Eliminar 5 enemigos
        for (let i = 0; i < 5; i++) {
            enemyManager.onEnemyKilled(10);
        }
        
        expect(player.coins).toBe(50);
        expect(enemyManager.waveInProgress).toBe(false);

        // Comprar powerup entre waves
        player.addCoins(50); // Total 100 monedas
        const powerup = ITEMS_POOL.find(item => item.id === 'mega_health');
        player.spendCoins(powerup.cost);
        powerup.effect(player);
        
        expect(player.maxHealth).toBe(130); // 100 + 30
        expect(player.health).toBe(130);

        // === WAVE 2 ===
        enemyManager.startNextWave();
        expect(enemyManager.currentWave).toBe(2);
        expect(enemyManager.enemiesPerWave).toBe(7);
        expect(enemyManager.waveInProgress).toBe(true);

        // Eliminar 7 enemigos
        for (let i = 0; i < 7; i++) {
            enemyManager.onEnemyKilled(10);
        }

        expect(player.coins).toBe(70); // 100 - 100 + 70
        expect(enemyManager.waveInProgress).toBe(false);
        expect(enemyManager.currentWave).toBe(2);
    });
});