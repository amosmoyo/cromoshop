import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import Loader from "../components/Loading";
import Message from "../components/Message";
import {useNavigate} from 'react-router-dom'

import { getallUsers, deleteUser } from "../redux/adminSlice";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { userList, loading, error, success} = useSelector(
    (state) => state.adminReducer
  );

  const {userData} = useSelector((state) => state.authReducers)

  React.useEffect(() => {
    if(userData?.userInfo && userData?.userInfo?.isAdmin) {
      dispatch(getallUsers());
    } else {
      navigate('/')
    }
   
  }, [dispatch, userData, navigate, success]);

  const handleDeleteUser = (id) => {
    if(window.confirm('are you sure')) {
      dispatch(deleteUser(id))
    }
    
  }
  return (
    <>
      <h3>User</h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table bordered striped hover responsive variant="dark" className="">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/userlist/${user._id}/edit`}>
                    <Button variant="light" className="btn btn-sm" size="sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button variant="danger" className="btn btn-sm" style={{marginLeft: "2px"}} size="sm" onClick={() => {
                    handleDeleteUser(user?._id)
                  }}>
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
