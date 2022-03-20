/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Product } from "../components/Product";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { getProducts } from "../actions/products_action/products_action";
import { getProducts, getTopRatedProducts } from "../redux/productSlice";
import Loading from "../components/Loading";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
// import axios from "axios";
import { product_reducer } from "../reducers/product_reducer";

import { useParams, Link } from "react-router-dom";

import Meta from "../components/Meta";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { keyword } = useParams();

  const { pageNumber } = useParams();

  const { products, loading, error, pages, page, topRatedProducts } =
    useSelector((state) => state.productsReducers);

  useEffect(() => {
    dispatch(getTopRatedProducts());

    const fetchProducts = async () => {
      await dispatch(getProducts({ keyword, pageNumber }));
    };

    fetchProducts();
  }, [dispatch, keyword, pageNumber]);

  const productsData = products ? products : [];
  console.log(topRatedProducts);

  return (
    <>
      <Meta />
      {!keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-danger">Go Back</Link>}
      <br></br>
      <h1>Latest Products</h1>
      {loading ? (
        <Loading variant="primary" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {productsData.map((prod) => (
              <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={prod}></Product>
              </Col>
            ))}
          </Row>
          <Paginate
            page={page}
            pages={pages}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
