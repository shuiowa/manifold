import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export class MakersNewContainer extends PureComponent {
  static displayName = "Makers.New";

  static propTypes = {
    history: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  redirectToMaker(maker) {
    const path = lh.link("backendRecordsMaker", maker.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  handleSuccess = maker => {
    this.redirectToMaker(maker);
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader
          title={this.props.t("backend.forms.maker.new_header")}
        />
        <Form
          successHandler={this.handleSuccess}
          options={{ adds: requests.beMakers }}
        />
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(MakersNewContainer));
