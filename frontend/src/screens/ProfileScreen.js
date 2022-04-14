import React, { useState, useEffect } from "react";
// import FormContainer from "../components/FormContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Table, Form, Button, Row, Col, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { profile, updateProfile, uploadAvatar, getAccessToken } from "../redux/authSlice";
import { getMyOrderList } from "../redux/orderSlice";
import "./common.css";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch();

  // const location = useLocation();

  const navigate = useNavigate();

  // const redirect = location.search ? location.search.split("=")[1] : "/";

  const { error, userData, user, token } = useSelector(
    (state) => state.authReducers
  );

  const { loadMyOrderList, myOrderList } = useSelector(
    (state) => state.orderReducers
  );

  useEffect(() => {
    if (!userData?.success) {
      navigate("/login");
    } else {
      if (!user?.success || !user.userInfo.name) {
        dispatch(profile());
        dispatch(getMyOrderList());
      } else {
        setLoading(false)
        // dispatch(getAccessToken())
        setName(user?.userInfo?.name);
        setEmail(user?.userInfo?.email);
      }
    }
  }, [navigate, userData, dispatch, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    if (password !== confirmPassword) {
      setMessage("password do not match");
    } else {
      const updateData = {
        email,
        password,
        name,
        avatar,
      };

      setMessage(null);

      dispatch(updateProfile(updateData));

      setLoading(false)
    }
  };

  const onChangeAvatar = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    setLoading(true)

    if (!file) {
      setMessage("No file provided");
    } else if (file.size > 1024 * 1024) {
      setMessage("File size is too large");
    } else if (
      (file.type !== "image/jpeg" || file.type !== "image/png") === false
    ) {
      setMessage("Incorect file format");
    } else {
      setMessage(null);
      const formData = new FormData();

      formData.append("file", file);

      const data = await dispatch(uploadAvatar(formData));

      const { payload } = data;

      if (payload) {
        const { url } = payload;
        setLoading(false)
        setAvatar(url);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        {userData.userInfo && (
          <div>
            <div className="avatar">
              <Image
                src={avatar ? avatar : userData.userInfo.avatar}
                alt="UserName profile image"
                roundedCircle
                style={{
                  width: "100%",
                  height: "100%",
                  // margin: "15px auto",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span>
                <i className="fas fa-camera"></i>
                <p>change</p>
                <input
                  type="file"
                  name="file"
                  style={{
                    position: "absolute",
                    top: '0',
                    left: 0,
                    cursor: "pointer",
                    opacity: 0,
                  }}
                  onChange={onChangeAvatar}
                />
              </span>
            </div>
          </div>
        )}
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
            Update Profile
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        <Table striped hover responsive bordered variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myOrderList.map((order) => (
              <tr key={order?._id}>
                <td>{order?._id}</td>
                <td>{order?.createdAt.substring(0, 10)}</td>
                <td>{order?.totalPrice}</td>
                <td>
                  {order?.isPaid ? (
                    order?.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order?.isDelivered ? (
                    order?.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orderlist/${order?._id}`}>
                    <Button className="btn-sm" size="sm" variant="light">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
