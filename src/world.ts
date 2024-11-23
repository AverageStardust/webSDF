import { Camera } from "./camera";
import { AbstractSdf } from "./sdf";
import { EmptySdf } from "./sdfPrimative";

export class World {
    camera = new Camera();
    sdf: AbstractSdf = new EmptySdf();
}