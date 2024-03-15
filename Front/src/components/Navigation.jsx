import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetNotifications } from "../features/userSlice";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import "./Navigation.css";

function Navigation({ on, handleClick }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }
  const [color, setColor] = useState(false);
  const changeColor = () => {
    if (window.scrollY >= 75) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
  window.addEventListener("scroll", changeColor);

  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status == "unread") return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display =
      notificationRef.current.style.display === "block" ? "none" : "block";
    dispatch(resetNotifications());
    if (unreadNotifications > 0)
      axios.post(`http://localhost:8080/users/${user._id}/updateNotifications`);
  }

  return (
    <Navbar
      expand="lg"
      id="nav"
      className={
        color
          ? " bg-black  sticky-top  fw-bolder "
          : "bg-secondary bg-opacity-50 sticky-top  fw-bolder "
      }
    >
      <Container>
        <LinkContainer to={"/"}>
          <Navbar.Brand
            className="  text-white"
            onMouseEnter={(e) => handleClick(e, on)}
            tabIndex="0"
            aria-label="Cliquez pour entendre le contenu"
          >
            X-Store
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className=" text-white"
        />
        <Navbar.Collapse id="basic-navbar-nav" className=" text-white ">
          <Nav className="mx-auto ">
            <LinkContainer to="/category/all">
              <Nav.Link
                as={Link}
                className=" text-white mt-2"
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                <i className="fas fa-television mx-2" aria-hidden="true"></i>
                Produits
              </Nav.Link>
            </LinkContainer>

            <Nav.Link
              to="/#categorie"
              as={Link}
              className=" text-white mt-2"
              onMouseEnter={(e) => handleClick(e, on)}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              Catégories
            </Nav.Link>

            <LinkContainer to="/contact">
              <Nav.Link
                className=" text-white mt-2"
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                <i className="fa fa-address-card mx-2" aria-hidden="true"></i>
                Contact
              </Nav.Link>
            </LinkContainer>
            {/*Si Utilisateur n'Existe pas*/}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link
                  className=" text-white mt-2"
                  onMouseEnter={(e) => handleClick(e, on)}
                  tabIndex="0"
                  aria-label="Cliquez pour entendre le contenu"
                >
                  <i className="fa fa-sign-in mx-2" aria-hidden="true"></i>
                  Connecter
                </Nav.Link>
              </LinkContainer>
            )}

            {user && (
              <>
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt="User Avatar"
                      />
                      <span
                        className="text-white"
                        onMouseEnter={(e) => handleClick(e, on)}
                      >
                        {user.name}
                      </span>
                    </>
                  }
                  className=" bg-secondary rounded-5"
                  id="basic-nav-dropdown"
                >
                  {" "}
                  {user.isAdmin && (
                    <>
                      <LinkContainer to="/admin">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Dashboard
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/new-product">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Créer un produit
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/verify">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Stories
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  {!user.isAdmin && (
                    <>
                      <LinkContainer to="/cart">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Votre Carte
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Votre Ordre
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/update">
                        <NavDropdown.Item
                          onMouseEnter={(e) => handleClick(e, on)}
                        >
                          Modfier Votre Compte
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="mx-auto d-block align-items-center w-75"
                    onMouseEnter={(e) => handleClick(e, on)}
                  >
                    Déconnecter
                  </Button>
                </NavDropdown>
                <Nav.Link
                  style={{ position: "relative" }}
                  onClick={handleToggleNotifications}
                >
                  <i
                    className="fas fa-bell mt-2"
                    ref={bellRef}
                    data-count={unreadNotifications || null}
                  ></i>
                </Nav.Link>
              </>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/favorite">
                <Nav.Link>
                  <i
                    className="fa-solid fa fa-heart fs-5 mt-3"
                    style={{ color: "#ffffff" }}
                  ></i>
                  {user?.favorites.length > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.favorites.length}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i
                    className="fa-solid fa-cart-shopping fs-5 mt-3"
                    style={{ color: "#ffffff" }}
                  ></i>
                  {user?.cart.count > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {user && !user.isAdmin && (
              <LinkContainer to="/orders">
                <Nav.Link>
                  <i
                    className="fa fa-list-alt fs-5 mt-3"
                    style={{ color: "#ffffff" }}
                  ></i>
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* notifications */}
      <div
        className="notifications-container"
        ref={notificationRef}
        style={{
          position: "absolute",
          top: bellPos.top + 30,
          left: bellPos.left,
          display: "none",
        }}
      >
        {user?.notifications.length > 0 ? (
          user?.notifications.map((notification) => (
            <p className={`notification-${notification.status}`}>
              {notification.message}
              <br />
              <span>
                {notification.time.split("T")[0] +
                  " " +
                  notification.time.split("T")[1]}
              </span>
            </p>
          ))
        ) : (
          <p>No notifcations yet</p>
        )}
      </div>
    </Navbar>
  );
}

export default Navigation;
