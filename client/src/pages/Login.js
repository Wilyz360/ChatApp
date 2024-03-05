import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../config/api";

const Login = () => {
  // input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await API.post(
        "/v1/login",
        {
          email,
          password,
        },
        {
          // withCredentials let browser know that it will work with cookies
          withCredentials: true,
        }
      );
      if (result.data.accepted === true) {
        console.log(result.data.message);
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        window.alert(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col className="w-50 d-flex mx-auto align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
          <Form className="border shadow mt-5 pt-5">
            <div className="m-3 text-center">
              <h5>Log in to MSG</h5>
            </div>
            <Form.Group className="m-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username"
              />
              <Form.Label className="mt-3">Password</Form.Label>
              <Form.Control
                type="password"
                name="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>

            <Button
              className="m-3 mt-5 d-flex mx-auto align-items-center justify-content-center"
              variant="dark"
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Link
              className="m-3 mt-3 d-flex mx-auto align-items-center justify-content-center"
              style={{ textDecoration: "none" }}
              to="/signup"
            >
              Create account
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
