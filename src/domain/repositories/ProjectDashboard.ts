import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/domain/entities/generic/Future";

export type ProjectDashboardRepository = {
    getById(id: Id): FutureData<ProjectDashboard>;
};
