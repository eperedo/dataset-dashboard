import React from "react";
import { Paper } from "@material-ui/core";

import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { ProjectSectionContent } from "$/webapp/components/project-section-content/ProjectSectionContent";
import { ProjectDetails } from "$/webapp/components/project-details/ProjectDetails";
import { ProjectSectionNavBar } from "$/webapp/components/project-section-nav-bar/ProjectSectionNavBar";
import { ProjectHeader } from "$/webapp/components/project-header/ProjectHeader";

type ProjectDashboardPageProps = {
    projectDashboard: ProjectDashboard;
    onBack: () => void;
    onFilterChange: (options: { branchId: string; period: string }) => void;
};

export const ProjectDashboardPage = React.memo((props: ProjectDashboardPageProps) => {
    const { onFilterChange, projectDashboard, onBack } = props;

    return (
        <Paper className="project-dashboard-container">
            <ProjectSectionNavBar sections={projectDashboard.sections} />
            <div style={{ paddingBlock: "1em" }} className="project-section-content">
                <div className="project-section-content-header">
                    <ProjectHeader
                        title={projectDashboard.name}
                        onBack={onBack}
                        onFilterChange={onFilterChange}
                        projectDashboard={projectDashboard}
                    />
                </div>
                <div className="project-section-details">
                    <ProjectDetails projectDashboard={projectDashboard} />
                </div>
                <div className="project-section-content-sections">
                    {projectDashboard.sections.map(section => (
                        <ProjectSectionContent key={section.id} section={section} />
                    ))}
                </div>
            </div>
        </Paper>
    );
});
