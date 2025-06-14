import React from "react";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { PeriodType } from "$/domain/entities/PeriodType";
import { ModalOrgUnitSelector } from "$/webapp/components/modal-org-unit-selector/ModalOrgUnitSelector";
import styled from "styled-components";
import { Project } from "$/domain/entities/Project";

type ProjectHeaderProps = {
    title: string;
    onBack: () => void;
    project: Project;
    projectDashboard: ProjectDashboard;
    onFilterChange: (options: { branchId: Id; period: string }) => void;
};

export const ProjectHeader = React.memo((props: ProjectHeaderProps) => {
    const { project, title, onBack, projectDashboard } = props;
    const { period, branchId, periodType } = projectDashboard;

    const notifyFilterChange = (value: Maybe<string>) => {
        if (!value) return;
        props.onFilterChange({ branchId, period: value });
    };

    const updateFilters = (branchId: Id) => {
        props.onFilterChange({ branchId, period });
    };

    const periods = React.useMemo(() => {
        return PeriodType.buildPeriods(periodType).map(period => ({
            value: period,
            text: period,
        }));
    }, [periodType]);

    return (
        <PageHeader title={title} onBackClick={onBack}>
            <ProjectFilterContainer>
                <Dropdown
                    items={periods}
                    onChange={notifyFilterChange}
                    hideEmpty
                    value={period}
                    label={i18n.t("Period")}
                />
                <ModalOrgUnitSelector
                    allowedIds={[project.mainBranchId]}
                    onChange={updateFilters}
                    value={projectDashboard.branchId}
                />
            </ProjectFilterContainer>
        </PageHeader>
    );
});

const ProjectFilterContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
    margin-inline-start: auto;
`;
