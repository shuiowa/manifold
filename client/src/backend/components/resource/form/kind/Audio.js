import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindAudio extends PureComponent {
  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("backend.forms.resource.audio_file")}
        accepts="audio"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}

export default withTranslation()(ResourceFormKindAudio);
