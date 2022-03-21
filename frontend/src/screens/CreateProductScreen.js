import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import Loader from "../components/Loading";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { createProduct, adminActions } from "../redux/adminSlice";
import axios from "axios";

const CreateProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [numReviews, setNumReviews] = useState(0);
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);

  const [uploading, setUploading] = useState(false);

  const { loading, error, successCreate } = useSelector(
    (state) => state.adminReducer
  );

  const { userData } = useSelector((state) => state.authReducers);

  useEffect(() => {
    dispatch(adminActions.resetCreate());

    if (!userData?.userInfo && !userData?.userInfo?.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      dispatch(adminActions.resetCreate());
      navigate("/admin/productlist");
    }
  }, [navigate, successCreate, userData, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let product = {
      brand,
      category,
      countInStock,
      description,
      image,
      name,
      numReviews,
      price,
      rating,
    };

    console.log(product);

    if (window.confirm("You are about to create a product")) {
      dispatch(createProduct(product));
    }
  };

  const uploadingFileHandler = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("image", file);

    setUploading(true);

    try {
      let token = userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let data;

      const res = await axios.post(
        "/api/v1/upload",
        formData,
        config
      );

      if (res.status === 200 || res.status === 201) {
        setUploading(false);
        data = res.data;
        setImage(data.result[0].url)
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // https://res.cloudinary.com/amosmoyo/image/upload/v1647325576/Images/l1hokkc5qkn8u48by6od.jpg
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
        <h3>Create new product</h3>
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

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countinstock">
              <Form.Label>Count in stock </Form.Label>
              <Form.Control
                type="number"
                placeholder="enter items in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="numReviews">
              <Form.Label>Number of reviews</Form.Label>
              <Form.Control
                type="number"
                placeholder="number of reviews"
                value={numReviews}
                onChange={(e) => setNumReviews(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="enter item price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="enter item rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter image url or choose file"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              {!uploading && <Form.Group controlId="formFile" className="mb-3 mt-1">
                <Form.Control type="file" label="Choose file" onChange={uploadingFileHandler} size="sm" />
              </Form.Group>}

              {/* <Form.File
                id="image-file"
                label="Choose file"
                custom
                onChange={uploadingFileHandler}
              ></Form.File> */}
              {uploading && <Spinner animation="grow" variant="secondary" />}
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="mt-3"
              disabled={name === ""}
            >
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default CreateProductScreen;
