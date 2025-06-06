import React from "react";
import { ProjectSection } from "$/domain/entities/ProjectSection";

import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Inbox";
import i18n from "$/utils/i18n";
import styled from "styled-components";

type ProjectSectionNavBarProps = {
    sections: ProjectSection[];
};

export const ProjectSectionNavBar = React.memo((props: ProjectSectionNavBarProps) => {
    const { sections } = props;
    return (
        <ProjectSectionNavBarContainer dataset-testid="project-section-navbar">
            <ProjectSectionHeader>
                <Typography variant="h5">{i18n.t("Sections")}</Typography>
            </ProjectSectionHeader>

            <div>
                {sections.map(section => (
                    <List key={section.id}>
                        <ListItem button>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={section.name} />
                        </ListItem>
                    </List>
                ))}
            </div>
        </ProjectSectionNavBarContainer>
    );
});

const ProjectSectionNavBarContainer = styled.section`
    background-color: #f7f7f7;
    height: 100%;
    min-height: 100dvh;
`;

const ProjectSectionHeader = styled.div`
    padding: 1em;
`;
