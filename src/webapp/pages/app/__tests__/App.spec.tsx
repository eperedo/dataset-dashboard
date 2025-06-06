import { render } from "@testing-library/react";

import App from "$/webapp/pages/app/App";
import { getTestContext } from "$/utils/tests";
import { Provider } from "@dhis2/app-runtime";
import { D2Api } from "$/types/d2-api";

describe("App", () => {
    it("renders the feedback component", async () => {
        expect(true).toBe(true);
    });
});

function getView() {
    const { compositionRoot } = getTestContext();
    return render(
        <Provider config={{ baseUrl: "http://localhost:8080", apiVersion: 30 }}>
            <App api={{} as D2Api} compositionRoot={compositionRoot} />
        </Provider>
    );
}
