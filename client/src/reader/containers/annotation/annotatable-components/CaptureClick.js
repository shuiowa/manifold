import React, { Component } from "react";
import PropTypes from "prop-types";
import selectionHelpers from "./selectionHelpers";
import isString from "lodash/isString";

export default class AnnotatableCaptureClick extends Component {
  static propTypes = {
    activeAnnotation: PropTypes.string,
    updateActiveAnnotation: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  doesElementContainAnnotationAndHighlight(el) {
    return (
      this.doesElementContainRemovableHighlight(el) &&
      this.doesElementContainAnnotation(el)
    );
  }

  doesElementContainAnnotation(el) {
    if (!el) return false;
    const { textAnnotationIds } = el.dataset;
    return isString(textAnnotationIds) && textAnnotationIds.length > 0;
  }

  doesElementContainRemovableHighlight(el) {
    if (!el) return false;
    const { removableHighlightId } = el.dataset;
    return isString(removableHighlightId) && removableHighlightId.length > 0;
  }

  handleMouseUp = event => {
    if (!event || !event.target) return;

    // If the mouseup happens over the currently active highlight, prevent text
    // deselection.
    const id = event.target.dataset.removableHighlightId;
    if (id === this.props.activeAnnotation) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  handleKeyUp = event => {
    if (!event || !event.target || event.key !== " ") return;
    // handle spacebar keyup like a click (see https://adrianroselli.com/2022/04/brief-note-on-buttons-enter-and-space.html)
    this.handleClick(event, true);
  };

  handleKeyDown = event => {
    if (!event || !event.target || (event.key !== "Enter" && event.key !== " "))
      return;
    // handle enter keydown like a click
    if (event.key === "Enter") this.handleClick(event, true);
    // prevent scroll on spacebar keydown if focused on an annotation or highlight
    if (event.key === " ") {
      const el = event.target;
      if (
        this.doesElementContainAnnotationAndHighlight(el) ||
        this.doesElementContainRemovableHighlight(el) ||
        this.doesElementContainAnnotation(el)
      )
        event.preventDefault();
    }
  };

  handleClick = (event, isKeyEvent = false) => {
    if (!event || !event.target) return;
    const el = event.target;
    if (this.doesElementContainAnnotationAndHighlight(el))
      this.handleDisambiguationClick(event, el);
    if (this.doesElementContainRemovableHighlight(el))
      return this.handleRemovableHighlightClick(event, el, isKeyEvent);
    if (this.doesElementContainAnnotation(el))
      return this.handleAnnotationClick(event, el, isKeyEvent);
  };

  handleDisambiguationClick(eventIgnored, el) {
    this.setState({
      showAnnotationsInDrawer: event => {
        this.clearNativeSelection();
        this.handleAnnotationClick(event, el);
      }
    });
  }

  handleRemovableHighlightClick(event, el, isKeyEvent) {
    event.preventDefault();
    event.stopPropagation();
    const id = el.dataset.removableHighlightId;
    this.props.updateActiveAnnotation(id, event, { isKeyEvent });
  }

  handleAnnotationClick(event, el, isKeyEvent) {
    event.preventDefault();
    const link = selectionHelpers.closest(el, "a");
    const annotationIds = this.elementAnnotationIds(el);
    if (link)
      return this.showLinkMenu(event, el, annotationIds, link, isKeyEvent);
    this.props.actions.openViewAnnotationsDrawer(annotationIds);
  }

  showLinkMenu(event, el, annotationIds, link, isKeyEvent) {
    event.stopPropagation();
    const eventInfo = {
      annotationIds,
      link,
      isKeyEvent
    };
    this.props.updateActiveAnnotation(annotationIds[0], event, eventInfo);
  }

  elementAnnotationIds(el, type = "textAnnotationIds") {
    if (!el) return null;
    const ids = el.dataset[type];
    return ids.split(",");
  }

  render() {
    /* Element captures events that bubble from nested interactive elements */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        className="no-focus-outline"
        onClick={this.handleClick}
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
        onMouseUp={this.handleMouseUp}
        tabIndex={-1}
      >
        {this.props.children}
      </div>
    );
  }
}
