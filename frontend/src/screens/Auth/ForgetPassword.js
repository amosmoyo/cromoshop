import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/authSlice";

const ForgetPassword = () => {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState(null);

  const dispatch = useDispatch();

  const { loading, error, success, forgotPasswordMessage } = useSelector(
    (state) => state.authReducers
  );

  React.useEffect(() => {
    setMessage(null)
  }, [])

  const handleForgetPass = async (e) => {
    e.preventDefault();

    let passEmail;

    if (!email) {
      setMessage("Enter Email");
    } else {
      setMessage(null);

      passEmail = {
        email,
      };

      await dispatch(forgotPassword(passEmail));
    }
  };

  return (
    <>
      <div className="fg_pass">
        <h2>Forgot Your Password</h2>
        <div className="row">
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
          {message && <Message>{message}</Message>}
          {forgotPasswordMessage  && <Message variant="success">{forgotPasswordMessage }</Message>}
          <label htmlFor="email">Enter your Email</label>
          <input
            type="text"
            placeholder="Enter email address"
            id="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleForgetPass} disabled={!email}>
            Verify your email
          </button>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
