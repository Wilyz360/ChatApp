import { useState } from "react";
import API from "../../api/api";

const Profile = ({ user }) => {
  // console.log(user);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // console.log(currentUser);

  const [editProfile, setEditProfile] = useState(false);

  const [age, setAge] = useState();
  const [gender, setGender] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { data: result } = await API.put(`user/${currentUser._id}/update`, {
        age,
        gender,
      });

      if (result.accepted) {
        console.log(result.user);
        localStorage.removeItem("currentUser");
        localStorage.setItem("currentUser", JSON.stringify(result.user)); // save user to the local storage
        window.location.reload();
        window.alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }

    setEditProfile(false);
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // if (currentUser._id !== user._id) {
    try {
      const { data: result } = await API.get(
        `/chat/find/${currentUser._id}/${user._id}`
      );
      if (result !== null) {
        window.alert("Chat found");
      } else {
        const { data: result } = await API.post("/chat", {
          senderId: currentUser._id,
          receiverId: user._id,
        });

        if (result !== null) {
          window.alert("new chat created");
        } else {
          window.alert("something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
    }
    // }
  };

  return (
    <div>
      <h1>
        {user.firstname} {user.lastname} <hr />
      </h1>

      {!editProfile ? (
        <div>
          <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
            <p>
              Email: {user.email}
              <br />
              Age: {user.age} <br />
              Gender: {user.gender} <br />
            </p>
          </div>
          {user._id === currentUser._id ? ( // if user id is equal to current user then show edit button
            <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
              <button
                type="button"
                onClick={() => {
                  setEditProfile(true);
                }}
              >
                Edit
              </button>
            </div>
          ) : (
            <div>
              <button onClick={handleStartChat}>Chat</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
            <p>
              Email: {user.email}
              <br />
              <label htmlFor="age">Age:</label>{" "}
              <input
                id="age"
                name="age"
                maxLength="3"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />{" "}
              <br />
              Gender:{" "}
              <label>
                <input
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />{" "}
                Male
              </label>{" "}
              <label>
                <input
                  type="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />{" "}
                Female
              </label>
              <br />
            </p>
          </div>
          <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
            <button type="button" onClick={handleEdit}>
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
