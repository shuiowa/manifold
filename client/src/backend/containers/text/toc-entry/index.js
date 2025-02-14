import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddEditTOCEntryForm from "backend/components/authoring/AddEditTOCEntryForm";
import { useParams } from "react-router-dom";

export default function AddEditTOCEntryContainer({ tree, ...props }) {
  const { t } = useTranslation();
  const { entryId } = useParams();

  return (
    <section>
      <Navigation.DrawerHeader
        title={
          entryId
            ? t("backend.forms.text_toc.edit_header")
            : t("backend.forms.text_toc.add_header")
        }
      />
      <AddEditTOCEntryForm entry={tree.items[entryId]} tree={tree} {...props} />
    </section>
  );
}

AddEditTOCEntryContainer.displayName = "Text.TOC.Entry";

AddEditTOCEntryContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired,
  toc: PropTypes.array,
  tree: PropTypes.object,
  setTree: PropTypes.func.isRequired
};
