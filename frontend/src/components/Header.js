import React from "react";
import { Container, Dropdown, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
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
      <Navbar  variant="dark" className="navbar" expand="lg"   collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="color-me">
            <img
              src="https://res.cloudinary.com/amosmoyo/image/upload/v1668601246/brenda4_zxeehq.png"
              width="50"
              height="50"
              className="d-inline-block align-bottom fst-italic"
              alt="React Bootstrap logo"
            />
            unike
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Search />
            <Nav className="ms-auto"  >
              {/* <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
              </LinkContainer> */}
              <LinkContainer to="/cart">
                <Nav.Link className={`${userData.userInfo ? "py-3" : ""} color-me`}>
                  <i className="fas fa-shopping-cart" ></i>cart
                </Nav.Link>
              </LinkContainer>
              {userData?.userInfo ? (
                <NavDropdown
                  // title={userData.userInfo.email.toLowerCase()}
                  title={
                    <Image
                    src={userData.userInfo.avatar}
                    alt="UserName profile image"
                    roundedCircle
                    style={{ width: '40px', height: "40px"}}
                  />
                  }

                 

                  // style={{background: "#000"}}

                  // className="color-me"
                >
                  <LinkContainer to="/profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </LinkContainer>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login" >
                    <Nav.Link className="color-me">
                      <i className="fas fa-user"></i>sign in
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {userData?.userInfo && userData?.userInfo?.isAdmin && (
                <NavDropdown
                  title='admin'
                  id="admin-menu"
                  className={`${userData.userInfo.isAdmin ? "py-2" : ""} color-me`}
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
