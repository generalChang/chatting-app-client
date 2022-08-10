import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../_actions/user_action";
import { message } from "antd";
import { withRouter } from "react-router-dom";

function NavBar(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const onLogout = () => {
    dispatch(logout())
      .then((result) => {
        if (result.payload.success) {
          message.success("Success Logout!! bye bye!!");
          localStorage.removeItem("userId");
          props.history.push("/login");
          return;
        } else {
          message.warning("Failed to Logout..");
        }
      })
      .catch((err) => {});
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">Sukka</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
          {user && user.userData && !user.userData.isAuth && (
            <Nav>
              <Nav.Link href="/register">Sign up</Nav.Link>
              <Nav.Link eventKey={2} href="/login">
                Sign in
              </Nav.Link>
            </Nav>
          )}

          {user && user.userData && user.userData.isAuth && (
            <Nav>
              <Nav.Link href="" onClick={onLogout}>
                Logout
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default withRouter(NavBar);
