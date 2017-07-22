import React from "react";
import { Container, Row, Col } from "reactstrap";
import NumbersList from "../../components/NumbersList";
import { withHandlers, compose } from "recompose";
import actions from "../../actions";
import { connect } from "react-redux";
import * as selectors from "../../selectors/data";
import fetch from "../../lib/fetch";
import { NavLink as Link } from "react-router-dom";
import { List } from "immutable";
import moment from "moment";

export const enhancePane = compose(
  connect((state, { number }) => ({
    state: selectors.getDataState(state, `number.${number}.statistics`)
  })),
  fetch(
    ({ dispatch, number }) => dispatch(actions.statistics.load.request(number)),
    ({ state }) => state.loaded && !state.loading,
    (p, np) => p.number !== np.number
  )
);

export const UsagePane = enhancePane(({ state, number, type }) => (
  <div>
    <Row className="usage-header">
      <Col lg="3" />
      <Col lg="3">
        Balance: ${state.getIn(["data", "balance"]).toFixed(3)}
      </Col>
      <Col lg="3">
        <Link to={"/balance/" + number} className="add-balance">
          ADD BALANCE
        </Link>
      </Col>
      <Col lg="3">
        <div className="usage-progress-text">Usage: <strong>90%</strong></div>
        <div className="usage-progress-container">
          <div className="usage-progress" style={{ width: "90%" }} />
        </div>
      </Col>
    </Row>
    <Row className="usage-navigation">
      <Link to={"/usage/" + number + "/conversation"}>Message</Link>
      <Link to={"/usage/" + number + "/voice"}>Voice</Link>
    </Row>
    {type &&
      <Row className="usage-card-container">
        <div className="usage-card">
          <Row className="usage-aggregates">
            {state
              .getIn(["data", type, "aggregates"], List())
              .map(aggregate => (
                <div className="usage-aggregate" key={aggregate.get("title")}>
                  <div className="usage-aggregate-name">
                    {aggregate.get("name")}
                  </div>
                  <div className="usage-aggregate-value">
                    {aggregate.get("value")}
                  </div>
                </div>
              ))}
          </Row>
          <Row className="usage-values">
            <table className="table table-striped table-bordered">
              <thead>
                <tr><th>Date</th><th>Value</th></tr>
              </thead>
              <tbody>
                {state.getIn(["data", type, "data"]).map(val => (
                  <tr>
                    <td>{moment(val.get("date")).format("LL")}</td>
                    <td>{val.get("value")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Row>
        </div>
      </Row>}
  </div>
));

export const Usage = ({ match: { params }, redirectNumber }) => (
  <div className="usage basic-root">
    <Container fluid className="usage-container basic-container">
      <Row className="usage-row basic-row">
        <Col lg="3" className="list">
          <NumbersList active={params.number} onClick={redirectNumber} />
        </Col>
        <Col lg="9" className="statistics">
          {params.number &&
            <UsagePane number={params.number} type={params.type} />}
        </Col>
      </Row>
    </Container>
  </div>
);

export const enhance = compose(
  connect(),
  withHandlers({
    redirectNumber: ({ history }) => number =>
      history.push(`/usage/${number.get("id")}/conversation`)
  })
);

export default enhance(Usage);
