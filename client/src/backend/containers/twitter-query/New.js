import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import TwitterQuery from "backend/components/twitter-query";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export class TwitterQueryNewContainer extends Component {
  static displayName = "TwitterQuery.New";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    twitterQuery: PropTypes.object,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.defaultQuery = { attributes: { active: true } };
  }

  handleSuccess = () => {
    const projectId = this.props.match.params.pId;
    const path = lh.link("backendProjectSocial", projectId);
    this.props.history.push(path);
  };

  render() {
    const pId = this.props.match.params.pId;

    return (
      <section>
        <Navigation.DrawerHeader
          title={this.props.t("backend_entities.projects.forms.twitter.title")}
          icon="activityTweet64"
        />
        <TwitterQuery.Form
          name={requests.beTwitterQueryCreate}
          projectId={pId}
          twitterQuery={this.defaultQuery}
          successHandler={this.handleSuccess}
          notificationScope="global"
        />
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(TwitterQueryNewContainer));
