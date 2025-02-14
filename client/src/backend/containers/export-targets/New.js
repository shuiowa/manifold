import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import Form from "./Form";

export class ExportTargetsNewContainer extends PureComponent {
  static displayName = "ExportTargets.New";

  static propTypes = {
    history: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.defaultExportTarget = {
      attributes: {
        strategy: "sftp_key",
        configuration: {
          targetNameFormat: "%s.%e"
        }
      }
    };
  }

  redirectToExportTarget(exportTarget) {
    const path = lh.link("backendSettingsExportTargets", exportTarget.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  render() {
    return (
      <section>
        <Navigation.DrawerHeader
          title={this.props.t("backend.forms.export_target.header")}
        />
        <Form
          model={this.defaultExportTarget}
          onSuccess={exportTarget => this.redirectToExportTarget(exportTarget)}
          options={{ adds: requests.beExportTargets }}
        />
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(ExportTargetsNewContainer));
