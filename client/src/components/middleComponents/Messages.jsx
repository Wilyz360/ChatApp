import React, { useState } from "react";

const Messages = ({ setShowLeftComponent, setSelectMessage }) => {
  const handleMessage = () => {
    setShowLeftComponent("messages");
  };

  return (
    <>
      <div onClick={handleMessage}>
        <p>message 1</p>
      </div>
      <div>
        <p>message 2</p>
      </div>
      <div>
        <p>message 3</p>
      </div>
      <div>
        <p>message 4</p>
      </div>
    </>
  );
};

export default Messages;
