import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { textsAPI } from "api";

export default function TextPropertiesContainer({ text }) {
  const { t } = useTranslation();
  return (
    <section>
      <FormContainer.Form
        model={text}
        name="backend-text-properties"
        update={textsAPI.update}
        create={textsAPI.create}
        className="form-secondary"
      >
        <Form.FieldGroup label={t("backend_entities.texts.properties.header")}>
          <Form.TextInput
            wide
            label={t("backend_entities.texts.properties.title_label")}
            name="attributes[title]"
            placeholder={t(
              "backend_entities.texts.properties.title_placeholder"
            )}
          />
          <Form.TextInput
            wide
            label={t("backend_entities.texts.properties.subtitle_label")}
            name="attributes[subtitle]"
            placeholder={t(
              "backend_entities.texts.properties.subtitle_placeholder"
            )}
          />
          <Form.DatePicker
            label={t("backend_entities.texts.properties.pub_date_label")}
            name="attributes[publicationDate]"
          />
          <Form.TextInput
            wide
            label={t("backend_entities.texts.properties.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t(
              "backend_entities.texts.properties.slug_placeholder"
            )}
          />
          <Form.TextArea
            wide
            label={t("backend_entities.texts.properties.descript_label")}
            name="attributes[description]"
            placeholder={t(
              "backend_entities.texts.properties.descript_placeholder"
            )}
          />
          <Form.Upload
            wide
            layout="portrait"
            label={t("backend_entities.texts.properties.cover_label")}
            accepts="images"
            readFrom="attributes[coverStyles][small]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
          />
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("backend_entities.texts.properties.presentation_header")}
        >
          <Form.Switch
            wide
            instructions={t(
              "backend_entities.texts.properties.published_instructions"
            )}
            label={t("backend_entities.texts.properties.published_label")}
            name="attributes[published]"
          />
          <Form.TextInput
            wide
            label={t("backend_entities.texts.properties.section_label")}
            name="attributes[sectionKind]"
            placeholder={t(
              "backend_entities.texts.properties.section_placeholder"
            )}
            instructions={t(
              "backend_entities.texts.properties.section_instructions"
            )}
          />
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("backend_entities.texts.properties.access_header")}
        >
          <Form.Switch
            wide
            label={t("backend_entities.texts.properties.ignore_label")}
            instructions={t(
              "backend_entities.texts.properties.ignore_instructions"
            )}
            name="attributes[ignoreAccessRestrictions]"
          />
        </Form.FieldGroup>
        <Form.Save text={t("backend_entities.texts.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}

TextPropertiesContainer.displayName = "Text.Properties";

TextPropertiesContainer.propTypes = {
  text: PropTypes.object
};
