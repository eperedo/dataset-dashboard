import React from "react";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { PeriodType } from "$/domain/entities/PeriodType";

type ProjectHeaderProps = {
    title: string;
    onBack: () => void;
    projectDashboard: ProjectDashboard;
    onFilterChange: (options: { branchId: Id; period: string }) => void;
};

export const ProjectHeader = React.memo((props: ProjectHeaderProps) => {
    const { title, onBack, projectDashboard } = props;
    const { period, branchId, periodType } = projectDashboard;

    const notifyFilterChange = (value: Maybe<string>) => {
        if (!value) return;
        props.onFilterChange({ branchId, period: value });
    };

    const periods = React.useMemo(() => {
        return PeriodType.buildPeriods(periodType).map(period => ({
            value: period,
            text: period,
        }));
    }, [periodType]);

    return (
        <PageHeader title={title} onBackClick={onBack}>
            <div className="project-header-filters-container">
                <Dropdown
                    items={periods}
                    onChange={notifyFilterChange}
                    hideEmpty
                    value={period}
                    label={i18n.t("Period")}
                />
            </div>
        </PageHeader>
    );
});
