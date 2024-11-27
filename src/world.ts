import { Camera } from "./camera";
import { AbstractField } from "./field";
import { Empty } from "./primative";

export class World {
    camera = new Camera();
    field: AbstractField = new Empty();
}