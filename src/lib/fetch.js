import React from "react";
import { compose, branch, renderComponent, lifecycle } from "recompose";
import Spinner from "halogen/BounceLoader";
import { Row } from "reactstrap";

export const customFetch = (
  getFn,
  hasLoaded,
  Loader,
  shouldUpdate = () => false
) =>
  compose(
    lifecycle({
      componentWillMount() {
        getFn(this.props);
      },

      componentWillUpdate(np) {
        if (shouldUpdate(np, this.props)) {
          getFn(np);
        }
      }
    }),
    branch(hasLoaded, t => t, renderComponent(Loader))
  );

export default (getFn, hasLoaded, shouldUpdate = () => false) =>
  customFetch(
    getFn,
    hasLoaded,
    () => (
      <Row className="justify-content-center load-container">
        <Spinner color="#ccc" />
      </Row>
    ),
    shouldUpdate
  );
