import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(); // Create a context for socket
const SOCKET_URL = "http://localhost:4000";

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  console.log("SocketProvider rendered, isAuthenticated:", isAuthenticated);
  useEffect(() => {
    // Effect to handle socket connection based on authentication status
    if (isAuthenticated) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });
      setSocket(newSocket);
      console.log("Socket connected:", newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server with ID:", newSocket.id);
      });

      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [isAuthenticated]);
  return (
    // Provide socket instance to children components
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
