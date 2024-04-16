"# Assessment-1" 
# Assessment -> 1 

## Task - 1  : To create a cube, cylinder, and icosphere using the Three.js library 

Basic HTML document with a Three.js canvas element and includes a JavaScript file to handle the Three.js code. In the JavaScript file, it creates a scene, camera, and renderer, then creates a cube, cylinder, and icosphere with their respective geometries and materials. Finally, it sets the camera position, sets up a render loop to continuously render the scene, and animates the objects by rotating them.

It also adds a GUI interface using dat.GUI to adjust the dimensions of these shapes. The parameters for the cube, cylinder, and icosphere are added to the GUI, and onChange events are attached to each parameter to update the shapes when their values change.

## Task - 2 : Once an object is selected, the camera should animate towards the front of the object, zooming in precisely until the object fills most of the screen. You can select any axis as the front view.

We imported the TWEEN library to handle the tween animations.
The animateCamera function calculates the target position and rotation of the camera based on the selected object's position and size.
When the cube is clicked, the animateCamera function is called to animate the camera towards the front of the cube.
The TWEEN.update() function is called in the render loop to update the tween animations.
With this setup, when you click on the cube, the camera smoothly animates towards the front of the cube. Adjust the duration and easing function as needed for your desired effect.