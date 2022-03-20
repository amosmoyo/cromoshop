import React from "react";
import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout, authAction } from "../redux/authSlice";
import Search from './Search'

const Header = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.authReducers);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Cromoshop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Search />
            <Nav className="ms-auto">
              {/* <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
              </LinkContainer> */}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>cart
                </Nav.Link>
              </LinkContainer>
              {userData?.userInfo ? (
                <NavDropdown
                  title={userData.userInfo.email.toLowerCase()}
                  id="useremail"
                >
                  <LinkContainer to="/profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </LinkContainer>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i>sign in
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {userData?.userInfo && userData?.userInfo?.isAdmin && (
                <NavDropdown
                  title='admin'
                  id="admin-menu"
                >
                  <LinkContainer to="/admin/userlist">
                    <Dropdown.Item>User List</Dropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <Dropdown.Item>Product List</Dropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <Dropdown.Item>Order List</Dropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
