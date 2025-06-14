import { Project } from "$/domain/entities/Project";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/domain/entities/generic/Future";
import { ProjectRepository } from "$/domain/repositories/ProjectRepository";

export class GetProjectByIdUseCase {
    constructor(private projectRepository: ProjectRepository) {}

    execute(id: Id): FutureData<Project> {
        return this.projectRepository.getById(id);
    }
}
