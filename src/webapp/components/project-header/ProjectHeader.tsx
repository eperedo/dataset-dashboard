import React from "react";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";

type ProjectHeaderProps = {
    title: string;
    onBack: () => void;
};

export const ProjectHeader = React.memo((props: ProjectHeaderProps) => {
    const { title, onBack } = props;

    return <PageHeader title={title} onBackClick={onBack} />;
});
