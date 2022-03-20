import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Rating from "../components/Rating";
import {
  getProductDetails,
  createProductReview,
  productAction,
} from "../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/Message";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Meta from "../components/Meta";

toast.configure();

const ProductScreen = () => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const params = useParams();

  const { product, loading, error, message, reviewLoading, reviewError } =
    useSelector((state) => state.productsReducers);

  const {
    userData,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.authReducers);

  useEffect(() => {
    dispatch(productAction.resetCreateProductReview());

    let id = params.id;

    const fetchProduct = async () => {
      await dispatch(getProductDetails(id));
    };

    fetchProduct();
  }, [dispatch, params, userData, message]);

  if (message === "You have added a product review") {
    dispatch(productAction.resetCreateProductReview());
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 10000,
    });
  }

  const handleMoveToCart = (id) => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    let id = params.id;

    if (id) {
      dispatch(createProductReview({ id, rating, comment }));
    }
  };

  console.log(userData);

  return (
    <>
      
      {authLoading && <Loading />}
      {authError && <Message variant="danger">{authError}</Message>}
      <Link className="btn btn-danger mb-1" to="/">
        Go back
      </Link>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
        <Meta title={product?.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Price: {`$${product.price}`}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price</Col>
                      <Col>
                        <strong>{`$${product.price}`}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => {
                              console.log(e.target.value);
                              setQty(e.target.value);
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        return handleMoveToCart(product._id);
                      }}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h3>Reviews</h3>
              {product.reviews.length === 0 ? (
                <p>No reviews</p>
              ) : (
                <ListGroup>
                  {product.reviews.map((review) => (
                    <ListGroup.Item>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating}></Rating>
                      <p>{review.comment}</p>
                      <p>{review.createdAt.substring(0, 10)}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <p style={{ fontWeight: "bold" }}>
                      <strong>Add a review</strong>
                    </p>
                    {reviewLoading && <Spinner animation="grow"></Spinner>}
                    {reviewError && (
                      <Message variant="danger">{reviewError}</Message>
                    )}
                    {userData?.userInfo ? (
                      <>
                        <Form onSubmit={handleAddReview}>
                          <Form.Group className="mb-3" controlId="rating">
                            <Form.Label>Rating</Form.Label>

                            <Form.Control
                              as="select"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value="">Select..</option>
                              <option value="1">1-- very poor</option>
                              <option value="2">2-- poor</option>
                              <option value="3">3-- average</option>
                              <option value="4">4-- good</option>
                              <option value="5">5-- excellent</option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              row="3"
                              placeholder="Enter commenht"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </Form.Group>

                          <Button variant="dark" type="submit">
                            Submit
                          </Button>
                        </Form>
                      </>
                    ) : (
                      <p>
                        {" "}
                        Please <Link to="/login">sign in </Link> to add a
                        comment
                      </p>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
