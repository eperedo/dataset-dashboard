import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/domain/entities/generic/Future";
import { ProjectDashboardRepository } from "$/domain/repositories/ProjectDashboard";

export class GetProjectDashboardByIdUseCase {
    constructor(private readonly projectDashboardRepository: ProjectDashboardRepository) {}

    execute(projectId: Id): FutureData<ProjectDashboard> {
        return this.projectDashboardRepository.getById(projectId);
    }
}
