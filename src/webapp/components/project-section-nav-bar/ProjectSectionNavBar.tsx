import React from "react";
import { ProjectSection } from "$/domain/entities/ProjectSection";

import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { Id } from "$/domain/entities/Ref";

type ProjectSectionNavBarProps = {
    onClick: (value: Id) => void;
    sections: ProjectSection[];
};

export const ProjectSectionNavBar = React.memo((props: ProjectSectionNavBarProps) => {
    const { onClick, sections } = props;

    const notifySection = React.useCallback((value: Id) => onClick(value), [onClick]);

    return (
        <ProjectSectionNavBarContainer dataset-testid="project-section-navbar">
            <ProjectSectionHeader>
                <Typography variant="h5">{i18n.t("Sections")}</Typography>
            </ProjectSectionHeader>

            <StickyList>
                {sections.map(section => (
                    <ListItem key={section.id} button onClick={() => notifySection(section.id)}>
                        <ListItemIcon>
                            {section.completed ? (
                                <AssignmentTurnedInOutlinedIcon />
                            ) : (
                                <AssignmentLateOutlinedIcon />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={section.name} />
                    </ListItem>
                ))}
            </StickyList>
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

const StickyList = styled(List)`
    position: sticky;
    top: 0;
`;
