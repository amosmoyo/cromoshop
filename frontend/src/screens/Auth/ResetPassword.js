import React from "react";
import Message from "../../components/Message";
import Loading from "../../components/Loading";
import { useSelector, useDispatch } from "react-redux";

import { useParams, Link } from "react-router-dom";
import { resetPassword } from "../../redux/authSlice";
import {Row } from 'react-bootstrap'

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { access_token } = useParams();

  const [password, setPassword] = React.useState("");
  const [confirmpassword, setconfirmPassword] = React.useState("");
  const [message, setMessage] = React.useState(null);

  const { loading, error, success, resetPasswordMessage } = useSelector(
    (state) => state.authReducers
  );

  const handleForgetPass = async (e) => {
    e.preventDefault();
    let passData;

    if (!password && !confirmpassword) {
      setMessage("Fill all the fields");
    } else if (password.length < 6) {
      setMessage("Password is too short");
    } else if (password !== confirmpassword) {
      setMessage("Password not matching");
    } else {
      passData = {
        password
      };

      setMessage(null);

      await dispatch(resetPassword({passData, access_token}));
    }
  };
  return (
    <>
      <div className="fg_pass">
        <h2>Reset Your Password</h2>
        <div className="row">
          {loading && <Loading />}
          {error && <Message variant="danger">{error}</Message>}
          {message && <Message variant="danger">{message}</Message>}
          {resetPasswordMessage && <Message variant="success">{resetPasswordMessage}</Message>}

          <label htmlFor="password">Enter New Password</label>
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmpassword">confirm Password</label>
          <input
            type="password"
            placeholder="confirm password"
            id="confirmpassword"
            value={confirmpassword}
            name="confirmpassword"
            onChange={(e) => setconfirmPassword(e.target.value)}
          />

          <button onClick={handleForgetPass} disabled={!password}>
            reset password
          </button>
        </div>
        {resetPasswordMessage && (
          <div className="row pt-3 mt-3">
            <button className="btn btn-success" style={{color:"white", backgroundColor: "rgb(9, 232, 46)"}}><Link style={{fontWeight: "bold"}} to="/login">You can now Login</Link></button>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
