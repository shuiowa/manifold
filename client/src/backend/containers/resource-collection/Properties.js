import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { resourceCollectionsAPI } from "api";
import { connect } from "react-redux";

export class ResourceCollectionPropertiesContainer extends PureComponent {
  static displayName = "resourceCollection.Properties";

  static propTypes = {
    resourceCollection: PropTypes.object,
    params: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const { resourceCollection, t } = this.props;
    if (!resourceCollection) return null;

    return (
      <section>
        <FormContainer.Form
          model={resourceCollection}
          name="backend-collection-update"
          update={resourceCollectionsAPI.update}
          create={model =>
            resourceCollectionsAPI.create(this.props.params.projectId, model)
          }
          className="form-secondary"
        >
          <Form.TextInput
            label={t("backend_entities.resource_collections.forms.title_label")}
            name="attributes[title]"
            placeholder={t(
              "backend_entities.resource_collections.forms.title_placeholder"
            )}
            {...this.props}
          />
          <Form.TextArea
            label={t(
              "backend_entities.resource_collections.forms.descript_label"
            )}
            name="attributes[description]"
            placeholder={t(
              "backend_entities.resource_collections.forms.descript_placeholder"
            )}
            {...this.props}
          />
          <Form.TextInput
            wide
            label={t("backend_entities.resource_collections.forms.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t(
              "backend_entities.resource_collections.forms.sluslug_placeholder"
            )}
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label={t("backend_entities.resource_collections.forms.image_label")}
            readFrom="attributes[thumbnailStyles][small]"
            name="attributes[thumbnail]"
            remove="attributes[removeThumbnail]"
          />
          <Form.Save
            text={t("backend_entities.resource_collections.forms.save")}
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(
  connect(ResourceCollectionPropertiesContainer.mapStateToProps)(
    ResourceCollectionPropertiesContainer
  )
);
