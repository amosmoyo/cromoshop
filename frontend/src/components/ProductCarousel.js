import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loading";
import Message from "./Message";
import { getTopRatedProducts } from "../redux/productSlice";
import { useSelector, useDispatch } from "react-redux";
// import { getTopRatedProducts } from "../../../backend/controller/productController";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const { loading, error, topRatedProducts } = useSelector(
    (state) => state.productsReducers
  );

  useEffect(() => {
    dispatch(getTopRatedProducts());
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Carousel style={{backgroundColor:"#FFD700"}} >
          {topRatedProducts.map((product) => (
            <Carousel.Item style={{ textAlign:"center"}} key={product?._id}>
              <Link to={`/product/${product?._id}`}>
                <Image src={product?.image} alt={product?.name} className="img" fluid/>
              </Link>
              <Carousel.Caption className='carousel-caption' >
                <h3 style={{textTransform: "none"}}>
                  {product?.name} {' '} Ksh {product?.price}
                </h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ProductCarousel;
