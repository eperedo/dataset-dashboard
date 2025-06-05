import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import { useHistory } from "react-router-dom";

import { Project } from "$/domain/entities/Project";
import { Id } from "$/domain/entities/Ref";
import { Paginated } from "$/domain/repositories/ProjectRepository";
import { useAppContext } from "$/webapp/contexts/app-context";
import { ProjectPage } from "$/webapp/pages/projects/ProjectPage";

export const ProjectContainer = React.memo(() => {
    const { compositionRoot } = useAppContext();
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [paginatedProjects, setPaginatedProjects] = React.useState<Paginated<Project>>();
    const history = useHistory();

    React.useEffect(() => {
        return compositionRoot.projects.get
            .execute({ page: page, pageSize: pageSize })
            .run(setPaginatedProjects, console.error);
    }, [compositionRoot, page, pageSize]);

    if (!paginatedProjects) {
        return <LinearProgress />;
    }

    const updatePage = (params: { page: number; pageSize: number }) => {
        setPage(params.page);
        setPageSize(params.pageSize);
    };

    const goToDashboard = (id: Id) => {
        history.push(`/projects/${id}/dashboard`);
    };

    return (
        <ProjectPage
            onViewDashboard={goToDashboard}
            onChangePage={updatePage}
            paginatedProjects={paginatedProjects}
        />
    );
});
