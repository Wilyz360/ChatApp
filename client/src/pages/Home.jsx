import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate(); // render components by routes

  const renderLoginPage = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Row>
        <Col>
          <Stack className="w-50 d-flex mx-auto align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
            <div className="mt-1">
              <h4>{"Just an another way to chat"} &#x1F609;</h4>
            </div>
            <div className="mt-3">
              <Button className="btn btn-dark" onClick={renderLoginPage}>
                Log in
              </Button>
            </div>
            <p className="mb-0 pb-0 mt-2">-or-</p>
            <Link className="" style={{ textDecoration: "none" }} to="/signup">
              Create account
            </Link>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
