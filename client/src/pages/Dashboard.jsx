import "../styles/Dashboard.css";
import Col1 from "../components/Col1";
import Col3 from "../components/Col3";

const DashBoard = () => {
  return (
    <div className="container">
      <div className="row">
        <Col1 />

        <Col3 />
      </div>
    </div>
  );
};

export default DashBoard;
