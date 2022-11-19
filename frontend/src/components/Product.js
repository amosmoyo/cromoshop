/* eslint-disable no-unused-vars */
import React from "react";
import { Card, Button } from "react-bootstrap";
import Rating from "./Rating";
import ProductDetails from "./ProductDetails";
import { Link } from "react-router-dom";

import "../screens/common.css";

export const Product = ({ product }) => {
  return (
    <Card className="my-0 p-0 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>
        <Card.Text as="h3" style={{ textTransform: "none" }}>
          Ksh {product.price}
        </Card.Text>
        <Card.Text as="div" className="d-grid gap-2 popup-section">
          <Button variant="primary" size="sm" className="btn-primary">View Details</Button>
          <Button variant="warning" size="sm" className="btn" style={{backgroundColor: "#FFD700", color: "#000", fontWeight: "bold !important"}}>Add to Cart</Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
