import { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../API";
import logo from "../images/logo.png";
import { AuthenticationContext } from "../Utils";

type Props = {
  handleLogout: () => void;
};

const MainNavbar: React.FC<Props> = ({ handleLogout }) => {
  const isLogged = useContext(AuthenticationContext).isLogged;

  const handleNavbarLogout = () => {
    API.logout().then(() => handleLogout());
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link to="/">
        <Navbar.Brand>
          <img
            alt=""
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-center"
          />{" "}
          Ordini Manager
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {isLogged ? (
          <Nav className="ms-auto">
            <Link to="/home">
              {/* Nav.Link refreshes the page when redirecting */}
              <Nav.Item className="nav-link">Prodotti</Nav.Item>
            </Link>
            <Link to="/avail">
              <Nav.Item className="nav-link">Disponibilità</Nav.Item>
            </Link>
            <Link to="/">
              <Nav.Item onClick={handleNavbarLogout} className="nav-link">
                Logout
              </Nav.Item>
            </Link>
          </Nav>
        ) : (
          <Nav className="ms-auto">
            <Link to="/login">
              <Nav.Item className="nav-link">Login</Nav.Item>
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MainNavbar;
