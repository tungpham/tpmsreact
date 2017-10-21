import React from 'react';
import { Container, Row, Col, Button, Form } from 'reactstrap';
import NumbersList from '../../components/NumbersList';
import { withHandlers, compose } from 'recompose';
import actions from '../../actions';
import { connect } from 'react-redux';
import * as selectors from '../../selectors/data';
import { reduxForm, Field } from 'redux-form/immutable';
import { renderField, renderCheckField } from './SignIn.js';

export const enhanceForm = compose(
  connect((state, { number }) => {
    const data = selectors.getById(state, "numbers", number);

    return {
      form: "numbers.edit." + number,
      data,
      initialValues: data
    };
  }),
  withHandlers({
    onSubmit: ({ number, dispatch }) => values => {
      dispatch(
        actions.numbers.edit.request(
          values.get("id"),
          values
            .setIn(
              ["smsForwarding", "phone"],
              values.getIn(["forwarding", "phone"], "")
            )
            .setIn(
              ["smsForwarding", "email"],
              values.getIn(["forwarding", "email"], "")
            )
            .toJS()
        )
      );
    }
  }),
  reduxForm()
);

export const NumberForm = enhanceForm(({ data, handleSubmit, submitting }) => (
  <div>
    <Row className="justify-content-between">
      <span className="align-middle">
        <span
          className={`flag-icon flag-icon-${data.get("country")} rounded-circle avatar-flag`}
        />
        <strong>{data.get("name")}</strong>
      </span>
      <Button outline color="danger">Delete</Button>
    </Row>
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-center">
        <Col md="4">
          <Field
            name="name"
            type="text"
            label="Friendly name"
            showLabel
            component={renderField}
          />
        </Col>
        <Col md="4">
          <Field
            name="recording"
            right
            label="Enable recording"
            className="right-checkbox"
            type="checkbox"
            component={renderCheckField}
          />
        </Col>
        <Col md="4">
          <Field
            name="notification"
            right
            label="Enable notifications"
            className="right-checkbox"
            type="checkbox"
            component={renderCheckField}
          />
        </Col>
      </Row>
      <Row>
        <Field
          name="smsForwarding.phone"
          label="Phone"
          className="right-checkbox"
          type="checkbox"
          component={renderCheckField}
        />
      </Row>
      <Row>
        <Col md="4">
          <Field
            name="forwarding.phone"
            type="text"
            showLabel
            component={renderField}
          />
        </Col>
      </Row>
      <Row>
        <Field
          name="smsForwarding.email"
          label="Email"
          className="right-checkbox"
          type="checkbox"
          component={renderCheckField}
        />
      </Row>
      <Row>
        <Col md="4">
          <Field
            name="forwarding.email"
            type="text"
            showLabel
            component={renderField}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Button disabled={submitting} color="other">
          Save
        </Button>
      </Row>
    </Form>
  </div>
));

export const NumberSettings = ({ match: { params }, redirectNumber }) => (
  <div className="number-settings basic-root">
    <Container fluid className="number-settings-container basic-container">
      <Row className="number-settings-row basic-row">
        <Col lg="3" className="list">
          <NumbersList active={params.number} onClick={redirectNumber} />
        </Col>
        <Col lg="9" className="settings">
          {params.number &&
            <NumberForm number={params.number} key={params.number} />}
        </Col>
      </Row>
    </Container>
  </div>
);

export const enhance = compose(
  connect(),
  withHandlers({
    redirectNumber: ({ history }) => number =>
      history.push(`/settings/${number.get("id")}`)
  })
);

export default enhance(NumberSettings);
