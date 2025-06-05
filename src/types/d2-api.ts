import { D2Api, D2ApiDefinition, MetadataPick } from "@eyeseetea/d2-api/2.40";
import { getMockApiFromClass } from "@eyeseetea/d2-api";

export { CancelableResponse } from "@eyeseetea/d2-api";
export { D2Api } from "@eyeseetea/d2-api/2.40";
export type { MetadataPick } from "@eyeseetea/d2-api/2.40";
export const getMockApi = getMockApiFromClass(D2Api);

export type D2ApiMetadataType<K extends keyof D2ApiDefinition["schemas"], Fields> = MetadataPick<{
    [P in K]: { fields: Fields };
}>[K][number];
