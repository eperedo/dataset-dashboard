import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "$/webapp/contexts/app-context";
import { ProjectDashboardPage } from "$/webapp/pages/project-dashboard/ProjectDashboardPage";
import LinearProgress from "material-ui/LinearProgress";
import React from "react";
import { useHistory } from "react-router-dom";

type ProjectDashboardContainerProps = {
    id: Id;
};

export const ProjectDashboardContainer = React.memo((props: ProjectDashboardContainerProps) => {
    const { id } = props;
    const { compositionRoot } = useAppContext();
    const [projectDashboard, setProjectDashboard] = React.useState<ProjectDashboard>();
    const history = useHistory();

    React.useEffect(() => {
        return compositionRoot.projectDashboard.getById
            .execute(id)
            .run(setProjectDashboard, console.error);
    }, [id, compositionRoot]);

    const goToHome = React.useCallback(() => {
        history.push("/");
    }, [history]);

    if (!projectDashboard) {
        return <LinearProgress />;
    }

    return <ProjectDashboardPage onBack={goToHome} projectDashboard={projectDashboard} />;
});
