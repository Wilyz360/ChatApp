const Profile = ({ user }) => {
  console.log(user);
  return (
    <>
      <div>
        <h1>
          {user.firstname} {user.lastname}
        </h1>
        <p>{user.email}</p>
      </div>
    </>
  );
};

export default Profile;
