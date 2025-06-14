import { apiToFuture } from "$/data/api-futures";
import { FutureData } from "$/domain/entities/generic/Future";
import { Project } from "$/domain/entities/Project";
import { Id } from "$/domain/entities/Ref";
import {
    GetProjectOptions,
    Paginated,
    ProjectRepository,
} from "$/domain/repositories/ProjectRepository";
import { D2Api, D2ApiMetadataType } from "$/types/d2-api";

export class ProjectD2Repository implements ProjectRepository {
    constructor(private api: D2Api) {}

    getById(id: Id): FutureData<Project> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFieldsOrgUnits,
                filter: { id: { eq: id } },
            })
        ).map(response => {
            const d2DataSet = response.objects[0];
            if (!d2DataSet) {
                throw new Error(`DataSet with id ${id} not found`);
            }

            const topOrgUnitId = d2DataSet.organisationUnits
                .filter(ou => ou.level === 1)
                .map(ou => ou.id)[0];

            return Project.create({
                id: d2DataSet.id,
                name: d2DataSet.displayName,
                code: d2DataSet.code,
                mainBranchId: topOrgUnitId ? topOrgUnitId : "",
            });
        });
    }

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
                    mainBranchId: "",
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
} as const;

const dataSetFieldsOrgUnits = {
    id: true,
    displayName: true,
    code: true,
    organisationUnits: { id: true, level: true },
} as const;

type D2DataSet = D2ApiMetadataType<"dataSets", typeof dataSetFields>;
