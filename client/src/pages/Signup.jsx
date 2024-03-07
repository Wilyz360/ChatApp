import { useState } from "react";
import API from "../config/api";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await API.post("/v1/signup", {
        firstname,
        lastname,
        email,
        password,
      });
      if (result.data.accepted === true) {
        console.log(result.data.message);
        setEmail("");
        setPassword("");
        navigate("/login");
        //navigate(0); // so it actually render home page
      } else {
        console.log(result.data.message);
        window.alert(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Row>
        <Col className="w-50 d-flex mx-auto align-items-center justify-content-center">
          <Form className="border shadow mt-5 pt-5">
            <div className="m-3 text-center">
              <h5>Create new account</h5>
            </div>
            <Form.Group className="m-3">
              <Form.Label className="mt-3">First Name</Form.Label>
              <Form.Control
                type="firstname"
                placeholder="Enter First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <Form.Label className="mt-3">Last Name</Form.Label>
              <Form.Control
                type="lastname"
                placeholder="Enter Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <Form.Label className="mt-3">Email</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Label className="mt-3">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              className="m-3 mt-5 d-flex mx-auto align-items-center justify-content-center"
              onClick={handleSubmit}
              variant="dark"
            >
              Create Account
            </Button>
            <Link
              className="m-3 mt-3 d-flex mx-auto align-items-center justify-content-center"
              style={{ textDecoration: "none" }}
              to="/login"
            >
              Already have an account?
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
