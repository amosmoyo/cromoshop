import React from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {SaveShippingAddress} from "../redux/cartSlice"
import CheckoutProcess from '../components/CheckoutProcess'

const ShippingScreen = () => {
  const {shippingAddress} = useSelector((state) => state.cartReducers);

  const [address, setAddress] = React.useState(shippingAddress?.address ? shippingAddress?.address : '');
  const [city, setCity] = React.useState(shippingAddress?.city ? shippingAddress?.city : '');
  const [postal, setPostal] = React.useState(shippingAddress?.postal ? shippingAddress?.postal : '');
  const [country, setCountry] = React.useState(shippingAddress?.country ? shippingAddress?.country : '' );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = {
      address, city, postal, country
    }
    dispatch(SaveShippingAddress(formData));

    navigate('/payment')

  };

  return (
    <FormContainer>
      <CheckoutProcess step1 step2 />
      <h3>Shippings</h3>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postal">
          <Form.Label>Postal Code </Form.Label>
          <Form.Control
            type="text"
            placeholder="enter postal code "
            value={postal}
            required
            onChange={(e) => setPostal(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter country "
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">Continue</Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
