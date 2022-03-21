import React, { useEffect } from "react";

import { useLocation, useParams, Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { addItemsToCart, RemoveItemsTFromCart } from "../redux/cartSlice";

import {
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  Form,
  Card,
} from "react-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loading";

const Cart = (props) => {
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const location = useLocation();

  const { id } = useParams();

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  let { cartItems, loading, error } = useSelector(
    (state) => state.cartReducers
  );

  const {userData} = useSelector((state) => state.authReducers)

  useEffect(() => {
    if(!userData?.userInfo) {
      navigate('/login')
    }
    dispatch(addItemsToCart({ id, qty }));
  }, [dispatch, id, qty, userData, navigate]);

  const handleAddToCart = (id, qty) => {
    dispatch(addItemsToCart({ id, qty }));
  };

  const handleRemoveCartItem = (id) => {
    dispatch(RemoveItemsTFromCart(id));
  };

  const handleCheckout = () => {
    navigate(`/shipping`)
  }
  return (
    <>
      {loading ? (
        <Loader>loading...</Loader>
      ) : error ? (
        <div>Errror....</div>
      ) : (
        <Row>
          <Col md={8}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty <Link to="/">Go Back</Link>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item?.image}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>$ {item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={item?.qty}
                          onChange={(e) => {
                            let qty = e.target.value;
                            let id = item._id;
                            return handleAddToCart(id, qty);
                          }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={(e) => {
                            return handleRemoveCartItem(item._id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    Subtotals ({cartItems.reduce((a, c) => a + c.qty, 0)})
                  </h2>{" "}
                  items $(
                  {cartItems
                    .reduce((a, c) => a + c.qty * c.price, 0)
                    .toFixed(2)}
                  )
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    disabled={cartItems.length === 0}
                    className="btn btn-block"
                    onClick={handleCheckout}
                  >
                    Proceed To Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Cart;
