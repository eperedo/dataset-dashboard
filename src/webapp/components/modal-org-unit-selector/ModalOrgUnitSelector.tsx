import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Button, Dialog, DialogActions, TextField } from "@material-ui/core";
import { OrgUnitsSelector } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";

export type ModalOrgUnitSelectorProps = {
    allowedIds: Id[];
    value?: string;
    onChange: (value: Id) => void;
};

export const ModalOrgUnitSelector = React.memo((props: ModalOrgUnitSelectorProps) => {
    const { allowedIds, onChange, value } = props;
    const { api } = useAppContext();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedOrgUnit, setSelectedOrgUnit] = React.useState<Id>();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const updateDialog = React.useCallback(() => {
        setOpenDialog(true);
    }, []);

    const updateValue = React.useCallback(() => {
        if (!selectedOrgUnit) return;

        const orgUnitId = _(selectedOrgUnit.split("/")).compact().last();
        if (!orgUnitId) return;

        if (inputRef.current) {
            const inputCheckbox$ = document.querySelector("input[type='checkbox']:checked");
            inputRef.current.value = inputCheckbox$?.nextSibling?.textContent ?? orgUnitId;
        }
        setOpenDialog(false);
        onChange(orgUnitId);
    }, [onChange, selectedOrgUnit]);

    const closeDialog = React.useCallback(() => {
        setOpenDialog(false);
    }, []);

    const updateOrgUnit = React.useCallback((value: string[]) => {
        const first = value[0];
        if (!first) return;
        setSelectedOrgUnit(first);
    }, []);

    return (
        <div>
            <TextField
                InputProps={{ readOnly: true }}
                inputRef={inputRef}
                defaultValue={value}
                onClick={updateDialog}
                label={i18n.t("Select Org. Unit")}
            />
            <Dialog maxWidth="lg" open={openDialog} onClose={closeDialog}>
                <OrgUnitsSelector
                    api={api}
                    selected={selectedOrgUnit ? [selectedOrgUnit] : []}
                    singleSelection
                    onChange={updateOrgUnit}
                    controls={orgUnitControls}
                    rootIds={allowedIds}
                />
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={updateValue}>
                        {i18n.t("Save")}
                    </Button>
                    <Button onClick={closeDialog}>{i18n.t("Close")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

const orgUnitControls = {
    filterByLevel: false,
    filterByGroup: false,
    filterByProgram: false,
    selectAll: false,
};
