class Game extends Phaser.Scene {
    preload () {
    
        // set the base url for loading assets
        this.load.setBaseURL('./');
        this.load.atlas('map_16_16', 'sheets/map_16_16.png', 'sheets/map_16_16_atlas.json');
        this.load.tilemapCSV('map', 'map1.csv');
        
    }
    create () {
    
        // camera
        const camera = this.camera = this.cameras.main;
        
        // input cursors
        this.cursors = this.input.keyboard.createCursorKeys();
     
        // map
        const map = this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 }); 
        map.setCollision([0,2]);
        const tiles = map.addTilesetImage('map_16_16');
        const layer = this.layer = map.createLayer(0, tiles, 0, 0);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        
        // player sprite   
        const can = this.sys.game.canvas;
        const x = 16 + 32 * 2;
        const y = 16 + 32 * 2;
        this.player = this.physics.add.sprite(x, y, 'map_16_16');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.layer);
        
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
        this.camera.setZoom(2.0).pan(this.player.x, this.player.y, 500);
        
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

