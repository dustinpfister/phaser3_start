class Game extends Phaser.Scene {
    preload () {
    
        // set the base url for loading assets
        this.load.setBaseURL('./');
        
        // sprite sheet(s)
        this.load.atlas('test', 'sheets/test.png', 'sheets/test_atlas.json');
        this.load.image('test_tiles', 'sheets/test_tiles.png');
        this.load.tilemapCSV('map', 'map1.csv');
        
    }
    create () {
    
        // camera
        const camera = this.camera = this.cameras.main;
        
        // input cursors
        this.cursors = this.input.keyboard.createCursorKeys();
     
        const map = this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        
        map.setCollision([1]);
        
        const tiles = map.addTilesetImage('test_tiles');

        // create a layer
        const layer = this.layer = map.createLayer(0, tiles, 0, 0);
        

        //layer.randomize(0, 0, map.width, map.height, [ 0, 1, 2, 3 ]);
        
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        
        // player sprite   
        const can = this.sys.game.canvas;
        const x = 16 + 32 * 2; //can.width / 2;
        const y = 16 + 32 * 2; //can.height / 2;
        this.player = this.physics.add.sprite(x, y, 'test');
        
        this.player.setCollideWorldBounds(true);
        
        this.physics.add.collider(this.player, this.layer);
        
        //!!! need to figure out how to draw this relative to camera
        //this.debug = this.add.text(10, 10, 'info');
           
    }
    update () {
    
        const d = this.player.data;
    
    
        // can just simple set a frame like this
        this.player.setFrame('bx-1');
    
        // set/update player velocity
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
        
        //this.camera.setZoom(1).centerOn(this.player.x, this.player.y);
        this.camera.setZoom(1.0).pan(this.player.x, this.player.y, 500);
        
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

