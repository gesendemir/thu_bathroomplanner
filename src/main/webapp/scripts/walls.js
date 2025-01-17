// Wall array, defined here for scope.
let walls;

var room_layout_id = "roomLayout_2";

// a constant to distinguish layouts
const layouts = Object.freeze({
   "layout1": 1,
   "layout2": 2
});
let layout = layouts.layout1;


// a variable to display the area of a text
let area_text = new PIXI.Text("", {fontFamily: "Arial", fontSize : "22px", fontWeight: "normal"});

function onDragStart(event) {

   this.tint = 0x00FF00;
   // store a reference to the data
   // the reason for this is because of multitouch
   // we want to track the movement of this particular touch
   this.data = event.data;
   this.alpha = 0.5;
   this.dragging = true;
   this.usage = true;

}

function onDragEnd() {
   
   this.alpha = 1;
   this.tint = 0xFFFFFF;
   this.dragging = false;
   this.data = null;
   this.usage = false;

}

function onDragMove() {
   let move = true;
   
   if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      let attachedWalls = this.getAttachedWalls();
      attachedWalls.sort(function(a, b){return a.wallSprite.width - b.wallSprite.width; });
      if(this.horizontal){ //if this wall is horizontal
         
         for (let index = 0; index < attachedWalls.length; index++) {
            collisionWithObjects(this);
            const verticalWall = attachedWalls[index];
            if(!verticalWall.horizontal){ //move & resize the vertical walls,
               if(newPosition.y - this.y != 0 ){
                  if(newPosition.y < this.y && newPosition.y - this.y > -75){ //If sprite moved upwards
                     //if anchor sprite is below the walls
                  if(verticalWall.wallSprite.y < this.y){
                        //decrease the length
                        if(verticalWall.wallSprite.width < 50){
                           move = false;
                           break;
                        }
                        
                           verticalWall.wallSprite.width -= this.y - newPosition.y ;
                        
                    //    verticalWall.wallSprite.text.y -= this.y - newPosition.y;
                  //if it is above the walls move the walls upwards and increase the length
                  }else if(verticalWall.wallSprite.y >= this.y){
                     verticalWall.wallSprite.y -=  this.y  - newPosition.y;
                     verticalWall.wallSprite.width += this.y - newPosition.y;
                  }

               }else if(newPosition.y > this.y && newPosition.y - this.y < 75){ //if the anchor sprite moved downwards
                  //if anchor is below the walls
                  if(verticalWall.wallSprite.y < this.y){
                     //increase the size
                     verticalWall.wallSprite.width += newPosition.y - this.y ;
                    // verticalWall.wallSprite.text.y += newPosition.y - this.y;
                  }else if(verticalWall.wallSprite.y >= this.y){ //if the anchor lines are above the walls
                     //move the walls downwards and decrease the size
                     if( verticalWall.wallSprite.width < 50 ){ move = false; break; }
                     
                     verticalWall.wallSprite.y += newPosition.y - this.y;
                     //  console.log(verticalWall.wallSprite.text.;
                      // verticalWall.wallSprite.text.y += newPosition.y - this.y;
                       verticalWall.wallSprite.width -= newPosition.y - this.y ;

                  
                  }

               }
               else{
                  move = false;
               }
               }
               verticalWall.wallSprite.text.y = (verticalWall.wallSprite.width / 2) + verticalWall.wallSprite.y;
               verticalWall.wallSprite.text.text = ((verticalWall.wallSprite.width/cm)  /scale/100).toFixed(2)  + " m";
            }
            
         }
         
         
         if(move){

            this.y = newPosition.y;
            this.text.y = this.y - 25;
            //this.sprite.y = newPosition.y;
         
         }
      }
      if(!(this.horizontal)){ //if this wall is vertical
         let move = true;
         for (let index = 0; index < attachedWalls.length; index++) {
            collisionWithObjects(this);
         const horizontalWall = attachedWalls[index];
            //move and resize horizontal walls
            if(horizontalWall.horizontal){
               //If moved on x
               if (newPosition.x - this.x != 0) {
                  //if moved to the left
                  if (newPosition.x - this.x < 0 && newPosition.x - this.x  > -75) {
                     //if selected anchor is on the left side of horizontal walls
                     if (this.x <= horizontalWall.wallSprite.x ) {
                       
                        //Move horizontal walls to the left and increase their size
                        horizontalWall.wallSprite.x -= this.x - newPosition.x;
                        horizontalWall.wallSprite.width += this.x - newPosition.x; //+ test;
                     }//if selected anchor is on the right side of horizontal walls
                     else if((this.x > horizontalWall.wallSprite.x )){
                        //decrease size
                        if(horizontalWall.wallSprite.width < 50){ move = false; break;}
                        if(move){

                           horizontalWall.wallSprite.width -= this.x - newPosition.x;
                        }
                     }
                  }//If selected anchor moved to the right
                  else if (newPosition.x - this.x > 0 && newPosition.x - this.x  < 75)  {
                     //if selected anchor is on the left side of horizontal walls
                     if (this.x <= horizontalWall.wallSprite.x ) {
                        if(horizontalWall.wallSprite.width < 50){ move = false; break; }
                        if(move){
                        //Move horizontal walls to the right and decrease their size
                        horizontalWall.wallSprite.x += newPosition.x - this.x;
                        horizontalWall.wallSprite.width -= newPosition.x - this.x; //+ test;
                     }
                     }//if selected anchor is on the right side of horizontal walls
                     else if((this.x > horizontalWall.wallSprite.x )){
                        //decrease size
                       
                        horizontalWall.wallSprite.width += newPosition.x - this.x;
                        
                     }
                  }else{
                     move = false;
                  }
               }
            }
            horizontalWall.wallSprite.text.x = (horizontalWall.wallSprite.width / 2) + horizontalWall.wallSprite.x;
            horizontalWall.wallSprite.text.text = ((horizontalWall.wallSprite.width/cm) /scale/100).toFixed(2)  + " m";
         }
         if(move){
         this.x = newPosition.x ;
         this.text.x = this.x + 10;
         //this.sprite.x = newPosition.x;
         }
      }
      // display the area of the room
      displayArea(layout);
   }
}


function onOver(event){
   this.visible = false;
}

// a constructor for the wall
function wall(x,y, height, width, horizontal){
   this.x = x;
   this.y = y;

   this.height = height;
   this.width = width;
   let phics = new PIXI.Graphics();
   //Draw rectangle for wall.
   phics.beginFill(0x00);
   phics.drawRect(0, 0, height, width);
   phics.endFill();

   //Convert it to Sprite.
   let ren = new PIXI.AbstractRenderer();
   let tex = app.renderer.generateTexture(phics);
   let wallSprite = new PIXI.Sprite(tex);
   this.wallSprite = wallSprite;
   wallSprite.x = x;
   wallSprite.y = y;
   wallSprite.interactive = true;

   this.wallSprite.attached = [];
   this.wallSprite.horizontal = horizontal;
   this.horizontal = horizontal;
   let text = new PIXI.Text(((height/cm) / scale/100).toFixed(2)  + " m", {fontSize : "12px"});
   text.x = x + (height /2) ;// + width/2 - 10;
   text.y = y - 25;
   if(!horizontal){
      wallSprite.rotation = (Math.PI/180) *90;
      text.x = x + 10;
      text.y = y + (height / 2);
   }
   wallSprite.text = text;

   app.stage.addChild(wallSprite.text);

   wallSprite.on('pointerdown', onDragStart)
   .on('pointerup', onDragEnd)
   .on('pointerupoutside', onDragEnd)
   .on('pointermove', onDragMove);

   app.stage.addChild(wallSprite);

   this.setText = function(text){
      this.wallSprite.text = text;
   }

   this.attachWall = function(wall){
      this.wallSprite.attached.push(wall);
   }
   this.wallSprite.getAttachedWalls = function(){
      return this.attached;
   }
   
   this.wallSprite.toString = () => {
      return `{ "x": ${this.wallSprite.x}, "y":${this.wallSprite.y}, "height": ${this.wallSprite.width} , "width":${this.width}, "horizontal": ${this.horizontal} }`;
   }
}


function collisionWithObjects(wallSprite){
   let wallData = wallSprite.getBounds();
   for (let index = 0; index < sprites.length; index++) {
      let proData = sprites[index].getBounds();
      if(wallData.x < proData.x + proData.width &&
         wallData.x + wallData.width > proData.x &&
         wallData.y < proData.y + proData.height &&
         wallData.y + wallData.height > proData.y){
            sprites[index].tint = 0xff00000;
            return true;
         }else{
            sprites[index].tint = 0xffffff;
         }
      
   }
   return false;

}

function drawroomLayout_1(){

   // set the layout choice
   layout = layouts.layout1;

   //top
   let wall1 = new wall(100, 100, 400, cm/2, true);
   //right
   let wall2 = new wall(500 + (cm/2), 100, 400, cm/2, false);
   wall2.attachWall(wall1);
   wall1.attachWall(wall2);

   //bottom
   let wall3 = new wall(100, 500 - (cm/2), 400, cm/2, true);
   wall3.attachWall(wall2);
   wall2.attachWall(wall3);

   //left
   let wall4 = new wall(100,  100, 400, cm/2, false);
   wall4.attachWall(wall1);
   wall4.attachWall(wall3);

   wall1.attachWall(wall4);
   wall3.attachWall(wall4);
   walls = [wall1, wall2, wall3, wall4];

   // display the area of the room
   displayArea(layout);
}

function drawroomLayout_2(){

   // set the layout choice
   layout = layouts.layout2;

   //top
   let wall1 = new wall(100, 100, 600, cm/2, true);

   //right
   let wall2 = new wall(700 + (cm/2), 100, 400, cm/2, false);
   
   wall1.attachWall(wall2);

   //bottom
   let wall3 = new wall(100, 700 - (cm/2), 400, cm/2, true);
   //left
   let wall4 = new wall(100,  100, 600, cm/2, false);
   
   wall4.attachWall(wall3);
   wall4.attachWall(wall1);
   wall1.attachWall(wall4);
   //bottom middle: small horizontal wall
   let wall5 = new wall(500 + (cm/2),  500, 200, cm/2, true);
   wall5.attachWall(wall2);
   wall2.attachWall(wall5);
   wall2.attachWall(wall1);
   //right middle: small vertical wall
   let wall6 = new wall(500 + (cm/2),  500, 200, cm/2, false);

   wall6.attachWall(wall5);

   wall6.attachWall(wall3);

   wall3.attachWall(wall6);
   wall3.attachWall(wall4);
   wall5.attachWall(wall6);
   walls = [wall1, wall2, wall3, wall4, wall5, wall6];

   // display the area
   displayArea(layout);
}

function getWalls(){
   return walls;
}

// a function to display the area of the bathroom at the center of the  bathroom
function displayArea(layout){
    if(walls.length == 4 || walls.length == 6){
        // coordinates of the text to be displayed in the center of the room
        let x = ((walls[0].wallSprite.x)) + (((walls[0].wallSprite.width))/2) - 2 * cm;
        let y = (((walls[0].wallSprite.y)) + ((walls[3].wallSprite.width))/2) - (cm/2);
        // dimensions of the room
        let width = (((walls[0].wallSprite.width)/cm)/scale).toFixed(2);
        let length = (((walls[3].wallSprite.width)/cm)/scale).toFixed(2);

        let area;
        if(layout == layouts.layout1){
            // calculate the area
            area = (width * length * (1/10000)).toFixed(2);
        }
        else if(layout == layouts.layout2){
            // other dimensions
            let small_width = (((walls[4].wallSprite.width)/cm)/scale).toFixed(2);
            let small_length = (((walls[5].wallSprite.width)/cm)/scale).toFixed(2);
            area = ((width * length * (1/10000)).toFixed(2) - (small_width * small_length * (1/10000)).toFixed(2)).toFixed(2);
        }
        // set the area to be displayed
        area_text.text = ("Area: " + area + " \u33A1");
        // set position of the text
        area_text.position.set(x,y);
        // display message
        app.stage.addChild(area_text);
   }
}

// draw the second layout
drawroomLayout_2();

$(".roomLayout").on('click', function(event){
   //event.stopPropagation();
   selectTool.unselect();
   if(sprites.length > 0){
      sprites.forEach(element => {
         element.destroy();
      });
      sprites = [];
   }
   if(walls.length != 0){
      walls.forEach(element => {
         element.wallSprite.destroy();
         element.wallSprite.text.destroy();
      });
   }
   let func = "draw" + event.target.id + "();";
   room_layout_id = event.target.id;
   eval(func);
});


// a method to attached walls from the cookie: the parameter is an array of walls
function attach_walls(the_walls){
     // first layout
    if(the_walls.length == 4){
         // store the walls in their global variable
         walls = the_walls;
         // attach the top wall and the right wall
         walls[1].attachWall(walls[0]);
         walls[0].attachWall(walls[1]);
         // attach the bottom wall and the right wall
         walls[2].attachWall(walls[1]);
         walls[1].attachWall(walls[2]);
         // attach the left wall and the top wall
         walls[3].attachWall(walls[0]);
         walls[0].attachWall(walls[3]);
         // attach the left wall and the bottom wall
         walls[3].attachWall(walls[2]);
         walls[2].attachWall(walls[3]);
         // display the area
         layout = layouts.layout1;
         displayArea(layout);
    }
    // second layout
    else if(the_walls.length == 6){
         // store the walls in their global variable
         walls = the_walls;
         // attach the top wall and the right wall
         walls[0].attachWall(walls[1]);
         walls[1].attachWall(walls[0]);
         // attach the left wall and the bottom wall
         walls[3].attachWall(walls[2]);
         walls[2].attachWall(walls[3]);
         // attach the left wall and the top wall
         walls[3].attachWall(walls[0]);
         walls[0].attachWall(walls[3]);
         // attach the small horizontal wall to the right wall
         walls[4].attachWall(walls[1]);
         walls[1].attachWall(walls[4]);
         // attach the small vertical wall and the small horizontal wall
         walls[5].attachWall(walls[4]);
         walls[4].attachWall(walls[5]);
         // attach the small vertical wall and the right wall
         walls[5].attachWall(walls[2]);
         walls[2].attachWall(walls[5]);
         // display the area
         layout = layouts.layout2;
         displayArea(layout);
    }
}