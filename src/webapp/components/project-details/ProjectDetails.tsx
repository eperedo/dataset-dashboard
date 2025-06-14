import React from "react";
import styled from "styled-components";
import { Chip, Paper, Typography } from "@material-ui/core";

import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { DonutChart } from "$/webapp/components/donut-chart/DonutChart";
import i18n from "$/utils/i18n";

type ProjectDetailsProps = {
    projectDashboard: ProjectDashboard;
};

export const ProjectDetails = React.memo((props: ProjectDetailsProps) => {
    const { projectDashboard } = props;
    const { name, code, isApproved, isCompleted } = projectDashboard;

    return (
        <Paper elevation={5} style={{ padding: "2em" }}>
            <ProjectDetailsContainer>
                <DonutChart percentage={projectDashboard.progress} />
                <ProjectDetailsLabels>
                    <Typography variant="h4">{name}</Typography>
                    {code && (
                        <Typography color="secondary" variant="h6">
                            {i18n.t("Code: {{code}}", { nsSeparator: false, code: code })}
                        </Typography>
                    )}
                    <Chip
                        style={{ fontSize: "1em" }}
                        color={isCompleted ? "primary" : "secondary"}
                        label={isCompleted ? i18n.t("Completed") : i18n.t("Incompleted")}
                    />

                    <Chip
                        style={{ fontSize: "1em" }}
                        color={isApproved ? "primary" : "secondary"}
                        label={isApproved ? i18n.t("Approved") : i18n.t("Unnapproved")}
                    />
                </ProjectDetailsLabels>
            </ProjectDetailsContainer>
        </Paper>
    );
});

const ProjectDetailsContainer = styled.div`
    display: flex;
    column-gap: 2em;
`;

const ProjectDetailsLabels = styled.div`
    display: inline-flex;
    flex-direction: column;
    row-gap: 1em;
`;
