import { HashRouter, Route, Switch } from "react-router-dom";
import { ProjectContainer } from "$/webapp/pages/projects/ProjectContainer";
import { ProjectDashboardContainer } from "$/webapp/pages/project-dashboard/ProjectDashboardContainer";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/projects/:id/dashboard"
                    render={({ match }) => <ProjectDashboardContainer id={match.params.id} />}
                />

                <Route render={() => <ProjectContainer />} />
            </Switch>
        </HashRouter>
    );
}
