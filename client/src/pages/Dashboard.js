import { Container, Row, Col, Image } from "react-bootstrap";
import ekko from "../images/ekko.jpg";
import "../style/Button.css";
import { useState } from "react";
import Messages from "../components/Messages";
import Contacts from "../components/Contacts";
import Settings from "../components/Settings";
import UserProfile from "../components/UserProfile";
import API from "../config/api";

const DashBoard = () => {
  const [show, setShow] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // sending email as query. params == query
      const result = await API.get("/v1/search", {
        // indicates whether or not cross-site Access-Control requests should be
        // made using credentials such as cookies
        withCredentials: true,
        params: { email },
      });

      if (result.data.accepted === true) {
        console.log(result.data.message);
        setUser(result.data.user);
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
        <Col md={2} className="pt-5 d-grid gap-4 border-end">
          <div>
            <Image
              className=" align-items-center justify-content-center"
              style={{ marginLeft: 10, width: 100, height: 100 }}
              src={ekko}
              roundedCircle
            />
          </div>
          <div className="Button" onClick={() => setShow("messages")}>
            <h5>Messages</h5>
          </div>
          <div className="Button" onClick={() => setShow("contacts")}>
            <h5>Contacts</h5>
          </div>
          <div className="Button" onClick={() => setShow("settings")}>
            <h5>Settings</h5>
          </div>
        </Col>
        <Col md={4} className="pt-2 d-grid gap-4 border-end">
          <Row className="">
            <div>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  variant="outline-dark"
                  className="btn btn-dark"
                  type="submit"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </form>
            </div>
            <Row>
              {show === "messages" ? (
                <Messages />
              ) : show === "contacts" ? (
                <Contacts />
              ) : show === "settings" ? (
                <Settings />
              ) : null}
            </Row>
          </Row>
        </Col>
        <Col md={6} className=" d-grid gap-4">
          <Row>
            <Col>
              {user !== "" ? (
                <UserProfile
                  firstname={user.firstname}
                  lastname={user.lastname}
                  email={user.email}
                  age={user.age}
                  gender={user.gender}
                  location={user.location}
                />
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DashBoard;
