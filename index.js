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


    setMapData (mapNum=1) {
       return this.mapData = this.cache.json.get('map' + mapNum + '_data');
    }

    setupMap ( mapNum=1, x=1, y=1 ) {    
        if(this.map){
           this.map.destroy();
        }
        const map = this.map = this.make.tilemap({ key: 'map' + mapNum, tileWidth: 16, tileHeight: 16 }); 
        map.setCollision( [ 0, 2] );
        const tiles = map.addTilesetImage('map_16_16');
        const layer = this.layer = map.createLayer(0, tiles, 0, 0);
        layer.depth = -1;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.setMapData(mapNum);
        this.children.sortByDepth(this.player, this.map);
        this.physics.world.colliders.removeAll();
        this.physics.add.collider(this.player, this.layer);
        this.player.x = Math.floor( x * 16 + 8); 
        this.player.y = Math.floor( y * 16 + 8);
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
    }
    
    doorCheck () {
       const doors = this.mapData.doors; 
       const playerX = Math.floor( this.player.x / 16); 
       const playerY = Math.floor( this.player.y / 16); 
       if(this.doorDisable){
           let i = doors.length;
           this.doorDisable = false;
           while(i--){
               const d = doors[i];
               const p = d.position;
               if( playerX === p.x && playerY === p.y ){
                   this.doorDisable = true;
                   break;
               }
           }
       }
       let i = doors.length;
       while(i-- && !this.doorDisable){
           const d = doors[i];
           const p = d.position;
           if( playerX === p.x && playerY === p.y ){
               this.doorDisable = true;
               this.setMapData(d.to.mapNum);
               const d_new = this.mapData.doors[d.to.doorIndex];
               this.setupMap(d.to.mapNum, d_new.position.x, d_new.position.y);
           }   
       }
    }

    create () {
    
        const camera = this.camera = this.cameras.main;
        
        this.cursors = this.input.keyboard.createCursorKeys();
     
        this.player = this.physics.add.sprite(0, 0, 'map_16_16');
        this.player.setCollideWorldBounds(true);
        this.player.depth = 2;
     
        this.doorDisable = false;
     
        const startMap = 2;
        const md = this.setMapData(startMap);
        this.setupMap(startMap, md.spawnAt.x, md.spawnAt.y);
            
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        this.text_player.depth = 1;
             
    }
    update () {
    
        this.player.setFrame('pl-1');
    
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
        
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
        
        this.text_player.x = this.player.body.position.x - 20;
        this.text_player.y = this.player.body.position.y - 20;
        this.text_player.text = Math.floor(this.player.x) + ', ' + Math.floor(this.player.y);
        
        this.doorCheck();
        
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

