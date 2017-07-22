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
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import {
  withState,
  compose,
  defaultProps,
  withProps,
  withPropsOnChange,
  withHandlers
} from "recompose";
import { reduxForm, Field } from "redux-form/immutable";
import { email, required, length } from "../../lib/validators";
import MaskedInput from "react-maskedinput";
import creditCardType from "credit-card-type";

export const renderField = defaultProps({
  component: Input
})(
  ({
    label,
    type,
    className,
    component: Component,
    input,
    placeholder,
    meta: { touched, error, warning }
  }) => (
    <FormGroup
      className={
        className +
          (error && touched ? " has-danger" : "") +
          (warning && touched ? " has-warning" : "")
      }
    >
      <Label>{label}</Label>
      <Component type={type} placeholder={placeholder || label} {...input} />
      {touched &&
        ((error && <div className="form-control-feedback">{error}</div>) ||
          (warning && <div className="form-control-feedback">{warning}</div>))}
    </FormGroup>
  )
);

export const enhanceField = withPropsOnChange(
  ["component"],
  ({ component }) => ({
    component: component ? withProps({ component })(renderField) : renderField
  })
);

export const InputField = enhanceField(({ component, ...props }) => (
  <Field {...props} component={component} />
));

export const enhanceMaskedField = withPropsOnChange(["mask"], ({ mask }) => ({
  component: withProps({
    mask,
    className: "form-control",
    placeholderChar: " "
  })(MaskedInput)
}));

export const MaskedField = enhanceMaskedField(props => (
  <InputField {...props} />
));

export const allowedTypes = ["maestro", "visa", "master-card"];

export const getType = value => {
  if (value) {
    const t = value.replace(/ /g, "");

    if (t.length > 0) {
      const types = creditCardType(t);

      if (types.length > 0 && allowedTypes.indexOf(types[0].type) !== -1) {
        const type = types[0];

        if (type.type === "master-card") {
          return "mastercard";
        }

        return type.type;
      }
    }
  }

  return null;
};

const creditCardValidate = value => {
  if (!value) return undefined;

  const t = value.replace(/ /g, "");

  const types = creditCardType(t);

  if (types.length > 0 && allowedTypes.indexOf(types[0].type) !== -1) {
    const type = types[0];

    if (!new RegExp(type.exactPattern).test(t)) return "Invalid credit card";
  } else {
    return "Invalid credit card provider";
  }

  return undefined;
};

export const CreditCardInput = ({ value, ...props }) => {
  const type = getType(value);

  const className = type ? "pf pf-" + type : null;

  return (
    <InputGroup>
      <MaskedInput
        mask="1111 1111 1111 1111"
        placeholderChar=" "
        className="form-control"
        {...props}
      />
      {type &&
        <InputGroupAddon>
          <i className={className} />
        </InputGroupAddon>}
    </InputGroup>
  );
};

export const CreditCardField = props => (
  <InputField {...props} component={CreditCardInput} />
);

export const enhanceForm = compose(
  withHandlers({
    onSubmit: () => values => {
      alert(values.toJS());
    }
  }),
  reduxForm({ form: "credit-card" })
);

export const CreditCardForm = enhanceForm(({ handleSubmit, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <InputField
      name="text"
      type="name"
      label="Cardholder name"
      validate={required}
    />
    <CreditCardField
      name="card"
      label="Card number"
      validate={[required, creditCardValidate]}
    />
    <Row>
      <Col xs="3">
        <MaskedField
          mask="11"
          name="month"
          label="Month"
          placeholder="mm"
          validate={[required, length(2)]}
        />
      </Col>
      <Col xs="3">
        <MaskedField
          mask="1111"
          name="year"
          label="Year"
          placeholder="yyyy"
          validate={[required, length(4)]}
        />
      </Col>
      <Col xs="6">
        <MaskedField
          mask="111"
          name="cvv"
          label="CVV"
          placeholder=""
          validate={[required, length(3)]}
        />
      </Col>
    </Row>
    <FormGroup>
      <button
        type="submit"
        className="btn btn-block btn-balance"
        disabled={submitting}
      >
        Pay now
      </button>
    </FormGroup>
  </Form>
));

export const Tab = ({
  active,
  title,
  description,
  header,
  children,
  onSelect
}) => (
  <div className={"balance-tab" + (active ? " active" : "")}>
    <div className="balance-tab-header" onClick={onSelect}>
      <div className={"balance-tab-header-button" + (active ? " active" : "")}>
        <div className="balance-tab-header-button-circle" />
      </div>
      <div className="balance-tab-header-container">
        <div className="balance-tab-header-title">
          {title}
        </div>
        {description &&
          <div className="balance-tab-header-description">
            {description}
          </div>}
      </div>

      <div className="balance-tab-header-right">
        {header}
      </div>
    </div>
    {active &&
      <div className="balance-tab-content">
        {children}
      </div>}
  </div>
);

export const Balance = ({ type, onTypeChange }) => (
  <div className="balance-container">
    <div className="balance-block">
      <Tab
        active={type === "bank"}
        title="Credit & Debit cards"
        description="Transiction fee may apply"
        header={
          <div className="cards">
            <i className="pf pf-visa" />
            <i className="pf pf-mastercard" />
            <i className="pf pf-maestro" />
          </div>
        }
        onSelect={() => onTypeChange("bank")}
      >
        <CreditCardForm />
      </Tab>
      <Tab
        active={type === "stripe"}
        title="Pay with Stripe"
        description="Free of charge"
        onSelect={() => onTypeChange("stripe")}
      >
        <Button block color="balance">Pay with Stripe</Button>
      </Tab>
      <Tab
        active={type === "paypal"}
        title="Pay with Paypal"
        description="Transiction fee may apply"
        header={
          <div className="cards paypal">
            <i className="pf pf-paypal" />
          </div>
        }
        onSelect={() => onTypeChange("paypal")}
      >
        <Button block color="balance">Pay with Paypal</Button>
      </Tab>
    </div>
  </div>
);

export const enhance = compose(withState("type", "onTypeChange", "bank"));

export default enhance(Balance);
