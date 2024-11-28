import { SmoothUnion, Union } from "./compound";
import { Material } from "./material";
import { Box, Cylinder, Torus } from "./primative";
import { RepetitionMirrored, Round, Translate } from "./transform";
import { Vector3 } from "./vector3";
import { Controller } from "./controller";

const controller = new Controller({
    start: (world) => {
        world.camera.fov = 80;
        world.camera.roll = -1.3;
        world.camera.pitch = -0.3;
        world.camera.position = new Vector3(-7.5, 6.5, 4.0);

        const porcelain = new Material(new Vector3(0.7, 0.7, 0.65), new Vector3(0.15));
        const metal = new Material(new Vector3(0.1, 0.1, 0.2), new Vector3(0.6, 0.7, 0.7));

        world.field =
            new RepetitionMirrored(new Vector3(5.0),
                new Union(
                    new Translate(new Vector3(-0.75, 0.75, -0.1),
                        new Box(new Vector3(0.05, 0.05, 0.2), metal)),
                    new SmoothUnion(0.1,
                        new Translate(new Vector3(0, 0, -0.4),
                            new Round(0.1,
                                new Box(new Vector3(0.6, 1, 0.3), porcelain))),
                        new SmoothUnion(0.3,
                            new Translate(new Vector3(0, 0, 0.4),
                                new Torus(0.7, 0.2, porcelain)),
                            new SmoothUnion(0.4,
                                new Translate(new Vector3(0, -0.3, 0.4),
                                    new Torus(0.5, 0.2, porcelain)),
                                new Translate(new Vector3(0, -0.55, 0.3),
                                    new Round(0.1,
                                        new Cylinder(0.4, 0.35, porcelain)
                                    )))))));

        return {};
    }
});

controller.start();