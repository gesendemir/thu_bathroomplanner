/**
 * A script used to reset the canvas
 */

const ROOM_LAYOUT1 = "roomLayout_1";
const ROOM_LAYOUT2 = "roomLayout_2";

// Handler - Reset button on the toolbar
$("#btn-reset-plan").on('click', function(event){
    reset_plan();
});

//Function which first destroys walls and products on the canvas and then redraws the canvas
function reset_plan(){
    destroy_everything();
    // clear the display for dimensions using an invalid id
    update_properties(-1);
    if (room_layout_id == ROOM_LAYOUT1){
        drawroomLayout_1();
        setCookies();
    }
    if (room_layout_id == ROOM_LAYOUT2){
        drawroomLayout_2();
        setCookies();
    }
}

//Function which destroys every wall and product on the canvas
function destroy_everything(){
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
}


