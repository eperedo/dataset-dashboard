import React from "react";
import { Paper } from "@material-ui/core";

import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { ProjectSectionContent } from "$/webapp/components/project-section-content/ProjectSectionContent";
import { ProjectDetails } from "$/webapp/components/project-details/ProjectDetails";
import { ProjectSectionNavBar } from "$/webapp/components/project-section-nav-bar/ProjectSectionNavBar";
import { ProjectHeader } from "$/webapp/components/project-header/ProjectHeader";
import { Id } from "$/domain/entities/Ref";
import { Project } from "$/domain/entities/Project";

type ProjectDashboardPageProps = {
    projectDashboard: ProjectDashboard;
    project: Project;
    onBack: () => void;
    onFilterChange: (options: { branchId: string; period: string }) => void;
};

export const ProjectDashboardPage = React.memo((props: ProjectDashboardPageProps) => {
    const { onFilterChange, projectDashboard, onBack, project } = props;
    const [selectedSectionId, setSelectedSectionId] = React.useState<Id>();

    const showSection = React.useCallback((sectionId: string) => {
        setSelectedSectionId(sectionId);
    }, []);

    return (
        <Paper className="project-dashboard-container">
            <ProjectSectionNavBar onClick={showSection} sections={projectDashboard.sections} />
            <div style={{ paddingBlock: "1em" }} className="project-section-content">
                <div className="project-section-content-header">
                    <ProjectHeader
                        title={projectDashboard.name}
                        onBack={onBack}
                        onFilterChange={onFilterChange}
                        projectDashboard={projectDashboard}
                        project={project}
                    />
                </div>
                <div className="project-section-details">
                    <ProjectDetails projectDashboard={projectDashboard} />
                </div>
                <div className="project-section-content-sections">
                    {projectDashboard.sections.map(section => (
                        <ProjectSectionContent
                            key={section.id}
                            section={section}
                            highlight={selectedSectionId === section.id}
                        />
                    ))}
                </div>
            </div>
        </Paper>
    );
});
