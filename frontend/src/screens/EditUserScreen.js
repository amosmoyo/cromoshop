import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersById,
  updateUsersById,
  adminActions,
} from "../redux/adminSlice";
import Message from "../components/Message";
import Loader from "../components/Loading";
import FormContainer from "../components/FormContainer";

const EditUserScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);

  const { userDetails, loading, error, successUpdate } = useSelector(
    (state) => state.adminReducer
  );

  React.useEffect(() => {
    let id = params.id;

    if (successUpdate) {
      dispatch(adminActions.resetUserDetails());
      navigate('/admin/userlist');
    } else {
      if (id) {
        if (!userDetails?._id || userDetails._id !== id) {
          dispatch(getUsersById(params.id));
        } else {
          setEmail(userDetails?.email);
          setName(userDetails?.name);
          setIsAdmin(userDetails?.isAdmin);
        }
      }
    }
  }, [dispatch, params, userDetails, successUpdate, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let id = params.id;
    dispatch(updateUsersById({ id, isAdmin, name, email }));
  };
  return (
    <>
      <Button
        variant="secondary"
        className="btn btn-secondary mb-1"
        style={{ backgroundColor: "#444", color: "#fff", fontWeight: "bold" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <FormContainer>
        <h3>Update user details</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditUserScreen;
