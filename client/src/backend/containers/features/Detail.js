import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { featuresAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import FrontendLayout from "frontend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import get from "lodash/get";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";
import Instructions from "global/components/form/Instructions";

import Authorize from "hoc/Authorize";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class FeatureDetailContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      feature: select(requests.beFeature, state.entityStore),
      session: get(state.entityEditor.sessions, "backend-feature-update")
    };
  };

  static displayName = "Feature.Detail";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    feature: PropTypes.object,
    route: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id !== "new") this.fetchFeature(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.id(this.props) !== this.id(prevProps)) {
      this.fetchFeature(this.props);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beFeature));
  }

  fetchFeature(props) {
    const id = this.id(props);
    if (!id) return;
    const call = featuresAPI.show(id);
    const featureRequest = request(call, requests.beFeature);
    props.dispatch(featureRequest);
  }

  redirectToFeatures() {
    const path = lh.link("backendRecordsFeatures");
    this.props.history.push(path);
  }

  handleSuccess = featureIgnored => {
    this.redirectToFeatures();
  };

  handleDestroy = () => {
    const { feature, t } = this.props;
    if (!feature) return;
    const heading = t("backend.forms.feature.delete_modal_heading");
    const message = t("backend.forms.feature.delete_modal_message");
    this.props.confirm(heading, message, () => this.doDestroy(feature));
  };

  doDestroy = feature => {
    const call = featuresAPI.destroy(feature.id);
    const options = { removes: feature };
    const featureRequest = request(call, requests.beFeatureDestroy, options);
    this.props.dispatch(featureRequest).promise.then(() => {
      this.notifyDestroy(feature);
      this.redirectToList();
    });
  };

  redirectToList() {
    const path = lh.link("backendRecordsFeatures");
    this.props.history.push(path);
  }

  notifyDestroy(feature) {
    const t = this.props.t;
    const notification = {
      level: 0,
      id: `FEATURE_DESTROYED_${feature.id}`,
      heading: t("backend.forms.feature.delete_confirm_heading"),
      body: t("backend.forms.feature.delete_confim_body"),
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  previewableFeature(props) {
    const { session } = props;
    if (!session) return null;
    const { source, dirty } = session;
    const previewAttributes = {
      ...source.attributes,
      ...dirty.attributes
    };
    const preview = { ...source, attributes: previewAttributes };
    return preview;
  }

  isNew(props) {
    return this.id(props) === "new";
  }

  id(props) {
    return props.match.params.id;
  }

  feature(props) {
    return props.feature;
  }

  newHeader() {
    const t = this.props.t;
    return (
      <Navigation.DetailHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={t("backend.features.back_label")}
        title={t("backend.forms.feature.new_header")}
        showUtility={false}
        note={t("backend.forms.feature.new_instructions")}
      />
    );
  }

  featureHeader(feature) {
    if (!feature) return null;
    const t = this.props.t;
    return (
      <Navigation.DetailHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={t("backend.features.back_label")}
        title={
          feature.attributes.header ||
          t("backend.feaures.preview.no_title", {
            position: feature.attributes.position
          })
        }
        utility={this.renderUtility()}
      />
    );
  }

  renderUtility() {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <button onClick={this.handleDestroy} className="utility-button">
          <IconComposer
            icon="delete32"
            size={26}
            className="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">
            {this.props.t("actions.delete")}
          </span>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { feature } = this.props;
    return childRoutes(this.props.route, {
      childProps: { feature, sessionName: "backend-feature-update" }
    });
  }

  render() {
    const t = this.props.t;
    const feature = this.feature(this.props);
    const isNew = this.isNew(this.props);
    const authProps = isNew
      ? { entity: "feature", ability: "create" }
      : { entity: feature, ability: "update" };
    const previewFeature = this.previewableFeature(this.props);

    if (!authProps.entity) return null;

    return (
      <Authorize
        failureFatalError={{
          body: t(`backend.features.preview.unauthorized_${authProps.ability}`)
        }}
        {...authProps}
      >
        <div>
          {isNew ? this.newHeader() : this.featureHeader(feature)}
          <Layout.BackendPanel>
            {feature || isNew ? (
              <section>
                {previewFeature ? (
                  <div className="form-secondary">
                    <SectionLabel
                      label={t("backend.features.preview.section_title")}
                    />
                    <div>
                      <FrontendLayout.Splash feature={previewFeature} preview />
                      <Instructions
                        className="space-bottom"
                        instructions={t(
                          "backend.features.preview.instructions"
                        )}
                      />
                    </div>
                  </div>
                ) : null}
                {this.renderRoutes()}
              </section>
            ) : null}
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(FeatureDetailContainer))
);
