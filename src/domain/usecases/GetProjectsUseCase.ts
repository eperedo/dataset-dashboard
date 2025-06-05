import { Project } from "$/domain/entities/Project";
import { FutureData } from "$/domain/entities/generic/Future";
import {
    GetProjectOptions,
    Paginated,
    ProjectRepository,
} from "$/domain/repositories/ProjectRepository";

export class GetProjectsUseCase {
    constructor(private projectRepository: ProjectRepository) {}

    execute(options: GetProjectOptions): FutureData<Paginated<Project>> {
        return this.projectRepository.get(options);
    }
}
