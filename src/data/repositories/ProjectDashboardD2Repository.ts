import { apiToFuture } from "$/data/api-futures";
import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { Future, FutureData } from "$/domain/entities/generic/Future";
import { ProjectDashboardRepository } from "$/domain/repositories/ProjectDashboard";
import { D2Api, D2ApiMetadataType } from "$/types/d2-api";
import _ from "$/domain/entities/generic/Collection";
import { ProjectSection } from "$/domain/entities/ProjectSection";
import { Item } from "$/domain/entities/Item";
import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";

export class ProjectDashboardD2Repository implements ProjectDashboardRepository {
    constructor(private api: D2Api) {}

    getById(id: Id): FutureData<ProjectDashboard> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { eq: id } },
                paging: false,
            })
        ).flatMap(response => {
            const firstDataSet = response.objects[0];
            if (!firstDataSet) return Future.error(new Error(`Project with id ${id} not found`));

            const firstOrgUnit = firstDataSet.organisationUnits[0];
            if (!firstOrgUnit)
                return Future.error(
                    new Error(`Cannot find branch for Project with id ${firstDataSet.id}`)
                );

            return this.getDataValues({
                dataSetId: firstDataSet.id,
                orgUnitId: "ImspTQPwCqd",
                period: "202512",
            }).map(dataValues => {
                return this.buildProjectDashboard({
                    d2DataSet: firstDataSet,
                    orgUnitId: firstOrgUnit.id,
                    dataValues,
                });
            });
        });
    }

    private buildProjectDashboard(options: {
        d2DataSet: D2DataSet;
        orgUnitId: Id;
        dataValues: DataValueSetsDataValue[];
    }): ProjectDashboard {
        const { d2DataSet, orgUnitId, dataValues } = options;

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
            status: "active",
            periodType: "monthly",
            period: "2025",
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
}

const dataSetFields = {
    id: true,
    displayName: true,
    code: true,
    organisationUnits: true,
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
