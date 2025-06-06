import React from "react";

import { ProjectSection } from "$/domain/entities/ProjectSection";

import { Paper, Typography } from "@material-ui/core";

import { ItemProgressSection } from "$/webapp/components/item-progress-section/ItemProgressSection";
import styled from "styled-components";

type ProjectSectionProps = {
    section: ProjectSection;
};

export const ProjectSectionContent = React.memo((props: ProjectSectionProps) => {
    const { section } = props;

    return (
        <Paper elevation={5} style={{ paddingInline: "1.5em", paddingBlockEnd: "1.5em" }}>
            <SectionHeaderContainer>
                <Typography variant="h4">{section.name}</Typography>
                <Typography variant="h6">{section.progress}%</Typography>
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
