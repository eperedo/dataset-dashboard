import { Id } from "$/domain/entities/Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";

export type ProjectAttrs = {
    id: Id;
    name: string;
    code: Maybe<string>;
};

export class Project extends Struct<ProjectAttrs>() {}
