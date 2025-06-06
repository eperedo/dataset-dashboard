import { ProjectSection } from "$/domain/entities/ProjectSection";
import { Id } from "$/domain/entities/Ref";
import { Struct } from "$/domain/entities/generic/Struct";
import { Maybe } from "$/utils/ts-utils";
import _ from "$/domain/entities/generic/Collection";

type ProjectDashboardAttrs = {
    id: Id;
    name: string;
    code: Maybe<string>;
    status: string;
    branchId: Id;
    periodType: string;
    period: string;
    sections: ProjectSection[];
};

export class ProjectDashboard extends Struct<ProjectDashboardAttrs>() {
    get progress(): number {
        const sectionProgresses = this.sections.map(section => section.progress);
        const count = sectionProgresses.length;

        if (count === 0) return 0;

        const total = _(sectionProgresses).sum();
        return total / count;
    }
}
