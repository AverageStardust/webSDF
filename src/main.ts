import { Matrix3 } from "./matrix3";
import { SmoothUnion } from "./compound";
import { Material } from "./material";
import { Box, Sphere } from "./primative";
import { Rotate, Translate } from "./transform";
import { Mat3Uniform } from "./value";
import { Vector3 } from "./vector3";
import { Controller } from "./controller";

const controller = new Controller({
    start: (world) => {
        const state = {
            rotation: new Mat3Uniform(Matrix3.identity())
        }

        world.camera.fov = 120;

        const red = new Material(new Vector3(0.7, 0, 0), new Vector3(0.1));
        const green = new Material(new Vector3(0.05), new Vector3(0.6, 0.7, 0.9));

        world.field =
            new Translate(new Vector3(0, 0, -5),
                new Rotate(state.rotation,
                    new SmoothUnion(0.1,
                        new Translate(new Vector3(-0.45, 0, 0),
                            new Box(new Vector3(0.4, 1.2, 0.4), red)),
                        new Translate(new Vector3(0.45, 0, 0),
                            new Sphere(0.6, green))
                    )));

        return state;
    },

    frame: (_world, state, time, _delta) => {
        state.rotation.setValue(Matrix3.rotateY(time * 0.001));
    }
});

controller.start();