import React from "react";
import tree from "../images/tree.jpeg";
import { Image, Button } from "react-bootstrap";

function UserProfile(props) {
  const { firstname, lastname, email, age, gender, location } = props;
  return (
    <div>
      <h1>
        {firstname} {lastname}
      </h1>
      <div className="w-50 d-flex mx-auto align-items-center justify-content-center">
        <Image
          className=" align-items-center justify-content-center"
          style={{ marginLeft: 10, width: 100, height: 100 }}
          src={tree}
          roundedCircle
        />
      </div>
      <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
        <p>
          Email: {email}
          <br />
          Age: {age} <br />
          Gender: {gender} <br />
          Location: {location}
        </p>
      </div>
      <div>
        <Button
          className="d-flex mx-auto align-items-center justify-content-center"
          variant="dark"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default UserProfile;
