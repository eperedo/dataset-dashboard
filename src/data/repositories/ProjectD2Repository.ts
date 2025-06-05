import { apiToFuture } from "$/data/api-futures";
import { FutureData } from "$/domain/entities/generic/Future";
import { Project } from "$/domain/entities/Project";
import {
    GetProjectOptions,
    Paginated,
    ProjectRepository,
} from "$/domain/repositories/ProjectRepository";
import { D2Api, D2ApiMetadataType } from "$/types/d2-api";

export class ProjectD2Repository implements ProjectRepository {
    constructor(private api: D2Api) {}

    get(options: GetProjectOptions): FutureData<Paginated<Project>> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                page: options.page,
                pageSize: options.pageSize,
            })
        ).map(response => {
            const items = response.objects.map((dataSet: D2DataSet) =>
                Project.create({
                    id: dataSet.id,
                    name: dataSet.displayName,
                    code: dataSet.code,
                })
            );

            return {
                items,
                total: response.pager.total,
                page: response.pager.page,
                pageSize: response.pager.pageSize,
            };
        });
    }
}

const dataSetFields = {
    id: true,
    displayName: true,
    code: true,
};

type D2DataSet = D2ApiMetadataType<"dataSets", typeof dataSetFields>;
