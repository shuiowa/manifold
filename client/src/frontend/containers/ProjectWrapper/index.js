import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useFromStore } from "hooks";
import { projectsAPI } from "api";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";

export default function ProjectWrapper({ route }) {
  const { id } = useParams();
  const { data: project, response } = useFetch({
    request: [projectsAPI.show, id]
  });
  const { path } = useRouteMatch();
  const location = useLocation();
  const isHomePage = location.pathname === path;
  const settings = useFromStore("settings", "select");
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { t } = useTranslation();

  const breadcrumbsCallback = useCallback(
    () => getJournalBreadcrumbs(project, t, libraryDisabled),
    [project, t, libraryDisabled]
  );

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? breadcrumbsCallback()
    : null;

  return (
    <>
      {project && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      )}
      <CheckFrontendMode
        debugLabel="ProjectWrapper"
        project={project}
        isProjectHomePage={isHomePage}
      />
      <RedirectToFirstMatch
        from={lh.link("frontendProject")}
        candidates={[
          {
            label: "All Projects",
            route: "frontendProjectsAll"
          }
        ]}
      />
      {childRoutes(route, {
        childProps: {
          project,
          response,
          settings,
          journalBreadcrumbs
        }
      })}
    </>
  );
}

ProjectWrapper.displayName = "Frontend.Containers.ProjectWrapper";

ProjectWrapper.propTypes = {
  route: PropTypes.object
};
