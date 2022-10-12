import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { login, getAccessToken, googleLogin, facebookLogin, authActions } from "../redux/authSlice";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

const LoginScreen = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  
  const [loginErr, setLoginErr] = useState(null)

  const dispatch = useDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { loading, error, userData, loginMessage} = useSelector(
    (state) => state.authReducers
  );

  console.log(error)

  useEffect(() => {
    dispatch(authActions.resetLogin());

    if(userData.userInfo) {

      navigate(redirect)
    }

    // if (userData?.success) {
    //   navigate(redirect);
    // }
  }, [userData, navigate, redirect, dispatch]);




  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    dispatch(login(loginData));
  };

  const responseGoogle = async (res) => {
    let tokenId = res.tokenId;

    const response = await dispatch(googleLogin(tokenId));

    const { payload } = response;

    // const { message } = payload;

    if(payload === undefined || payload.message === "Invalid credentials") {
      // const {error} = response;

      const {message} = payload

      setLoginErr(message)
    } else if (payload.message === "Login success!") {
      // navigate("/");
      dispatch(getAccessToken())
      navigate(redirect)
    }
  };

  const responseFacebook = async (res) => {
    let {accessToken, userID} = res;

    const response = await dispatch(facebookLogin({accessToken, userID}));

    const { payload } = response;

    if(payload) {
      const { message } = payload;

      if (message === "Login success!") {
        dispatch(getAccessToken())
        navigate(redirect)
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign in </h1>
      {loginErr === "Invalid credentials" && <Message variant="danger">{loginErr}</Message>}
      {loginMessage === "Invalid credentials" && <Message variant="danger">{loginMessage}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
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

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Sign In
        </Button>
      </Form>
      <div className="hr py-2" style={{color: "crimson"}}>Or Login with</div>

      <Row className="py-1">
        <Col md={12} className="social">
        <GoogleLogin
          clientId="739747282033-760ia9gummv0ua9k4can89kf7ptuvnvb.apps.googleusercontent.com"
          buttonText="Login with google"
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
          fields="name,email,picture"
          // onClick={componentClicked}
          callback={responseFacebook}
        />
        </Col>
      </Row>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>

      <Row className="py-3">
        <Col>
          <Link to={"/forgetpassword"}>
            Forgot your password
          </Link>
        </Col>
      </Row>


    </FormContainer>
  );
};

export default LoginScreen;
