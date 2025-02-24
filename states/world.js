

const MAX_PEOPLE = 10;

class World extends Phaser.Scene {

    createPlayer () {
        this.player = this.physics.add.sprite(0, 0, 'people_16_16');
        this.player.setCollideWorldBounds(true);
        this.player.depth = 2;
        //this.player.data = {
        //    path: []
        //};
        
        this.player.setData({ path: [] })
        
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        this.text_player.depth = 1;
        
        this.player.setFrame('pl_down');
    }
    
    createPeople () {
        this.people = this.physics.add.group({
           defaultKey: 'people_16_16',
           frame: 'pl_down',
           maxSize: MAX_PEOPLE,
           createCallback : (person) => {
               person.depth = 2;
               person.body.setDrag(500, 500);
               //person.data = { path:[] };
               
               person.setData({ path:[] })
               
               //console.log( person.getData('path') )
                            
           }
        });
        
        //console.log(this.people);
        /*
        this.people.addListener('collide', ()=>{
        
            console.log('yar');
        
        });
        
        this.people.on('collide', ()=>{
        
            console.log('yar');
        
        });
        
        this.physics.world.on('collide', ()=>{
        
            console.log('YAR!');
        
        })
        */
        
    }
    
    setSpritePath (sprite, map, tx=2, ty=2) {
        const pathFinder = this.plugins.get('PathFinderPlugin');
        const game = this;
        pathFinder.setGrid(map.layers[0].data, [1]);
        
           
            pathFinder.setCallbackFunction(function(path) { 
            
                path = path || [];
            
                //sprite.data.path = path;
                
                sprite.setData({ path: path })
                
                
            });
            
            const stx = Math.floor( sprite.x / 16 );
            const sty = Math.floor( sprite.y / 16 );
            
            pathFinder.preparePathCalculation([stx, sty], [tx, ty]);
            pathFinder.calculatePath();
        
    
    }

    setMapData (mapNum=1) {
       return this.mapData = this.cache.json.get('map' + mapNum + '_data');
    }
    
    getRandomMapPos () {
    
        const w = this.map.layers[0].width;
        const h = this.map.layers[0].height;
    
        const tx = Math.floor( w * Math.random()  );
        const ty = Math.floor( h * Math.random()  );
        
        return {x: tx, y : ty };
    
    }
    
    
    spawn () {
        const pos = this.mapData.spawnAt;
        this.people.get(pos.x * 16 + 8, pos.y * 16 + 8);  
    }
    
    reSpawn (sprite) {
        const pos = this.mapData.spawnAt;
        sprite.x = pos.x * 16 + 8;
        sprite.y = pos.y * 16 + 8;
        //sprite.data.path = [];
        sprite.setData({path:[]})
    }

    setupMap ( startMap=1, x=undefined, y=undefined ) {    
        if(this.map){
           this.map.destroy();
        }
        
        const md = this.setMapData( startMap );
        x = x === undefined ? md.spawnAt.x : x;
        y = y === undefined ? md.spawnAt.y : y;
        
        const map = this.map = this.make.tilemap({ key: 'map' + startMap, layers:[], tileWidth: 16, tileHeight: 16 });
        map.setCollision( [ 0, 2, 30] );
        const tiles = map.addTilesetImage('map_16_16');
        
        //if(this.people){
        
            //this.people.destroy(true, true);
        
        //}
        
        //this.createPeople();
        
        
        // layer 0 will be used for collider cells
        const layer0 =  map.createLayer(0, tiles);
        layer0.depth = 0;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        
        this.children.sortByDepth(this.player, this.map);
        
        // colliders
        this.physics.world.colliders.removeAll();
        this.physics.add.collider( this.player, layer0 );
        this.physics.add.collider( this.people, layer0 );
        this.physics.add.collider( this.player, this.people, ()=>{
        
            //console.log( 'yar' )
             
        });
        this.physics.add.collider( this.people, this.people, (a, b)=>{
        
            b.destroy();
        
        
        });
        
        this.reSpawn(this.player);
        
        // layer1 will be used for tiles that should be renderd above a sprite
        const layer1 = map.createBlankLayer('layer1', tiles);
        layer1.depth = 2;
        
        //layer1.putTileAt(20, 10, 32)
        
        layer0.setInteractive();
        
        
        const game = this;
        const player = this.player;
        
        //player.data.path = [];
        player.setData({path: [] });
        
        
        layer0.on('pointerdown', (pointer)=>{
        
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            
            const tile = map.getTileAt(tx, ty, false, 0);
            
            if(tile){
            
                //console.log(this.people.runChildUpdate)
                
                if(tile.index != 1){
                
                    const sprite = this.people.getFirst(true, false);
                    
                    if(sprite){
                        sprite.destroy();
                        console.log(sprite);
                    
                    }
                    
                    
                    //this.people.remove(sprite, true, true);
                    
                    //console.log(sprite)
                
                
                    //this.people.runChildUpdate = true;
                
                    //console.log(this.people.runChildUpdate)
                
                }
                
            
                if(tile.index === 1){
                    this.setSpritePath(player, map, tx, ty);
                }
            
            }
            
            game.data.mouseDown = true;
            
        });
        
        layer0.on('pointerup', (pointer)=>{
            player.setVelocity(0);  
            game.data.mouseDown = false;
        });

        const people = this.people.getChildren();
        let i_people = people.length;
        while(i_people--){
            const sprite = people[i_people];
            this.reSpawn(sprite);
        }
        
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
        this.createPeople();
        
        this.doorDisable = false;
        const startMap = 1;
        this.setupMap(startMap);
             
    }
    
    
    spritePathProcessor (sprite, v=200, min_d=8) {
    
        if(!sprite.data){
            return;
        }
        //const path = sprite.data.path;
        const path = sprite.getData('path')
        if(!path){
            return;
        }
        if(path.length > 0){
            const pos = path[0];
            const tx = pos.x * 16 + 8;
            const ty = pos.y * 16 + 8;
            const at_pos = sprite.x === tx && sprite.y === ty;
            if(at_pos){   
                //sprite.data.path = path.slice(1, pos.length);
                sprite.setData({path: path.slice(1, pos.length) })
            }
            if(!at_pos){
               let vx = 0, vy = 0;
               if(tx > sprite.x){ vx = v;     }
               if(tx < sprite.x){ vx = v * -1;}
               if(ty > sprite.y){ vy = v;     }
               if(ty < sprite.y){ vy = v * -1;}
               sprite.setVelocityX( vx );
               sprite.setVelocityY( vy );
               const d = Phaser.Math.Distance.Between(tx, ty, sprite.x, sprite.y);
               if(d <= min_d){
                   sprite.x = tx;
                   sprite.y = ty;
                   sprite.setVelocity(0);
               }  
            }
        }
    }
    

    
    update () {
    
        if(!this.data.mouseDown){
            this.player.setVelocity(0);
        }
        
        this.spritePathProcessor(this.player);
        
        const people = this.people.getChildren();
        let i_people = people.length;
        
        if(i_people < MAX_PEOPLE){
            this.spawn();
        }
        
        while(i_people--){
            const sprite = people[i_people];
            
            if(!sprite){
                console.log('well that is not good is it');
            }
            
            const tx = Math.floor(sprite.x / 16);
            const ty = Math.floor(sprite.y / 16);
            const tile = this.map.getTileAt(tx, ty, false, 0);
            if(!tile){
                console.log('no tile!?');
                this.reSpawn(sprite);
            }
            
            if(tile){
                if(tile.index != 1){
                    console.log('sprite is not over index 1 tile!');
                    this.reSpawn(sprite);
                }
            }
            
            
            this.spritePathProcessor( sprite, 50, 1);
            //if(sprite.data.path.length === 0){
            if(sprite.getData('path').length === 0 ){
                const pos = this.getRandomMapPos();
                this.setSpritePath(sprite, this.map, pos.x, pos.y);
            }
            
            
            
        }
        
        // keyboard movement
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
