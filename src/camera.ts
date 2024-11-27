import { Matrix3 } from "./matrix3";
import { Vector3 } from "./vector3";

export class Camera {
    position = Vector3.zero();
    roll = 0;
    pitch = 0;
    nearRadius: number;
    farRadius: number;
    fov: number;

    constructor(fov = 70, nearRadius = 0.1, farRadius = 500) {
        this.fov = fov;
        this.nearRadius = nearRadius;
        this.farRadius = farRadius;
    }

    get rotation(): Matrix3 {
        return Matrix3.rotateY(this.roll).mult(Matrix3.rotateX(this.pitch));
    }

    getViewport(screenWidth: number, screenHeight: number): [number, number] {
        const angle = this.fov / 360 * Math.PI;
        const viewportWidth = Math.tan(angle) * this.nearRadius * 2;
        const viewportHeight = viewportWidth / screenWidth * screenHeight;

        return [viewportWidth, viewportHeight];
    }

    look(deltaRoll: number, deltaPitch: number) {
        this.roll += deltaRoll;
        const halfPI = Math.PI * 0.5;
        this.pitch = Math.max(-halfPI, Math.min(halfPI, this.pitch + deltaPitch));
    }

    move(movement: Vector3) {
        this.position.add(movement.clone.matrixMult(this.rotation));
    }
}