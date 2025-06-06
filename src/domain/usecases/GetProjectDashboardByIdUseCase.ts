import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { FutureData } from "$/domain/entities/generic/Future";
import {
    GetByProjectDashboardOptions,
    ProjectDashboardRepository,
} from "$/domain/repositories/ProjectDashboard";

export class GetProjectDashboardByIdUseCase {
    constructor(private readonly projectDashboardRepository: ProjectDashboardRepository) {}

    execute(options: GetByProjectDashboardOptions): FutureData<ProjectDashboard> {
        return this.projectDashboardRepository.getBy(options);
    }
}
