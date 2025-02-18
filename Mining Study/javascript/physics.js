// Import the required modules and classes.
import Component from './component.js';
import Renderer from './renderer.js';
import Platform from '../game/platform.js';

// The Physics class extends Component and handles the physics behavior of a game object.
class Physics extends Component {
  // The constructor initializes the physics component with optional initial velocity, acceleration, gravity, and weather or not it is a platform.
  constructor(velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }, gravity = { x: 0, y: 5 }, isOnPlatform = false) {
    super(); // Call the parent constructor.
    this.velocity = velocity; // Initialize the velocity.
    this.acceleration = acceleration; // Initialize the acceleration.
    this.gravity = gravity; // Initialize the gravity.
    this.isOnPlatform = isOnPlatform; // Initialize isOnPlatform.
  }

  // The update method handles how the component's state changes over time.
  update(deltaTime) {
    // Update velocity based on acceleration and gravity.
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += (this.acceleration.y + this.gravity.y) * deltaTime;
    // move the game object and check for collisions.
    this.moveAndCheckCollision('x');
    this.moveAndCheckCollision('y');
  }

  // The isColliding method checks if this game object is colliding with another game object.
  isColliding(otherPhysics) {
    // Get the bounding boxes of both game objects.
    const [left, right, top, bottom] = this.getBoundingBox();
    const [otherLeft, otherRight, otherTop, otherBottom] = otherPhysics.getBoundingBox();

    // Check if the bounding boxes overlap. If they do, return true. If not, return false.
    return left < otherRight && right > otherLeft && top < otherBottom && bottom > otherTop;
  }

  // The getBoundingBox method returns the bounding box of the game object in terms of its left, right, top, and bottom edges.
  getBoundingBox() {
    // Get the Renderer component of the game object to get its width and height.
    const renderer = this.gameObject.getComponent(Renderer);
    // Calculate the left, right, top, and bottom edges of the bounding box.
    const left = this.gameObject.x;
    const right = this.gameObject.x + renderer.width;
    const top = this.gameObject.y;
    const bottom = this.gameObject.y + renderer.height;

    // Return the bounding box.
    return [left, right, top, bottom];
  }

  // Following method is mostly written by copilot
  // Method to move the game object and check for collisions.
  moveAndCheckCollision(axis) {
    // keep tack of the old position of the game object so it can be moved back in case of collision.
    let oldPosition = this.gameObject[axis];
    // get all the platforms in the game.
    const platforms = this.gameObject.game.gameObjects.filter((obj) => obj instanceof Platform);
    this.isOnPlatform = false;
    // move the game object one axis position at a time, for a number of times qual to velocity and check for collisions.
    for(let i = 0; i < Math.abs(this.velocity[axis]); i++) {
      // increase or decrease posiotion by one depending on direction.
      this.gameObject[axis] += Math.sign(this.velocity[axis]);
      // check for collisions with all the platforms.
      for(const platform of platforms) {
        const physics = platform.getComponent(Physics);
        // if there is collsion set the character back to their old position.
        if(physics.isColliding(this)) {
          this.gameObject[axis] = oldPosition;
          // stop velocity on this axis if there was collsiion
          this.velocity[axis] = 0;
          // if the axis is y and the velocity is positive, the player is on a platform.
          if(axis === 'y' && this.velocity[axis] >= 0) {
            const playerBottom = this.gameObject.y + this.gameObject.getComponent(Renderer).height;
            const platformTop = platform.y;
            if(playerBottom <= platformTop) {
              this.isOnPlatform = true;
            }
          }
          // stop the loop after a collision is detected.
          break;
        }
      }
      // update the old position for next loop.
      oldPosition = this.gameObject[axis];
    }
  }
}

// The Physics class is then exported as the default export of this module.
export default Physics;