import { ProjectD2Repository } from "$/data/repositories/ProjectD2Repository";
import { ProjectRepository } from "$/domain/repositories/ProjectRepository";
import { GetProjectsUseCase } from "$/domain/usecases/GetProjectsUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    projectRepository: ProjectRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: { getCurrent: new GetCurrentUserUseCase(repositories) },
        projects: { get: new GetProjectsUseCase(repositories.projectRepository) },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        userRepository: new UserD2Repository(api),
        projectRepository: new ProjectD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        userRepository: new UserTestRepository(),
        projectRepository: new ProjectD2Repository({} as D2Api),
    };

    return getCompositionRoot(repositories);
}
