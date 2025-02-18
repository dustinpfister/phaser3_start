class Load extends Phaser.Scene {

    preload(){
    
        this.load.setBaseURL('./');
        
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        this.load.json('map1_data', 'maps/map1_data.json');
        this.load.tilemapCSV('map1', 'maps/map1.csv');
        
        this.load.json('map2_data', 'maps/map2_data.json');
        this.load.tilemapCSV('map2', 'maps/map2.csv');
        
        this.load.json('map3_data', 'maps/map3_data.json');
        this.load.tilemapCSV('map3', 'maps/map3.csv');
    
    }
    
    create () {
    
        this.scene.start('World');
              
    }

}

export {
    Load
}

