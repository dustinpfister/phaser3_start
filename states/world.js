class World extends Phaser.Scene {

    createPlayer () {
        this.player = this.physics.add.sprite(0, 0, 'people_16_16');
        this.player.setCollideWorldBounds(true);
        this.player.depth = 2;
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        this.text_player.depth = 1;   
    }

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
        
        const layer1 =  map.createLayer(0, tiles, 0, 0);
        layer1.depth = 0;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.setMapData(mapNum);
        this.children.sortByDepth(this.player, this.map);
        this.physics.world.colliders.removeAll();
        this.physics.add.collider(this.player, layer1);
        this.player.x = Math.floor( x * 16 + 8); 
        this.player.y = Math.floor( y * 16 + 8);
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
    }
    
    doorDisabledCheck () {
        if(this.doorDisable){
           const doors = this.mapData.doors;
           let i = doors.length;
           this.doorDisable = false;
           while(i--){
               const d = doors[i];
               const p = d.position;
               if( this.playerX === p.x && this.playerY === p.y ){
                   this.doorDisable = true;
                   break;
               }
           }
           return;
       }  
    }
    
    doorEnterCheck (i, d, p) {
        if( this.playerX === p.x && this.playerY === p.y ){
            this.doorDisable = true;
            this.setMapData(d.to.mapNum);
            const d_new = this.mapData.doors[d.to.doorIndex];
            this.setupMap(d.to.mapNum, d_new.position.x, d_new.position.y);
            return true;
        }
        return false;
    }
    
    slideSet (axis, dir, rad, a, v1, v2) {
    
        if(dir === 'left'){
            if(a > 0){
              a = (a + Math.PI * 0.32) * -1
            }
        }
    
        let a2 = rad + 1.0;
        let a3 = rad - 1.0;
            
        if (this.cursors[dir].isDown && a < a2 && a > a3) {
            if(a < rad){
                this.player['setVelocity' + axis]( v1 );
            }
            if(a > rad){
                this.player['setVelocity' + axis]( v2 );
            }
        }
        
    }
    
    doorSlide (i, d, p) {
        const x1 = this.player.x;
        const y1 = this.player.y;
        const x2 = p.x * 16 + 8;
        const y2 = p.y * 16 + 8;
        const dist = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        
        const a = Phaser.Math.Angle.Between(x1, y1, x2, y2); 
         
        if(dist < 16 * 2){
        
            this.slideSet('X', 'down', Math.PI * 0.5, a, 100, -100);
            this.slideSet('X', 'up', Math.PI * 0.5 * -1, a, -100, 100);    
            this.slideSet('Y', 'right', Math.PI * 0, a, -100, 100);
            this.slideSet('Y', 'left', Math.PI * 1.0 * -1, a, 100, -100);
               
        } 
    }
    
    doorCheck () {
       const doors = this.mapData.doors; 
       this.doorDisabledCheck();
       let i = doors.length;
       while(i-- && !this.doorDisable){
           const d = doors[i];
           const p = d.position;
           if( this.doorEnterCheck(i,d,p) ){
               return;
           }
           this.doorSlide(i,d,p);
       }
    }
    
    create () {
    
        const camera = this.camera = this.cameras.main;
        
        this.cursors = this.input.keyboard.createCursorKeys();
     
        this.createPlayer();
     
        this.doorDisable = false;
     
        const startMap = 1;
        const md = this.setMapData(startMap);
        this.setupMap(startMap, md.spawnAt.x, md.spawnAt.y);
            

             
    }
    update () {
    
        this.player.setFrame('pl_down');
    
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
        
        this.playerX = Math.floor( this.player.x / 16); 
        this.playerY = Math.floor( this.player.y / 16);
        
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
        
        this.text_player.x = this.player.body.position.x - 0;
        this.text_player.y = this.player.body.position.y - 16;
        this.text_player.text = this.playerX + ', ' + this.playerY;
        
        this.doorCheck();
        
    }
}

export {
    World
}
