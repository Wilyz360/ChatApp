import React from "react";
import Profile from "./Profile";

const Col3 = ({ show }) => {
  return (
    <>
      <div className="col-6 col_3">
        {show === "profile" ? (
          <Profile />
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
