import { HashRouter, Route, Switch } from "react-router-dom";
import { ExamplePage } from "./example/ExamplePage";
import { ProjectContainer } from "$/webapp/pages/projects/ProjectContainer";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/projects/:id/dashboard"
                    render={({ match }) => <ExamplePage name={match.params.id ?? "Stranger"} />}
                />

                {/* Default route */}
                <Route render={() => <ProjectContainer />} />
            </Switch>
        </HashRouter>
    );
}
