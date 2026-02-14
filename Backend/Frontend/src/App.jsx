import React from "react";
import Left from "./home/Leftpart/Left";
import Right from "./home/Rightpart/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/Authprovider";
import E2EEncryptionSetup from "./context/E2EEncryptionSetup";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CallInterface from "./components/CallInterface";

import { NotificationProvider } from "./context/NotificationContext";
import useConversation from "./zustand/useConversation";

import useGetSocketMessage from "./context/useGetSocketMessage";
import useWebPush from "./hooks/useWebPush";

const NotificationHandler = () => {
  useGetSocketMessage();
  useWebPush();
  return null;
};

const NavigationHandler = () => {
  const { setSelectedConversation, users, groups } = useConversation();
  const location = useLocation();

  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    const chatId = query.get("conversation");

    if (chatId) {
      if (users.length > 0 || groups.length > 0) {
        const foundConversation =
          users.find((u) => u._id === chatId) ||
          groups.find((g) => g._id === chatId);

        if (foundConversation) {
          setSelectedConversation(foundConversation);
        }
      }
    } else {
      setSelectedConversation(null);
    }
  }, [location.search, users, groups, setSelectedConversation]);

  return null;
};

function App() {
  const [authUser] = useAuth();
  const { selectedConversation } = useConversation();

  return (
    <>
      <E2EEncryptionSetup>
        <NotificationProvider>
          <NotificationHandler />
          <BrowserRouter>
            <NavigationHandler />
            <Routes>
              <Route
                path="/"
                element={
                  authUser ? (
                    <div className="flex h-[100dvh] overflow-hidden">
                      {/* Left Part: User List */}
                      <div
                        className={`w-full md:w-[350px] bg-black ${
                          selectedConversation ? "hidden md:block" : "block"
                        }`}>
                        <Left />
                      </div>

                      {/* Right Part: Chat */}
                      <div
                        className={`flex-1 min-w-0 bg-slate-900 ${
                          !selectedConversation ? "hidden md:block" : "block"
                        }`}>
                        <Right />
                      </div>
                    </div>
                  ) : (
                    <Navigate to={"/login"} />
                  )
                }
              />
              <Route
                path="/login"
                element={authUser ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/signup"
                element={authUser ? <Navigate to="/" /> : <Signup />}
              />
            </Routes>
            <CallInterface />
          </BrowserRouter>
          <Toaster />
        </NotificationProvider>
      </E2EEncryptionSetup>
    </>
  );
}

export default App;
