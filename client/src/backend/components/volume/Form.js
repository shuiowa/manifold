import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { journalVolumesAPI } from "api";
import { useTranslation } from "react-i18next";

function VolumeForm({ journalId, model, ...props }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      {...props}
      name={model ? "update-journal-volume" : "create-journal-volume"}
      update={journalVolumesAPI.update}
      create={toCreate => journalVolumesAPI.create(journalId, toCreate)}
      className="form-secondary"
      model={model}
    >
      <Form.NumberInput
        label={t("backend.number")}
        focusOnMount
        name="attributes[number]"
      />
      <Form.TextInput
        wide
        label={t("backend.slug")}
        name="attributes[pendingSlug]"
        placeholder={t("backend.slug_placeholder")}
      />
      <Form.Save
        text={model ? t("backend.update_volume") : t("backend.create_volume")}
      />
    </FormContainer.Form>
  );
}

VolumeForm.prop_types = {
  model: PropTypes.object,
  journalId: PropTypes.string.isRequired
};

export default VolumeForm;
