import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import CheckoutProcess from "../components/CheckoutProcess";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loading";
import { createOrder, orderAction } from "../redux/orderSlice";
import { authAction } from "../redux/authSlice";

const PlaceorderScreen = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const cartObj = useSelector((state) => state.cartReducers);

  let cart = { ...cartObj };

  const { error, loading, success, order } = useSelector(
    (state) => state.orderReducers
  );

  if (!cart.shippingAddress.address) {
    navigate("/shipping");
  } else if (!cart.payment) {
    navigate("/payment");
  }

  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimal(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimal(Number(cart?.itemsPrice) > 100 ? 0 : 100);

  cart.taxPrice = addDecimal(Number(0.15 * cart?.itemsPrice).toFixed(2));

  cart.totalPrice = addDecimal(
    (
      Number(cart?.itemsPrice) +
      Number(cart?.shippingPrice) +
      Number(cart?.taxPrice)
    ).toFixed(2)
  );

  React.useEffect(() => {
    console.log(success, order?.createOrder);
    if (success) {
      navigate(`/orderlist/${order?.createOrder?._id}`);
      
      // dispatch(authAction.resetUser())
      // dispatch(orderAction.resetOrder())
    }
  }, [success, navigate, order, dispatch]);

  const placeOrderHandler = () => {
    let myOrder = {
      orderItems: cart?.cartItems,
      shippingAddress: cart?.shippingAddress,
      paymentMethod: cart?.payment,
      itemsPrice: cart?.itemsPrice,
      shippingPrice: cart?.shippingPrice,
      taxPrice: cart?.taxPrice,
      totalPrice: cart?.totalPrice,
    };

    if (myOrder.orderItems) {
      dispatch(createOrder({ myOrder }));
    }
  };

  return (
    <>
      <CheckoutProcess step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Address: </strong>
                {cart?.shippingAddress?.address} , {cart?.shippingAddress?.city}{" "}
                , {cart?.shippingAddress?.postal} ,
                {cart?.shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment</h4>
              <p>
                <strong>Payments method: </strong>
                {cart?.payment}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Orders</h4>
              {cart.cartItems.length === 0 ? (
                <Message>There is no items </Message>
              ) : (
                <ListGroup>
                  {cart?.cartItems.map((item, index) => {
                    return (
                      <>
                        <ListGroup.Item key={index}>
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
                  <Col>{cart?.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{cart?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{cart?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong style={{ fontWeight: "bold" }}>Total: </strong>
                  </Col>
                  <Col>{cart?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceorderScreen;
