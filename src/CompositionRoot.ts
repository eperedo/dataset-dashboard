import { ProjectD2Repository } from "$/data/repositories/ProjectD2Repository";
import { ProjectDashboardD2Repository } from "$/data/repositories/ProjectDashboardD2Repository";
import { ProjectDashboardRepository } from "$/domain/repositories/ProjectDashboard";
import { ProjectRepository } from "$/domain/repositories/ProjectRepository";
import { GetProjectByIdUseCase } from "$/domain/usecases/GetProjectByIdUseCase";
import { GetProjectDashboardByIdUseCase } from "$/domain/usecases/GetProjectDashboardByIdUseCase";
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
    projectDashboardRepository: ProjectDashboardRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: { getCurrent: new GetCurrentUserUseCase(repositories) },
        projects: {
            get: new GetProjectsUseCase(repositories.projectRepository),
            getById: new GetProjectByIdUseCase(repositories.projectRepository),
        },
        projectDashboard: {
            getBy: new GetProjectDashboardByIdUseCase(repositories.projectDashboardRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        userRepository: new UserD2Repository(api),
        projectRepository: new ProjectD2Repository(api),
        projectDashboardRepository: new ProjectDashboardD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        userRepository: new UserTestRepository(),
        projectRepository: new ProjectD2Repository({} as D2Api),
        projectDashboardRepository: new ProjectDashboardD2Repository({} as D2Api),
    };

    return getCompositionRoot(repositories);
}
