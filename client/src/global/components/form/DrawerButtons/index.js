import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function DrawerButtons({
  showCancel = false,
  cancelUrl,
  submitLabel = "actions.save",
  disableSubmit = false
}) {
  const history = useHistory();
  const { t } = useTranslation();

  const buttonClasses = "button-secondary button-secondary--outlined";

  const handleCancelClick = e => {
    e.preventDefault();
    cancelUrl ? history.push(cancelUrl) : history.goBack();
  };

  return (
    <Styled.ButtonGroup>
      <button type="submit" className={buttonClasses} disabled={disableSubmit}>
        <span>{t(submitLabel)}</span>
      </button>
      {showCancel && (
        <button
          onClick={handleCancelClick}
          className={classNames(buttonClasses, "button-secondary--dull")}
        >
          <span>{t("actions.cancel")}</span>
        </button>
      )}
    </Styled.ButtonGroup>
  );
}

DrawerButtons.propTypes = {
  showCancel: PropTypes.bool,
  cancelUrl: PropTypes.string,
  submitLabel: PropTypes.string,
  disableSubmit: PropTypes.bool
};
