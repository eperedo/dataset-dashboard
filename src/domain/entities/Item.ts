import { Id } from "$/domain/entities/Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";

type ItemAttrs = {
    id: Id;
    name: string;
    code: Maybe<string>;
    possibleResponsesCount: number;
    responsesCount: number;
};

export class Item extends Struct<ItemAttrs>() {
    get progress(): number {
        const { possibleResponsesCount, responsesCount } = this;

        if (possibleResponsesCount <= 0) return 0;

        return (responsesCount / possibleResponsesCount) * 100;
    }
}
