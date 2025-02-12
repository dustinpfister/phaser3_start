class Boot extends Phaser.Scene {

    create () {
        console.log('Booting \'Phaser Start\'');
        this.scene.start('Load');
    }
}

class Load extends Phaser.Scene {

    preload(){
    
        this.load.setBaseURL('./');
        this.load.atlas('map_16_16', 'sheets/map_16_16.png', 'sheets/map_16_16_atlas.json');
        
        this.load.json('map1_data', 'maps/map1_data.json');
        this.load.tilemapCSV('map1', 'maps/map1.csv');
        
        this.load.json('map2_data', 'maps/map2_data.json');
        this.load.tilemapCSV('map2', 'maps/map2.csv');
    
    }
    
    create () {
        this.scene.start('World');
    }

}

class World extends Phaser.Scene {

    setupMap ( mapNum = 1 ) {
    
        const map = this.map = this.make.tilemap({ key: 'map' + mapNum, tileWidth: 16, tileHeight: 16 }); 
        map.setCollision([0,2]);
        const tiles = map.addTilesetImage('map_16_16');
        const layer = this.layer = map.createLayer(0, tiles, 0, 0);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.mapData = this.cache.json.get('map' + mapNum + '_data');
    
    }

    create () {
    
        // camera
        const camera = this.camera = this.cameras.main;
        
        // input cursors
        this.cursors = this.input.keyboard.createCursorKeys();
     
        // map
        this.setupMap(2);
        
        // player sprite
        const x = 16 * this.mapData.spawnAt.x + 8;
        const y = 16 * this.mapData.spawnAt.y + 8;
        this.player = this.physics.add.sprite(x, y, 'map_16_16');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.layer);    
        
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        
        
    }
    update () {
    
        // can set a frame like this
        this.player.setFrame('pl-1');
    
        // set player velocity
        this.player.setVelocity(0);
        const v = 100;     
        if (this.cursors.left.isDown) {
            this.player.setVelocityX( v * -1 );
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX( v );
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY( v * -1);
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY( v );
        }
        
        // camera
        this.camera.setZoom(2.0).pan(this.player.x, this.player.y, 200);
        
        // player debug text
        this.text_player.x = this.player.body.position.x - 20;
        this.text_player.y = this.player.body.position.y - 20;
        this.text_player.text = Math.floor(this.player.x) + ', ' + Math.floor(this.player.y);
        
    }
}

class Game extends Phaser.Scene {
    preload () {
        this.scene.add('Boot', Boot, false);
        this.scene.add('Load', Load, false);
        this.scene.add('World', World, false);
        this.scene.start('Boot');
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Game,
    zoom: 1,
    render: { pixelArt: true, antialias: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);

