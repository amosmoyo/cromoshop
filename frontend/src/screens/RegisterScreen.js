import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { register, authAction } from "../redux/authSlice";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [authMess, setAuthMessage] = useState(null);
  const [registerSuccess, setregisterSuccess] = useState(false)

  const dispatch = useDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  console.log(location.search.split("=")[1], 111);

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const {
    loading,
    error,
    userData,
    message: authMessage,
    success,
  } = useSelector((state) => state.authReducers);

  useEffect(() => {
    dispatch(authAction.resetRegister());
    if (success) {
      setregisterSuccess(true)
      // navigate(redirect);
      setAuthMessage(authMessage)
      setEmail("");
      setName("");
      setPassword("");
      setconfirmPassword("");
    }
  }, [userData, navigate, redirect, dispatch, success, authMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("password do not match");
    } else {
      const registerData = {
        email,
        password,
        name,
      };

      dispatch(register(registerData));
    }
  };

  console.log(authMessage);

  return (
    <FormContainer>
      <h1>Register</h1>
      {registerSuccess && <Message variant="success">{authMess}</Message>}
      <div>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have Account ?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </Col>
        </Row>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
