import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  authActions,
  googleLogin,
  facebookLogin,
  getAccessToken,
} from "../redux/authSlice";

import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [authMess, setAuthMessage] = useState(null);
  const [registerSuccess, setregisterSuccess] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const {
    loading,
    error,
    userData,
    message: authMessage,
    success,
  } = useSelector((state) => state.authReducers);

  useEffect(() => {
    dispatch(authActions.resetRegister());
    if (success) {
      setregisterSuccess(true);
      // navigate(redirect);
      setAuthMessage(authMessage);
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

  const responseGoogle = async (res) => {
    let tokenId = res.tokenId;

    const response = await dispatch(googleLogin(tokenId));

    const { payload } = response;

    const { message } = payload;

    if (message === "Login success!") {
      // navigate("/");
      dispatch(getAccessToken());
      navigate(redirect);
    }
  };

  const responseFacebook = async (res) => {
    let { accessToken, userID } = res;

    const response = await dispatch(facebookLogin({ accessToken, userID }));

    const { payload } = response;

    if (payload) {
      const { message } = payload;

      if (message === "Login success!") {
        dispatch(getAccessToken());
        navigate(redirect);
      }
    }
  };

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

          <Button type="submit" variant="primary" className="mt-3 w-100">
            Register
          </Button>
        </Form>


        <div className="hr py-2" style={{color: "crimson"}}>Or Signup with</div>

        <Row className="py-1">
          <Col md={12} className="social">
            <GoogleLogin
              clientId="739747282033-760ia9gummv0ua9k4can89kf7ptuvnvb.apps.googleusercontent.com"
              buttonText="signup with google"
              onSuccess={responseGoogle}
              onFailure={(err) => console.log("fail", err)}
              cookiePolicy={"single_host_origin"}
            />
          </Col>
        </Row>

        <Row className="py-1">
          <Col md={12} className="social">
            <FacebookLogin
              appId="705905767108848"
              autoLoad={false}
              textButton="signup with facebook"
              fields="name,email,picture"
              // onClick={componentClicked}
              callback={responseFacebook}
            />
          </Col>
        </Row>

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
