import React from "react";
import { ObjectsTable, TableColumn, TableState } from "@eyeseetea/d2-ui-components";

import { Project } from "$/domain/entities/Project";
import { Id } from "$/domain/entities/Ref";
import { Paginated } from "$/domain/repositories/ProjectRepository";
import i18n from "$/utils/i18n";
import { Maybe } from "$/utils/ts-utils";

type ProjectPageProps = {
    paginatedProjects: Paginated<Project>;
    onChangePage: (params: { page: number; pageSize: number }) => void;
    onViewDashboard: (id: Id) => void;
};

export const ProjectPage = React.memo((props: ProjectPageProps) => {
    const { onViewDashboard, paginatedProjects } = props;

    const tableColumns: TableColumn<ProjectTable>[] = React.useMemo(() => {
        return [
            {
                name: "id",
                text: i18n.t("Id"),
            },
            {
                name: "name",
                text: i18n.t("Name"),
            },
            {
                name: "code",
                text: i18n.t("Code"),
            },
        ];
    }, []);

    const tableActions = React.useMemo(() => {
        return [
            {
                name: "view-dashboard",
                text: i18n.t("View dashboard"),
                onClick: (ids: Id[]) => {
                    const firstId = ids[0];
                    if (firstId) {
                        onViewDashboard(firstId);
                    }
                },
            },
        ];
    }, [onViewDashboard]);

    const onChange = React.useCallback(
        (state: TableState<ProjectTable>) => {
            props.onChangePage(state.pagination);
        },
        [props]
    );

    return (
        <ObjectsTable
            actions={tableActions}
            columns={tableColumns}
            rows={paginatedProjects.items}
            pagination={{
                page: paginatedProjects.page,
                pageSize: paginatedProjects.pageSize,
                total: paginatedProjects.total,
            }}
            onChange={onChange}
        />
    );
});

type ProjectTable = { id: string; name: string; code: Maybe<string> };
