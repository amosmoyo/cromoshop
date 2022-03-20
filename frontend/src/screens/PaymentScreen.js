import React from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SavePaymentMethod } from "../redux/cartSlice";
import CheckoutProcess from "../components/CheckoutProcess";

const PaymentScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cartReducers);

  const [payment, setPayment] = React.useState("PayPal");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(SavePaymentMethod(payment));
    navigate("/order");
  };

  if (!shippingAddress) {
    navigate("/shipping");
  }

  return (
    <FormContainer>
      <CheckoutProcess step1 step2 step3 />
      {/* <h3>Payment</h3> */}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label as="legend">Select payment method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPayment(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPayment(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3" onClick={handleSubmit}>Continue</Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
