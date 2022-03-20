import React, { useEffect } from "react";
import { getallOrders } from "../redux/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loading";
import Message from "../components/Message";
import { Table, Button } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'

const AllOrdersScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.adminReducer);

  const { userData } = useSelector((state) => state.authReducers);

  useEffect(() => {
    if (!userData?.userInfo && !userData?.userInfo?.isAdmin) {
      navigate("/login");
    }

    dispatch(getallOrders());
  }, [navigate, userData, dispatch]);

  return (
    <>
      <h3>Order List</h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {orders.length === 0 && <p>No orders</p>}
          <Table striped responsive bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order?._id}</td>
                  <td>{order?.user?.name}</td>
                  <td>{order?.createdAt.substring(0, 10)}</td>
                  <td>{`$${order?.totalPrice}`}</td>
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
                         <Button size="sm">Details</Button>
                      </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default AllOrdersScreen;
