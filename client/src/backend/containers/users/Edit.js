import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Dialog from "global/components/dialog";
import withConfirmation from "hoc/withConfirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

const { request, flush } = entityStoreActions;

export class UsersEditContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      user: select(requests.beUser, state.entityStore),
      createMakerResponse: get(
        state.entityStore.responses,
        requests.beMakerCreate
      )
    };
  };

  static displayName = "Users.Edit";

  static propTypes = {
    match: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    history: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  constructor(props) {
    super(props);
    this.state = {
      resetPassword: null
    };
  }

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchUser(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beUserUpdate, requests.beMakerCreate]));
  }

  get user() {
    return this.props.user;
  }

  fetchUser(id) {
    const call = usersAPI.show(id);
    const userRequest = request(call, requests.beUser);
    this.props.dispatch(userRequest);
  }

  handleUserDestroy = () => {
    const t = this.props.t;
    const heading = t("backend.forms.user.delete_modal_heading");
    const message = t("backend.forms.user.delete_modal_message");
    this.props.confirm(heading, message, this.destroyUser);
  };

  destroyUser = () => {
    const user = this.user;
    const call = usersAPI.destroy(user.id);
    const options = { removes: user };
    const userRequest = request(call, requests.beUserDestroy, options);
    this.props.dispatch(userRequest).promise.then(() => {
      this.props.history.push(lh.link("backendRecordsUsers"));
    });
  };

  unsubscribeUser = () => {
    const t = this.props.t;
    const heading = t("backend.forms.user.unsubscribe_modal_heading");
    const message = t("backend.forms.user.unsubscribe_modal_message");
    this.props.confirm(heading, message, () => {
      const adjustedUser = { ...this.user };
      adjustedUser.attributes.unsubscribe = true;

      const call = usersAPI.update(this.user.id, adjustedUser);
      const options = { notificationScope: "drawer" };
      const userRequest = request(call, requests.beUserUpdate, options);
      return this.props.dispatch(userRequest);
    });
  };

  closeResetDialog() {
    this.setState({ resetPassword: null });
  }

  handleResetPasswordClick = () => {
    const t = this.props.t;
    const heading = t("backend.forms.user.password_modal_heading");
    const message = t("backend.forms.user.password_modal_message");
    new Promise((resolve, reject) => {
      this.setState({
        resetPassword: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.closeResetDialog();
      },
      () => {
        this.closeResetDialog();
      }
    );
  };

  render() {
    if (!this.user) return null;
    const attr = this.user.attributes;
    const user = this.user;
    const t = this.props.t;

    return (
      <div>
        {this.state.resetPassword ? (
          <Dialog.ResetPassword
            uiProps={this.state.resetPassword}
            {...this.props}
          />
        ) : null}

        <Navigation.DrawerHeader
          title={`${attr.firstName} ${attr.lastName}`}
          buttons={[
            {
              onClick: this.handleResetPasswordClick,
              icon: "key32",
              label: t("backend.forms.user.reset_password")
            },
            {
              onClick: this.unsubscribeUser,
              icon: "mail32",
              label: t("backend.forms.user.unsubscribe")
            },
            {
              onClick: this.handleUserDestroy,
              icon: "delete32",
              label: t("actions.delete"),
              className: "utility-button__icon--notice"
            }
          ]}
        />

        <section>
          <FormContainer.Form
            model={this.user}
            name={requests.beUserUpdate}
            update={usersAPI.update}
            create={usersAPI.create}
            className="form-secondary"
            notificationScope="drawer"
          >
            <Form.TextInput
              focusOnMount
              label={t("backend.forms.user.email")}
              name="attributes[email]"
              placeholder={t("backend.forms.user.email")}
            />
            <Form.TextInput
              label={t("backend.forms.user.first_name")}
              name="attributes[firstName]"
              placeholder={t("backend.forms.user.first_name")}
            />
            <Form.TextInput
              label={t("backend.forms.user.last_name")}
              name="attributes[lastName]"
              placeholder={t("backend.forms.user.last_name")}
            />
            <Form.Select
              label={t("backend.forms.user.role_label")}
              name="attributes[role]"
              selected={user.attributes.role}
              options={[
                {
                  label: t("backend.forms.user.role_options.admin"),
                  value: "admin"
                },
                {
                  label: t("backend.forms.user.role_options.editor"),
                  value: "editor"
                },
                {
                  label: t("backend.forms.user.role_options.creator"),
                  value: "project_creator"
                },
                {
                  label: t("backend.forms.user.role_options.marketeer"),
                  value: "marketeer"
                },
                {
                  label: t("backend.forms.user.role_options.reader"),
                  value: "reader"
                }
              ]}
            />
            <Form.Save text="Save User" />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(UsersEditContainer))
);
