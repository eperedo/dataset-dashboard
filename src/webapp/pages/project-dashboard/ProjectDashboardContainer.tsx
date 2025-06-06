import { ProjectDashboard } from "$/domain/entities/ProjectDashboard";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
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
    const [branchId, setBranchId] = React.useState<Maybe<Id>>();
    const [period, setPeriod] = React.useState<Maybe<Id>>();

    React.useEffect(() => {
        return compositionRoot.projectDashboard.getBy
            .execute({ id, period: period, branchId: branchId })
            .run(setProjectDashboard, console.error);
    }, [id, compositionRoot, period, branchId]);

    const goToHome = React.useCallback(() => {
        history.push("/");
    }, [history]);

    const updateProjectDashboard = React.useCallback(
        (options: { branchId: Id; period: string }) => {
            setBranchId(options.branchId);
            setPeriod(options.period);
        },
        []
    );

    if (!projectDashboard) {
        return <LinearProgress style={{ height: "10px" }} />;
    }

    return (
        <ProjectDashboardPage
            onBack={goToHome}
            projectDashboard={projectDashboard}
            onFilterChange={updateProjectDashboard}
        />
    );
});
