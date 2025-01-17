/* Script which processes free rotation with the help of FreeTransformTool*/

// Global variables and constants
var start_position;
var end_position;
var start_angle;
var end_angle;
var delta_angle = 0;
var collision = false;
const NEGATION = -1;

// Function which checks if the rotation ended with a collision
function rotation_update(){

    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {
            if(check_for_rotation_collision(sprite, (delta_angle*NEGATION))){
                collision = true;
                sprites[sprite].tint = 0xddddff;
            }
            else {
                // No collision
                collision = false;
                
                // Reverse the delta from the PixiJS value (so that it matches the trigonometrical value)
                delta_angle *= NEGATION; 
                
                // Update the angle of the sprite
                sprites[sprite].rad_angle += delta_angle;
                if(Math.cos(sprites[sprite].rad_angle) == 1){
                    sprites[sprite].rad_angle = 0;
                }

                update_coordinates(sprites[sprite].rad_angle, sprite);
            }
            break;
        }
    }
}

// Function which checks detects collision: returns true if there is collision and false if there is not
// sprite_position: position at which the sprite that is being rotated can be found in the list of sprites
// angle: angle at which the rotation currently is or has stopped at
function check_for_rotation_collision(sprite_position, angle){

    let half_width = sprites[sprite_position].width / 2;
    let half_height = sprites[sprite_position].height / 2;
    let coords = calculate_coordinates(angle, half_width, half_height, sprites[sprite_position].x, sprites[sprite_position].y);
    let coordinates = [[coords.x1, coords.y1], [coords.x2, coords.y2], [coords.x3, coords.y3], [coords.x4, coords.y4]];

    for(let sprite_iter = 0; sprite_iter < sprites.length; ++sprite_iter){

        // The sprite cannot collide with itself
        if(sprites[sprite_iter].id != sprites[sprite_position].id){

            // Create a polygon using the coordinates of this sprite
            let polygon = [[sprites[sprite_iter].coords.x1, sprites[sprite_iter].coords.y1],[sprites[sprite_iter].coords.x2, sprites[sprite_iter].coords.y2],
            [sprites[sprite_iter].coords.x3, sprites[sprite_iter].coords.y3], [sprites[sprite_iter].coords.x4, sprites[sprite_iter].coords.y4]];
            
            // Check now if the sprite to be rotated would collide with this sprite
            // Check if a coordinate of this sprite would be in the rotated sprite
            for(let polygon_iter=0; polygon_iter < polygon.length; ++polygon_iter){
                if(detect_collision(polygon[polygon_iter], coordinates)){
                    // Rotation is not permitted
                    return true;
                }
            }

            // Check if a coordinates of the rotated sprite would land in this sprite
            for(let coordinates_iter=0; coordinates_iter < coordinates.length; ++coordinates_iter){                   
                if(detect_collision(coordinates[coordinates_iter], polygon)){
                    // Rotation is not permitted
                    return true;
                }
            }
        }
    }    
    // Validate the rotation
    return false;
}


// Function which checks for collisions every tick of rotation
function check_for_collisions_while_rotating(){
       
    var sprite;
    for (sprite = 0; sprite < sprites.length; ++sprite) {

        if (sprite_id == sprites[sprite].id) {

            // Paint the product and the rotation tool on top of the canvas
            app.stage.addChild(sprites[sprite]);
            app.stage.addChild(tool);
            tool.addChild(selectTool);

            if(check_for_rotation_collision(sprite, (delta_angle*NEGATION))){
                               
                sprites[sprite].tint = collision_color;

            }
            else {
                sprites[sprite].tint = white_color;
            }
            break;
        }
    }

}