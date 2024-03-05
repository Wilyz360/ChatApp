import { Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar className="justify-content-center" bg="dark" data-bs-theme="dark">
      <Navbar.Brand href="/" className="">
        TextMePLS
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;
