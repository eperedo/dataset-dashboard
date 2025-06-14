import { Project } from "$/domain/entities/Project";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/domain/entities/generic/Future";

export interface ProjectRepository {
    get(options: GetProjectOptions): FutureData<Paginated<Project>>;
    getById(id: Id): FutureData<Project>;
}

export type GetProjectOptions = { page: number; pageSize: number };

export type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
};
