import { Camera } from "./camera";
import { AbstractSdf } from "./sdf";
import { Empty } from "./sdfPrimative";

export class World {
    camera = new Camera();
    sdf: AbstractSdf = new Empty();
}