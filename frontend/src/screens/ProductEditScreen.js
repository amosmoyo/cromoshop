import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../redux/productSlice";
import { Form, Button, Spinner } from "react-bootstrap";
import Loader from "../components/Loading";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import {updateProductById, adminActions} from '../redux/adminSlice';
import axios from "axios";

const ProductEditScreen = () => {
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

  const params = useParams();

  const {
    product,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.productsReducers);

  const { userData } = useSelector((state) => state.authReducers);

  const {loading:createLoading, error:createerror, successUpdate, productDetails} = useSelector((state) => state.adminReducer);

  React.useEffect(() => {
    dispatch(adminActions.resetUpdate());

    let id = params.id;

    if (!userData?.userInfo && !userData?.userInfo?.isAdmin) {
      navigate('/login');
    }

    if(successUpdate && !createLoading) {
      navigate('/admin/productlist');
      dispatch(adminActions.resetUpdate())
    }

    console.log(successUpdate)
    
    if (id) {
      if (!product?._id || product?._id !== id) {
        const fetchProduct = async () => {
          await dispatch(getProductDetails(id));
        }
        fetchProduct()
      } else {
        setBrand(product?.brand);
        setCategory(product?.category);
        setCountInStock(product?.countInStock);
        setDescription(product?.description);
        setImage(product?.image);
        setName(product?.name);
        setNumReviews(product?.numReviews);
        setPrice(product?.price);
        setRating(product?.rating);
      }
    }
  }, [dispatch, params, product, successUpdate, navigate, userData, createLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let id = params.id;

    let dataProduct = {
      brand, category, countInStock, description, image, name, numReviews, price, rating
    }

    if(window.confirm('You are about to update')) {
      dispatch(updateProductById({id, dataProduct}))
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
        "http://localhost:5000/api/v1/upload",
        formData,
        config
      );

      if (res.status === 200 || res.status === 201) {
        setUploading(false);
        data = res.data;
        console.log(data.result[0].url);
        setImage(data.result[0].url)
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }

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
        <h3>Update product details</h3>
        {createLoading && <Loader />}
        {createerror && <Message variant="danger">{createerror}</Message>}
        {productLoading ? (
          <Loader />
        ) : productError ? (
          <Message variant="danger">{productError}</Message>
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

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
