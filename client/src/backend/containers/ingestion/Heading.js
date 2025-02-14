import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import truncate from "lodash/truncate";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

class IngestionHeader extends Component {
  static displayName = "Ingestion.Header";

  static propTypes = {
    ingestion: PropTypes.object,
    reingestion: PropTypes.bool,
    t: PropTypes.func
  };

  get ingestion() {
    return this.props.ingestion;
  }

  get title() {
    const title =
      this.ingestion.attributes.sourceFileName ||
      this.ingestion.attributes.externalSourceUrl;
    if (!title) return "";
    return truncate(title, { length: 30 });
  }

  get currentState() {
    return this.props.t(
      `backend.ingestion.states.${this.ingestion.attributes.state}`
    );
  }

  get strategy() {
    return (
      this.ingestion.attributes.strategyLabel ||
      this.props.t("backend.ingestion.no_strategy")
    );
  }

  get textId() {
    if (this.props.reingestion) return this.ingestion.attributes.textId;

    return this.props.t("backend.ingestion.id_placeholder");
  }

  titleBlock() {
    return (
      <div className="backend-header__title-block">
        <h1 className="backend-header__title">{this.title}</h1>
      </div>
    );
  }

  figureBlock() {
    return (
      <figure
        className={classNames(
          "backend-header__figure-block",
          "backend-header__figure-block--shift-left"
        )}
      >
        <div className="backend-header__figure">
          <IconComposer
            icon="textsBook64"
            size={56}
            className="backend-header__type-icon"
          />
        </div>
      </figure>
    );
  }

  render() {
    if (!this.props.ingestion) return null;

    const Property = props => (
      <div className="ingestion-output__item">
        <p className="ingestion-output__label">{props.label}</p>
        <p className="ingestion-output__value">{props.value}</p>
      </div>
    );

    return (
      <div className="backend-header">
        <div className="backend-header__inner">
          <header
            className={classNames(
              "backend-header__content-flex-wrapper",
              "backend-header__content-flex-wrapper--aib",
              "backend-header__content-flex-wrapper--tight"
            )}
          >
            {this.figureBlock()}
            {this.titleBlock()}
          </header>
          <div
            aria-live="polite"
            aria-atomic
            className="backend-header__body ingestion-output__properties"
          >
            <Property
              label={this.props.t("backend.ingestion.current_state_label")}
              value={this.currentState}
            />
            <Property
              label={this.props.t("backend.ingestion.strategy_label")}
              value={this.strategy}
            />
            <Property
              label={this.props.t("backend.ingestion.id_label")}
              value={this.textId}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(IngestionHeader);
