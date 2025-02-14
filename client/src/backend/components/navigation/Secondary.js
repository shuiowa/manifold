import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";

import BlurOnLocationChange from "hoc/BlurOnLocationChange";
import Authorize from "hoc/Authorize";
import { withTranslation } from "react-i18next";

export class NavigationSecondary extends Component {
  static displayName = "Navigation.Secondary";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object,
    panel: PropTypes.bool,
    ariaLabel: PropTypes.string,
    t: PropTypes.func
  };

  pathForLink(link) {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  }

  renderItem(link) {
    return (
      <li key={link.route}>
        <NavLink to={this.pathForLink(link)} activeClassName="active">
          {link.label}
        </NavLink>
      </li>
    );
  }

  ariaLabel() {
    if (this.props.ariaLabel) {
      return this.props.ariaLabel;
    } else {
      return this.props.t("navigation.secondary");
    }
  }

  renderContents(props) {
    const navClasses = classnames({
      "secondary-nav": true,
      "panel-nav": props.panel
    });

    return (
      <nav className={navClasses} aria-label={this.ariaLabel()}>
        <ul>
          {this.props.links.map(link => {
            if (link.ability)
              return (
                <Authorize
                  key={`${link.route}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                >
                  {this.renderItem(link)}
                </Authorize>
              );
            return this.renderItem(link);
          })}
        </ul>
      </nav>
    );
  }

  renderPanel(props) {
    return <aside className="aside">{this.renderContents(props)}</aside>;
  }

  renderNav(props) {
    if (props.panel) return this.renderPanel(props);
    return this.renderContents(props);
  }

  render() {
    return (
      <BlurOnLocationChange location={this.props.location}>
        {this.renderNav(this.props)}
      </BlurOnLocationChange>
    );
  }
}

export default withTranslation()(withRouter(NavigationSecondary));
