import Profile from "./Profile";
import UserProfile from "./UserProfile";
import Settings from "./Settings";

const main_user = JSON.parse(localStorage.getItem("profile"));

const Col3 = ({ show, userState }) => {
  return (
    <>
      <div className="col-6 col_3">
        {show === "profile" ? (
          <UserProfile user={main_user} />
        ) : show === "searchUser" ? (
          <div>
            <UserProfile user={userState} />
          </div>
        ) : show === "settings" ? (
          <Settings />
        ) : (
          <div>
            <div className="border-bottom">
              <h3>User Name</h3>
            </div>
            <div>
              <p>Messages</p>
            </div>
            <div className="row position-absolute bottom-0 w-50">
              <div className="p-2 border-top">
                <form className="d-flex">
                  <textarea
                    className="form-control textArea"
                    placeholder="Your message here..."
                    rows="3"
                  ></textarea>
                  <button
                    variant="outline-dark"
                    className="btn m-4 btn-dark"
                    type="submit"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Col3;
