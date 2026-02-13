import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Authprovider";
import useConversation from "../zustand/useConversation.js";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();
  const { groups, setGroups, selectedConversation, setSelectedConversation } =
    useConversation();

  useEffect(() => {
    if (authUser) {
      // Determine the socket URL based on the environment
      const SOCKET_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4001"
          : "https://chatapp-ryiv.onrender.com";

      const socket = io(SOCKET_URL, {
        query: {
          userId: authUser.user._id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for new group creation
      socket.on("newGroup", (newGroup) => {
        console.log("Socket: New group received", newGroup);
        setGroups((prevGroups) => [...prevGroups, newGroup]);
      });

      // Listen for group updates
      socket.on("groupUpdated", (updatedGroup) => {
        console.log("Socket: Group updated", updatedGroup);
        // Update the group in the groups array
        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g._id === updatedGroup._id ? updatedGroup : g,
          ),
        );

        // Update selected conversation if it matches
        const { selectedConversation, setSelectedConversation } =
          useConversation.getState();
        if (selectedConversation?._id === updatedGroup._id) {
          setSelectedConversation(updatedGroup);
        }
      });

      // Listen for group deletion
      socket.on("groupDeleted", (deletedGroupId) => {
        console.log("Socket: Group deleted", deletedGroupId);

        setGroups((prevGroups) =>
          prevGroups.filter((g) => g._id !== deletedGroupId),
        );

        const { selectedConversation, setSelectedConversation } =
          useConversation.getState();
        if (selectedConversation?._id === deletedGroupId) {
          setSelectedConversation(null);
        }
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
