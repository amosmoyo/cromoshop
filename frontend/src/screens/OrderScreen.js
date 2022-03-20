import React from "react";
import { useParams } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import {
  orderAction,
  getOrderDetails,
  updatePaidOrder,
} from "../redux/orderSlice";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button, Spinner } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import axios from "axios";
import Paypal from "../components/Paypal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { updateDeliveredOrder, adminActions } from "../redux/adminSlice";

const OrderScreen = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [sdkReady, setSdkReady] = React.useState(false);

  const [paidStatus, setPaidStatus] = React.useState(false);

  const [hide, setHide] = React.useState("visible");

  const [paypalToken, setPaypalToken] = React.useState("");

  const payPalRef = React.useRef();

  const params = useParams();
  let id = params.id;

  const { loading, error, orderDetails, paypalSuccess } = useSelector(
    (state) => state.orderReducers
  );

  const {userData} = useSelector((state) => state.authReducers)

  const {
    loading: adminLoading,
    error: adminError,
    successDelivered,
  } = useSelector((state) => state.adminReducer);

  let { order } = orderDetails ? orderDetails : {};

  React.useEffect(() => {

    dispatch(adminActions.resetDelivered())

    if(!userData?.userInfo){
      navigate('/login')
    }

    const addPaypalScripts = async () => {
      let { data: clientId } = await axios.get(
        `http://localhost:5000/api/v1/config`
      );

      let token = `${clientId}`;

      setPaypalToken(token);

      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };

      document.body.appendChild(script);
    };

    const loadingData = async () => {
      if (!order || paypalSuccess || successDelivered) {
        await dispatch(orderAction.resetOrder());
        await dispatch(adminActions.resetDelivered())
        await dispatch(getOrderDetails(id));
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPaypalScripts();
        } else {
          setSdkReady(true);
        }
      }
    };

    loadingData();
  }, [dispatch, id, order, paypalSuccess, sdkReady, userData, navigate, successDelivered]);

  // const successPaymentHandler = async (paymentResult) => {
  //   if (order) {
  //     let id = order?._id;
  //     const res = await dispatch(updatePaidOrder({ id, paymentResult }));

  //     if (res?.payload?.updateOrder?.isPaid === true) {
  //       setTimeout(() => {
  //         setPaidStatus(true);
  //         setHide("hidden");
  //       }, 500);
  //     }
  //   }
  // };

  const onApproveHandler = async (data, actions) => {
    return actions.order.capture().then((details) => {
      let paymentResult = details;
      if (order) {
        let id = order?._id;
        dispatch(updatePaidOrder({ id, paymentResult }));
      }
    });
  };

  const handlerUpdateDelivered = (e) => {
    e.preventDefault();

    let id = params.id;

    if(window.confirm('Are you sure you want to update')) {
      dispatch(updateDeliveredOrder(id))
    }
  }

  return (
    <>

      {/* {adminLoading && <Loader />} */}

      {adminError && <Message variant="danger">{adminError}</Message>}
      {loading && orderDetails ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h4
            style={{
              textAlign: "center",
              marginBottom: "5px",
              border: "1px solid #666",
              borderRadius: "5px",
            }}
          >
            Order No: {order?._id}
          </h4>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4>Shipping</h4>
                  <p>
                    <strong>Name: </strong> {order?.user?.name}
                  </p>
                  <p>
                    <strong>Email: </strong> ,{" "}
                    <a href={`mailto:${order?.user?.email}`}>
                      {order?.user?.email}
                    </a>{" "}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order?.shippingAddress?.address} ,{" "}
                    {order?.shippingAddress?.city} ,{" "}
                    {order?.shippingAddress?.postal} ,
                    {order?.shippingAddress?.country}
                  </p>

                  {order?.isDelivered ? (
                    <Message variant="success">
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>Payment</h4>
                  <p>
                    <strong>Payments method: </strong>
                    {order?.paymentMethod}
                  </p>

                  {order?.isPaid ? (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h4>Orders</h4>
                  {order?.orderItems.length === 0 ? (
                    <Message>There is no items ordered </Message>
                  ) : (
                    <ListGroup>
                      {order?.orderItems.map((item, index) => {
                        return (
                          <>
                            <ListGroup.Item key={item?._id}>
                              <Row>
                                <Col md={1}>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fluid
                                    rounded
                                  />
                                </Col>
                                <Col>
                                  <Link to={`/product/${item?.product}`}>
                                    {item.name}
                                  </Link>
                                </Col>
                                <Col md={4}>
                                  {item.qty} x {item.price} ={" "}
                                  {item.qty * item.price}
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </>
                        );
                      })}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Item</Col>
                      <Col>{order?.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>{order?.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>{order?.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong style={{ fontWeight: "bold" }}>Total: </strong>
                      </Col>
                      <Col>{order?.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {error && <Message variant="danger">{error}</Message>}
                  </ListGroup.Item>
                  {!order?.isPaid && hide === "visible" && (
                    <ListGroup.Item ref={payPalRef}>
                      {loading && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <>
                          {/* <PayPalButton
                            amount={order?.totalPrice}
                            onSuccess={successPaymentHandler}
                            style={{visibility:`${hide}`}}
                          /> */}
                          {/* <PayPalScriptProvider
                            options={{ "client-id": "test" }}
                          >
                            <PayPalButtons style={{ layout: "horizontal" }} />
                          </PayPalScriptProvider> */}
                          <div style={{ maxWidth: "750px" }}>
                            <PayPalScriptProvider
                              options={{
                                "client-id": paypalToken,
                                components: "buttons",
                                currency: "USD",
                              }}
                            >
                              <Paypal
                                currency={"USD"}
                                showSpinner={false}
                                amount={order?.totalPrice}
                                onApproveHandler={onApproveHandler}
                              />
                            </PayPalScriptProvider>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  )}
                 {userData?.userInfo && userData?.userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && !adminLoading && <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      disabled={order?.orderItems.length === 0}
                      onClick={handlerUpdateDelivered}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>}

                  {adminLoading && <Spinner animation="grow"></Spinner> }

                  { order?.isPaid && order?.isDelivered&& <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      variant="success"
                      disabled
                    >
                      Delivered
                    </Button>
                    </ListGroup.Item>}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {/* {error && <Message variant="danger">{error}</Message>} */}
    </>
  );
};

export default OrderScreen;
