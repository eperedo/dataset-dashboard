import { apiToFuture } from "$/data/api-futures";
import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { Future, FutureData } from "$/domain/entities/generic/Future";
import {
    GetByProjectDashboardOptions,
    ProjectDashboardRepository,
} from "$/domain/repositories/ProjectDashboard";
import { D2Api, D2ApiMetadataType } from "$/types/d2-api";
import _ from "$/domain/entities/generic/Collection";
import { ProjectSection } from "$/domain/entities/ProjectSection";
import { Item } from "$/domain/entities/Item";
import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { PeriodType } from "$/domain/entities/PeriodType";
import { Maybe } from "$/utils/ts-utils";

export class ProjectDashboardD2Repository implements ProjectDashboardRepository {
    constructor(private api: D2Api) {}

    getBy(options: GetByProjectDashboardOptions): FutureData<ProjectDashboard> {
        const { id, branchId, period: projectPeriod } = options;
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { eq: id } },
                paging: false,
            })
        )
            .flatMap(response => {
                return this.getFirstDataSetOrError(response.objects[0], id);
            })
            .flatMap(({ dataSet, orgUnitId, period }) => {
                const orgUnitValue = branchId ?? orgUnitId;
                const periodValue = projectPeriod ?? period;
                return Future.joinObj({
                    dataValues: this.getDataValues({
                        dataSetId: dataSet.id,
                        orgUnitId: orgUnitValue,
                        period: periodValue,
                    }),
                    statuses: this.getStatuses({
                        dataSet: dataSet,
                        orgUnitId: orgUnitValue,
                        period: periodValue,
                    }),
                }).map(({ dataValues, statuses }) => {
                    return this.buildProjectDashboard({
                        d2DataSet: dataSet,
                        orgUnitId: orgUnitValue,
                        dataValues,
                        period: periodValue,
                        statuses: statuses,
                    });
                });
            });
    }

    private getFirstDataSetOrError(
        d2DataSet: Maybe<D2DataSet>,
        id: Id
    ): FutureData<{ dataSet: D2DataSet; orgUnitId: Id; period: string }> {
        const firstDataSet = d2DataSet;
        if (!firstDataSet) return Future.error(new Error(`Project ${id} not found`));

        const firstOrgUnit = firstDataSet.organisationUnits[0];
        if (!firstOrgUnit) return Future.error(new Error(`Cannot find branch for Project ${id}`));

        const latestPeriod = PeriodType.getLatest(firstDataSet.periodType);
        if (!latestPeriod)
            return Future.error(new Error(`No valid period found for Project ${id}`));

        return Future.success({
            dataSet: firstDataSet,
            orgUnitId: firstOrgUnit.id,
            period: latestPeriod,
        });
    }

    private buildProjectDashboard(options: {
        d2DataSet: D2DataSet;
        orgUnitId: Id;
        dataValues: DataValueSetsDataValue[];
        period: string;
        statuses: { isCompleted: boolean; isApproved: boolean };
    }): ProjectDashboard {
        const { d2DataSet, orgUnitId, dataValues, period, statuses } = options;

        const dataElementsById = _(d2DataSet.dataSetElements).toHashMap(dataSetElement => [
            dataSetElement.dataElement.id,
            {
                ...dataSetElement.dataElement,
                categoryCombo: dataSetElement.categoryCombo
                    ? dataSetElement.categoryCombo
                    : dataSetElement.dataElement.categoryCombo,
            },
        ]);

        const sections =
            d2DataSet.sections.length > 0
                ? d2DataSet.sections
                : [
                      {
                          id: "default-section",
                          displayName: "Default Section",
                          code: "default-section",
                          dataElements: d2DataSet.dataSetElements.map(de => de.dataElement),
                      },
                  ];

        return ProjectDashboard.create({
            id: d2DataSet.id,
            branchId: orgUnitId,
            name: d2DataSet.displayName,
            code: d2DataSet.code,
            isApproved: statuses.isApproved,
            isCompleted: statuses.isCompleted,
            periodType: d2DataSet.periodType,
            period: period,
            sections: sections.map(section => {
                return ProjectSection.create({
                    id: section.id,
                    name: section.displayName,
                    code: section.code,
                    items: _(section.dataElements)
                        .compactMap(dataElement => {
                            const dataElementDetails = dataElementsById.get(dataElement.id);
                            if (!dataElementDetails) return undefined;

                            const totalResponses = dataValues.filter(
                                dataValue => dataValue.dataElement === dataElementDetails.id
                            ).length;

                            return Item.create({
                                id: dataElementDetails.id,
                                name: dataElementDetails.displayName,
                                code: dataElementDetails.code,
                                possibleResponsesCount:
                                    dataElementDetails.categoryCombo.categoryOptionCombos.length,
                                responsesCount: totalResponses,
                            });
                        })
                        .value(),
                });
            }),
        });
    }

    private getDataValues(options: {
        dataSetId: Id;
        period: string;
        orgUnitId: Id;
    }): FutureData<DataValueSetsDataValue[]> {
        const { dataSetId, period, orgUnitId } = options;
        return apiToFuture(
            this.api.dataValues.getSet({
                dataSet: [dataSetId],
                period: [period],
                orgUnit: [orgUnitId],
                includeDeleted: false,
            })
        ).map(response => {
            return response.dataValues;
        });
    }

    private getStatuses(options: {
        dataSet: D2DataSet;
        orgUnitId: Id;
        period: string;
    }): FutureData<{ isCompleted: boolean; isApproved: boolean }> {
        const { dataSet, orgUnitId, period } = options;
        return Future.joinObj({
            isCompleted: this.getCompletionStatus({
                dataSetId: dataSet.id,
                orgUnitId: orgUnitId,
                period: period,
            }),
            isApproved: this.getApprovalStatus({
                dataSet: dataSet,
                orgUnitId: orgUnitId,
                period: period,
            }),
        });
    }

    private getCompletionStatus(options: {
        dataSetId: Id;
        orgUnitId: Id;
        period: string;
    }): FutureData<boolean> {
        const { dataSetId, orgUnitId, period } = options;
        return apiToFuture(
            this.api.request<D2CompleteDataSetRegistration>({
                method: "get",
                url: "/completeDataSetRegistrations",
                params: {
                    dataSet: [dataSetId],
                    orgUnit: [orgUnitId],
                    period: [period],
                },
            })
        ).flatMap(response => {
            if (!response.completeDataSetRegistrations) return Future.success(false);

            const completeItem =
                response.completeDataSetRegistrations.find(
                    item =>
                        item.dataSet === dataSetId &&
                        item.organisationUnit === orgUnitId &&
                        item.period === period
                )?.completed ?? false;

            return Future.success(completeItem);
        });
    }

    private getApprovalStatus(options: {
        dataSet: D2DataSet;
        orgUnitId: Id;
        period: string;
    }): FutureData<boolean> {
        const { dataSet, orgUnitId, period } = options;
        if (!dataSet.workflow || !dataSet.workflow.id) return Future.success(false);

        return apiToFuture(
            this.api.request<D2DataApproval>({
                method: "get",
                url: "/dataApprovals",
                params: {
                    wf: dataSet.workflow.id,
                    ou: orgUnitId,
                    pe: period,
                },
            })
        ).map(response => {
            return response.state === "APPROVED_HERE" || response.state === "APPROVED_ELSEWHERE";
        });
    }
}

const dataSetFields = {
    id: true,
    workflow: true,
    displayName: true,
    code: true,
    organisationUnits: true,
    periodType: true,
    dataSetElements: {
        categoryCombo: {
            id: true,
            categoryOptionCombos: { id: true },
        },
        dataElement: {
            id: true,
            displayName: true,
            code: true,
            categoryCombo: { id: true, categoryOptionCombos: { id: true } },
        },
    },
    sections: {
        id: true,
        displayName: true,
        code: true,
        dataElements: true,
    },
} as const;

type D2DataSet = D2ApiMetadataType<"dataSets", typeof dataSetFields>;

type D2CompleteDataSetItem = {
    period: string;
    dataSet: Id;
    organisationUnit: Id;
    attributeOptionCombo: Id;
    date: string;
    storedBy: string;
    completed: boolean;
};

type D2CompleteDataSetRegistration = {
    completeDataSetRegistrations: D2CompleteDataSetItem[];
};

type D2DataApproval = {
    state: "APPROVED_HERE" | "APPROVED_ELSEWHERE";
};
