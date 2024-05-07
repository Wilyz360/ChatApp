import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <Navbar className="justify-content-center" bg="dark" data-bs-theme="dark">
      <Navbar.Brand href="/" className="">
        TextMePLS
      </Navbar.Brand>
      <button onClick={handleLogOut}>Log out</button>
    </Navbar>
  );
};

export default Header;
