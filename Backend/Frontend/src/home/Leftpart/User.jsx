import React, { useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import Avatar from "../../assets/avatar.jpg";
import { useNotifications } from "../../context/NotificationContext";
import NotificationBadge from "../../components/NotificationBadge";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authprovider";
import ProfilePopup from "../../components/ProfilePopup";
import MediaViewer from "../../components/MediaViewer";

function User({ user }) {
  const navigate = useNavigate();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const { unreadCounts } = useNotifications();
  const [authUser] = useAuth();

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");

  const inOnline = onlineUsers.some(
    (id) => id.toString() === user._id?.toString(),
  );
  const unreadCount = unreadCounts[user._id?.toString()] || 0;

  const { lastMessages } = useConversation();
  const lastMsg = lastMessages?.[user._id?.toString()];

  const handleSelectConversation = async (selectedUser) => {
    navigate(`?conversation=${selectedUser._id}`);
    // setSelectedConversation(selectedUser); // App.jsx will handle this now via URL sync

    // Mark messages as read on backend
    if (unreadCount > 0 && authUser?.user?._id) {
      try {
        await axios.put(`/api/message/markAsRead/${selectedUser._id}`);
        console.log("Messages marked as read for:", selectedUser._id);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    // Only show popup on mobile screens (typically < 768px)
    if (window.innerWidth < 768) {
      setShowProfilePopup(true);
    } else {
      // On desktop, we can still show full image or just do the normal selection
      // But user specifically asked for "On mobile", so we stick to that logic.
      handleSelectConversation(user);
    }
  };

  const handleShowFullImage = (url) => {
    setViewerUrl(url);
    setShowMediaViewer(true);
  };

  return (
    <>
      <div
        className={`hover:bg-base-200 duration-300 transition-all ${
          isSelected ? "bg-base-100" : ""
        }`}
        onClick={() => handleSelectConversation(user)}>
        <div className="flex items-center px-6 py-4 cursor-pointer gap-4">
          {/* Avatar Section */}
          <div
            className={`avatar ${inOnline ? "online" : ""}`}
            onClick={handleAvatarClick}>
            <div className="w-12 rounded-full ring-1 ring-base-content/10 shadow-sm overflow-hidden">
              <img
                src={user.profilepic || Avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <h1 className="font-bold truncate text-base-content text-sm md:text-base leading-tight">
                {user.isGroup ? user.groupName : user.name}
              </h1>
              {lastMsg?.time && (
                <span
                  className={`text-[10px] md:text-xs shrink-0 ${
                    unreadCount > 0 ? "text-red-500 font-bold" : "opacity-40"
                  }`}>
                  {lastMsg.time}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center gap-2">
              <p
                className={`text-xs truncate flex-1 ${
                  unreadCount > 0
                    ? "text-base-content font-medium opacity-90"
                    : "opacity-50"
                }`}>
                {lastMsg?.text || ""}
              </p>
              <div className="shrink-0">
                <NotificationBadge count={unreadCount} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfilePopup && (
        <ProfilePopup
          user={user}
          onClose={() => setShowProfilePopup(false)}
          onShowFullImage={handleShowFullImage}
        />
      )}

      {showMediaViewer && (
        <MediaViewer
          mediaUrl={viewerUrl}
          mediaType="image"
          isOpen={showMediaViewer}
          onClose={() => setShowMediaViewer(false)}
          showDownload={false}
        />
      )}
    </>
  );
}

export default User;
