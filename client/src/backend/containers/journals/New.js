import React, { PureComponent } from "react";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Authorize from "hoc/Authorize";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";

class JournalsNew extends PureComponent {
  static displayName = "Journals.New";

  static propTypes = {
    history: PropTypes.object
  };

  redirectToJournal(journal) {
    const path = lh.link("backendJournal", journal.id);
    this.props.history.push(path);
  }

  handleSuccess = journal => {
    this.redirectToJournal(journal);
  };

  render() {
    const t = this.props.t;
    return (
      <Authorize
        entity={"journal"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <div>
          <Navigation.DetailHeader
            type="journal"
            title={t("backend_entities.journals.forms.new_header")}
            showUtility={false}
            note={t("backend_entities.journals.forms.new_instructions")}
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              name="backend-create-journal"
              update={journalsAPI.update}
              create={journalsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.FieldGroup
                label={t(
                  "backend_entities.journals.forms.title_descript_label"
                )}
              >
                <Form.TextInput
                  validation={["required"]}
                  focusOnMount
                  label={t("backend_entities.journals.forms.title_label")}
                  name="attributes[title]"
                  placeholder={t(
                    "backend_entities.journals.forms.title_placeholder"
                  )}
                />
                <Form.TextInput
                  label={t("backend_entities.journals.forms.subtitle_label")}
                  name="attributes[subtitle]"
                  placeholder={t(
                    "backend_entities.journals.forms.subtitle_placeholder"
                  )}
                />
                <Form.TextArea
                  label={t("backend_entities.journals.forms.descript_label")}
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text={t("backend_entities.journals.forms.submit_label")}
                cancelRoute={lh.link("backendJournals")}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(JournalsNew);
