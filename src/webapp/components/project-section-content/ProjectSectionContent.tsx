import React from "react";

import { ProjectSection } from "$/domain/entities/ProjectSection";

import { Paper, Typography } from "@material-ui/core";

import { ItemProgressSection } from "$/webapp/components/item-progress-section/ItemProgressSection";
import styled from "styled-components";

type ProjectSectionProps = {
    section: ProjectSection;
    highlight?: boolean;
};

export const ProjectSectionContent = React.memo((props: ProjectSectionProps) => {
    const { section, highlight } = props;
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        if (highlight) {
            const sectionElement$ = document.getElementById(section.id);
            if (sectionElement$) {
                sectionElement$.scrollIntoView({ behavior: "smooth" });
            }
            setActive(true);
            const timeout = setTimeout(() => setActive(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [section.id, highlight]);

    return (
        <Paper
            id={section.id}
            elevation={5}
            className={active ? "highlight" : ""}
            style={{ paddingInline: "1.5em", paddingBlockEnd: "1.5em" }}
        >
            <SectionHeaderContainer>
                <Typography variant="h4">{section.name}</Typography>
                <Typography variant="h6">{section.progress.toFixed(0)}%</Typography>
            </SectionHeaderContainer>
            <SectionItemsContainer>
                {section.items.map(item => (
                    <ItemProgressSection key={item.id} item={item} />
                ))}
            </SectionItemsContainer>
        </Paper>
    );
});

const SectionHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding-block: 1.5em;
`;

const SectionItemsContainer = styled.div`
    display: grid;
    row-gap: 1em;
`;
