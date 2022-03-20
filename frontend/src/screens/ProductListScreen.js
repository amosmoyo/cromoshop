import React from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loading";
import Message from "../components/Message";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../redux/productSlice";
import {deleteProduct} from '../redux/adminSlice'
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { products, loading, error:productError, page, pages } = useSelector(
    (state) => state.productsReducers
  );

  const {keyword, pageNumber} = useParams()

  const { userData } = useSelector((state) => state.authReducers);

  const {loading:adminLoaing, error:adminError, successDelete} = useSelector(
    (state) => state.adminReducer
  );

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProducts({keyword, pageNumber}));
    };

    if (userData?.userInfo && userData?.userInfo?.isAdmin) {
      fetchProducts();
    } else {
        navigate('/')
    }
  }, [dispatch, userData, navigate, successDelete, keyword, pageNumber]);

  const createProductHandler = (e) => {
    e.preventDefault();
    navigate('/admin/createproduct')
  };

  const handleDelete = (id) => {
    console.log("delete");
    if(window.confirm('are sure you want to delete this product')) {
      dispatch(deleteProduct(id))
    }
  };

  const productsData = products ? products : [];

  return (
    <>
      <Row
        className="align-items-center justify-content-between"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {adminLoaing && <Loader />}
      {adminError && <Message variant="danger">{adminError}</Message>}
      {loading ? (
        <Loader variant="primary" />
      ) : productError ? (
        <Message variant="danger">{productError}</Message>
      ) : (
        <>
        <Table
          striped
          responsive
          bordered
          hover
          variant="dark"
          className="table-sm"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product) => (
              <tr key={product?._id}>
                <td>{product?._id}</td>
                <td>{product?.name}</td>
                <td>{product?.price}</td>
                <td>{product?.category}</td>
                <td>{product?.brand}</td>
                <td>
                  <LinkContainer to={`/admin/productlist/${product._id}/edit`}>
                    <Button variant="light" className="btn btn-sm" size="sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    style={{ marginLeft: "2px" }}
                    size="sm"
                    onClick={() => {
                      handleDelete(product?._id);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate page={page} pages={pages} keyword={keyword ? keyword : ''} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
