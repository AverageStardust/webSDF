import { Matrix3 } from "./matrix3";
import { Vector3 } from "./vector3";

export class Camera {
    position = Vector3.zero();
    roll = 0;
    pitch = 0;
    nearPlane: number;
    farPlane: number;
    fov: number;

    constructor(fov = 70, nearPlane = 0.1, farPlane = 10000) {
        this.fov = fov;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
    }

    get rotation(): Matrix3 {
        return Matrix3.rotateY(this.roll).mult(Matrix3.rotateX(this.pitch));
    }

    getViewport(screenWidth: number, screenHeight: number): [number, number] {
        const angle = this.fov / 360 * Math.PI;
        const viewportWidth = Math.tan(angle) * this.nearPlane * 2;
        const viewportHeight = viewportWidth / screenWidth * screenHeight;

        return [viewportWidth, viewportHeight];
    }

    look(deltaRoll: number, deltaPitch: number) {
        this.roll += deltaRoll;
        const halfPI = Math.PI * 0.5;
        this.pitch = Math.max(-halfPI, Math.min(halfPI, this.pitch + deltaPitch));
    }
}