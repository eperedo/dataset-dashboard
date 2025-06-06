import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/domain/entities/generic/Future";
import { Maybe } from "$/utils/ts-utils";

export type ProjectDashboardRepository = {
    getBy(options: GetByProjectDashboardOptions): FutureData<ProjectDashboard>;
};

export type GetByProjectDashboardOptions = { id: Id; period: Maybe<string>; branchId: Maybe<Id> };
