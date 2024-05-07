import { Image, Button } from "react-bootstrap";

const Profile = ({ user }) => {
  console.log(user);

  return (
    <div>
      <h1>
        {user.firstname} {user.lastname} <hr />
      </h1>

      <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
        <p>
          Email: {user.email}
          <br />
          Age: {user.age} <br />
          Gender: {user.gender} <br />
        </p>
      </div>
    </div>
  );
};

export default Profile;
