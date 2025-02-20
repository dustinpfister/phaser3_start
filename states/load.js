class Load extends Phaser.Scene {

    preload(){
    
        this.load.setBaseURL('./');
        
                this.load.plugin('RandomNamePlugin', 'plugins/rnd_name.js', true);
                
                this.load.plugin('PathFinderPlugin', 'plugins/pathfinding.js', true)
                
        
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        this.load.json('map1_data', 'maps/map1_data.json');
        this.load.tilemapCSV('map1', 'maps/map1.csv');
        
        this.load.json('map2_data', 'maps/map2_data.json');
        this.load.tilemapCSV('map2', 'maps/map2.csv');
        
        this.load.json('map3_data', 'maps/map3_data.json');
        this.load.tilemapCSV('map3', 'maps/map3.csv');
        

    

    
    this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
    
        console.log(progress)
    })
    
    console.log('loading');
    console.log(Phaser.Loader.Events)
    
    }
    
    create () {
    
        const pathFinder = this.plugins.get('PathFinderPlugin');
        
        console.log(pathFinder);
    
        this.scene.start('World');
              
    }

}

export {
    Load
}

