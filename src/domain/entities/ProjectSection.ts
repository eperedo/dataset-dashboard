import { Item } from "$/domain/entities/Item";
import { Id } from "$/domain/entities/Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";
import _ from "$/domain/entities/generic/Collection";

type ProjectSectionAttrs = {
    id: Id;
    name: string;
    code: Maybe<string>;
    items: Item[];
};

export class ProjectSection extends Struct<ProjectSectionAttrs>() {
    get progress(): number {
        const itemProgresses = this.items.map(item => item.progress);
        const count = itemProgresses.length;

        if (count === 0) return 0;

        const total = _(itemProgresses).sum();
        return total / count;
    }

    get completed(): boolean {
        return this.progress === 100;
    }
}
