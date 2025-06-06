import React from "react";

import { LinearProgress, Theme, Typography, createStyles, withStyles } from "@material-ui/core";
import { Item } from "$/domain/entities/Item";
import styled from "styled-components";

type ItemProgressSectionProps = {
    item: Item;
};

export const ItemProgressSection = React.memo((props: ItemProgressSectionProps) => {
    const { item } = props;
    return (
        <ItemProgressSectionContainer>
            <Typography title={item.name} className="multiline-text-ellipsis" variant="body1">
                {item.name}
            </Typography>
            <ProgressContainer>
                <BorderLinearProgress value={item.progress} variant="determinate" />
                <Typography variant="body2" color="secondary">
                    {item.responsesCount}/{item.possibleResponsesCount}
                </Typography>
            </ProgressContainer>
        </ItemProgressSectionContainer>
    );
});

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: { height: 10, borderRadius: 5, width: "100%" },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
        },
        bar: { borderRadius: 5, backgroundColor: "#1a90ff" },
    })
)(LinearProgress);

const ItemProgressSectionContainer = styled.div`
    align-items: center;
    display: grid;
    justify-content: space-between;
    grid-template-columns: 0.3fr 0.7fr;
`;

const ProgressContainer = styled.div`
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
`;
