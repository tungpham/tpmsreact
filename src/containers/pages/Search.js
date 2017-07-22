import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import {
  withHandlers,
  withProps,
  compose,
  branch,
  renderComponent
} from "recompose";
import actions from "../../actions";
import * as selectors from "../../selectors/data";
import { NavLink as Link } from "react-router-dom";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form/immutable";
import { List } from "immutable";
import Spinner from "halogen/BounceLoader";

//export const Field = { label };

export const enhanceForm = compose(
  connect(() => ({})),
  withHandlers({
    onSubmit: ({ dispatch }) => values =>
      dispatch(actions.search.request(values.set("_", "_").toJS()))
  }),
  reduxForm({ form: "search" })
);

const DropdownInput = ({ value, items, onChange, label }) => (
  <UncontrolledDropdown>
    <DropdownToggle caret block>
      {value ? (items.find(x => x.value == value) || {}).title : label}
    </DropdownToggle>
    <DropdownMenu>
      {items.map(item => (
        <DropdownItem key={item.value} onClick={() => onChange(item.value)}>
          {item.title}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

const DropdownField = ({ input, ...props }) => (
  <DropdownInput {...props} {...input} />
);

export const SearchForm = enhanceForm(({ handleSubmit, submitting }) => (
  <Form className="search-form" onSubmit={handleSubmit}>
    <FormGroup>
      <Label>Country</Label>
      <Field
        name="country"
        component={DropdownField}
        label="Country"
        items={[
          { value: "us", title: "United States" },
          { value: "uk", title: "United Kingdom" }
        ]}
      />
    </FormGroup>
    <FormGroup>
      <Label>Number</Label>
      <Field
        name="number"
        type="text"
        className="form-control"
        component="input"
      />
    </FormGroup>
    <FormGroup>
      <Label>Match to</Label>
      <Field
        name="matchTo"
        component={DropdownField}
        label="Last part of number"
        items={[{ value: "1", title: "1" }, { value: "2", title: "2" }]}
      />
    </FormGroup>
    <FormGroup>
      <Row>
        <div className="col-xs-3 form-check form-check-inline">
          <Label check>
            <Field
              name="capabilities.voice"
              type="checkbox"
              component="input"
            />
            Voice
          </Label>
        </div>
        <div className="col-xs-3 form-check form-check-inline">
          <Label check>
            <Field name="capabilities.sms" type="checkbox" component="input" />
            SMS
          </Label>
        </div>
        <div className="col-xs-3 form-check form-check-inline">
          <Label check>
            <Field name="capabilities.mms" type="checkbox" component="input" />
            MMS
          </Label>
        </div>
      </Row>
    </FormGroup>
    <FormGroup>
      <Button block color="other">Search</Button>
    </FormGroup>
  </Form>
));

export const enhanceResults = compose(
  connect(state => ({
    state: selectors.getDataState(state, "search")
  })),
  withProps(({ state }) => ({
    results: state.get("data") || List()
  })),
  branch(
    ({ state }) => !state.get("loading"),
    t => t,
    renderComponent(() => (
      <Row className="justify-content-center load-container">
        <Spinner color="#ccc" />
      </Row>
    ))
  )
);

export const SearchResults = enhanceResults(({ state, results }) => (
  <table className="table table-stripped search-results">
    <thead>
      <tr>
        <th>Number</th>
        <th>Type</th>
        <th colSpan="3">Capabilities</th>
        <th>Price</th>
        <th />
      </tr>
      <tr>
        <th />
        <th />
        <th>Voice</th>
        <th>SMS</th>
        <th>MMS</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      {results.map(result => (
        <tr key={result.get("id")}>
          <td><strong>{result.get("number")}</strong></td>
          <td className="type-field">{result.get("type")}</td>
          <td className="icon-field">
            {result.getIn(["capabilities", "voice"]) === true
              ? <i className="fa fa-phone" />
              : null}
          </td>
          <td className="icon-field">
            {result.getIn(["capabilities", "sms"]) === true
              ? <i className="fa fa-comment" />
              : null}
          </td>
          <td className="icon-field">
            {result.getIn(["capabilities", "mms"]) === true
              ? <i className="fa fa-picture-o" />
              : null}
          </td>
          <td className="price-field">
            <div className="price">
              ${result.get("price", 0).toPrecision(2)}
            </div>
            <div className="description">monthly</div>
          </td>
          <td><Button color="other">Buy</Button></td>
        </tr>
      ))}
    </tbody>
  </table>
));

export const Search = ({ match: { params }, redirectNumber }) => (
  <div className="search basic-root">
    <Container fluid className="search-container basic-container">
      <Row className="search-row basic-row">
        <Col lg="3" className="list">
          <SearchForm />
        </Col>
        <Col lg="9" className="search-col">
          <SearchResults />
        </Col>
      </Row>
    </Container>
  </div>
);

export const enhance = compose(connect());

export default enhance(Search);
