package sk.uniza.fri.game.purchasables.weapons.projectiles;

import sk.uniza.fri.game.ImageObject;
import sk.uniza.fri.game.Game;
import sk.uniza.fri.game.enemies.Enemy;
import sk.uniza.fri.game.purchasables.weapons.Weapon;

/**
 * Represents a homing projectile that follows the target.
 *
 * @author Adrian Licko, Copilot
 * @version 1.0
 * @since 1.0
 */
public class HomingProjectile extends Projectile {
    private final int speed;
    private double angle;
    private ImageObject target;
    private final boolean isFiredByDome;
    private int initialMoves;
    private double dirX;
    private double dirY;
    private boolean isFiredDuringEnemyWasAlive;

    /**
     * Constructor for the HomingProjectile class.
     * Represents a homing projectile that is shot from enemy and follows the target Dome.
     *
     * @param x - Integer value representing the x coordinate of the projectile.
     * @param y - Integer value representing the y coordinate of the projectile.
     * @param damage - Integer value representing the damage that the projectile deals.
     * @param directoryPath - String value representing the directory path of the projectile images.
     * @param projectileWidth - Integer value representing the width of the projectile image.
     * @param projectileHeight - Integer value representing the height of the projectile image.
     * @param target - ImageObject object representing the target that the projectile will follow.
     * @param speed - Integer value representing the speed of the projectile.
     */
    public HomingProjectile(int x, int y, int damage, String directoryPath, int projectileWidth, int projectileHeight, ImageObject target, int speed) {
        super(x, y, damage, directoryPath, projectileWidth, projectileHeight);
        this.speed = speed;
        this.target = target;
        this.isFiredByDome = false;
    }

    /**
     * Constructor for the HomingProjectile class.
     * Represents a homing projectile that is shot from the Dome and follows the target Enemy.
     *
     * @param x - Integer value representing the x coordinate of the projectile.
     * @param y - Integer value representing the y coordinate of the projectile.
     * @param damage - Integer value representing the damage that the projectile deals.
     * @param directoryPath - String value representing the directory path of the projectile images.
     * @param projectileWidth - Integer value representing the width of the projectile image.
     * @param projectileHeight - Integer value representing the height of the projectile image.
     * @param weapon - Weapon object representing the weapon that the projectile is shot from. Needed for the angle that the projectile will move in.
     * @param speed - Integer value representing the speed of the projectile.
     */
    public HomingProjectile(int x, int y, int damage, String directoryPath, int projectileWidth, int projectileHeight, Weapon weapon, int speed) {
        super(x, y, damage, directoryPath, projectileWidth, projectileHeight);
        this.speed = speed;
        if (weapon.isReversed()) {
            this.angle = Math.toRadians(180) + Math.toRadians(weapon.getAngle());
        } else {
            this.angle = Math.toRadians(weapon.getAngle());
        }
        this.isFiredByDome = true;
        this.initialMoves = 5;
    }

    /**
     * Method that calculates the direction vector from the projectile to the target and normalizes it.
     */
    private void calculateDirectionVector() {
        // Calculate the direction vector from the projectile to the target
        this.dirX = this.target.getHitX() - this.getProjectileImage().getHitX();
        this.dirY = this.target.getHitY() - this.getProjectileImage().getHitY();

        // Normalize the direction vector
        double length = Math.sqrt(this.dirX * this.dirX + this.dirY * this.dirY);
        this.dirX /= length;
        this.dirY /= length;
    }

    /**
     * Method that moves the projectile in the direction of the target.
     */
    private void moveInDirection() {
        // Move the projectile in the direction of the target
        this.getProjectileImage().addX((int)(this.dirX * this.speed));
        this.getProjectileImage().addY((int)(this.dirY * this.speed));
    }

    /**
     * Method that moves the projectile.
     * If the projectile is fired by the Dome, it moves like a DirectProjectile for the first 5 moves. After that, it moves like a HomingProjectile.
     * If the projectile is fired by the Enemy, it moves like a HomingProjectile.
     * If the projectile is fired by the Dome and there are no enemies alive, it moves like a DirectProjectile.
     * Written with the help of copilot.
     */
    @Override
    public void move() {
        if (this.isFiredByDome) {
            if (this.initialMoves > 0) {
                this.isFiredDuringEnemyWasAlive = !Game.getInstance().getEnemies().isEmpty();

                // Move like a DirectProjectile
                this.getProjectileImage().addX((int)(this.speed * Math.cos(this.angle)));
                this.getProjectileImage().addY((int)(this.speed * Math.sin(this.angle)));
                this.initialMoves--;
            } else if (!this.isFiredDuringEnemyWasAlive) {
                this.getProjectileImage().addX((int)(this.speed * Math.cos(this.angle)));
                this.getProjectileImage().addY((int)(this.speed * Math.sin(this.angle)));
            } else {
                // Move like a HomingProjectile
                Enemy closestEnemy = null;
                for (Enemy enemy : Game.getInstance().getEnemies()) {
                    if (closestEnemy == null) {
                        closestEnemy = enemy;
                    } else {
                        if (Math.sqrt(Math.pow(this.getProjectileImage().getHitX() - enemy.getEnemyImage().getHitX(), 2) + Math.pow(this.getProjectileImage().getHitY() - enemy.getEnemyImage().getHitY(), 2)) <
                                Math.sqrt(Math.pow(this.getProjectileImage().getHitX() - closestEnemy.getEnemyImage().getHitX(), 2) + Math.pow(this.getProjectileImage().getHitY() - closestEnemy.getEnemyImage().getHitY(), 2))) {
                            closestEnemy = enemy;
                        }
                    }
                }
                if (closestEnemy != null) {
                    this.target = closestEnemy.getEnemyImage();
                } else {
                    this.moveInDirection();
                    this.updateProjectile();
                    return;
                }

                this.calculateDirectionVector();
                this.moveInDirection();
            }
        } else {
            this.calculateDirectionVector();
            this.moveInDirection();
        }

        this.updateProjectile();
    }

    /**
     * Method that updates the image and position of the projectile.
     */
    private void updateProjectile() {
        // Update the image and position of the projectile
        this.getProjectileImage().changeImage(this.getImageLoader().getNextImage());
        this.getProjectileImage().changePosition(this.getProjectileImage().getX(), this.getProjectileImage().getY());
    }
}