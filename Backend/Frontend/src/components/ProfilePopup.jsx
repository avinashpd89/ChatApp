import React, { useState } from "react";
import { IoVideocam, IoCall, IoChatbubble, IoInformationCircle } from "react-icons/io5";
import Avatar from "../assets/avatar.jpg";
import { useCall } from "../context/CallProvider";
import useConversation from "../zustand/useConversation";
import { useNavigate } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";

const ProfilePopup = ({ user, onClose, onShowFullImage }) => {
  const { callUser } = useCall();
  const { setSelectedConversation } = useConversation();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  if (!user) return null;

  const handleMessage = (e) => {
    e.stopPropagation();
    navigate(`?conversation=${user._id}`);
    onClose();
  };

  const handleAudioCall = (e) => {
    e.stopPropagation();
    if (user.isGroup) {
      callUser(user._id, user.groupName, user.groupProfilePic, false, user.members);
    } else {
      callUser(user._id, user.name, user.profilepic, false);
    }
    onClose();
  };

  const handleVideoCall = (e) => {
    e.stopPropagation();
    if (user.isGroup) {
      callUser(user._id, user.groupName, user.groupProfilePic, true, user.members);
    } else {
      callUser(user._id, user.name, user.profilepic, true);
    }
    onClose();
  };

  const handleOpenInfo = (e) => {
    e.stopPropagation();
    setShowInfo(true);
  };

  const displayName = user.isGroup ? user.groupName : user.name;
  const displayPic = (user.isGroup ? user.groupProfilePic : user.profilepic) || Avatar;

  return (
    <>
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div 
          className="relative bg-[#111b21] w-full max-w-[280px] rounded-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Name Overlay */}
          <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent z-10">
            <h2 className="text-white text-lg font-medium truncate">{displayName}</h2>
          </div>

          {/* Profile Image */}
          <div 
            className="aspect-square w-full cursor-pointer relative overflow-hidden"
            onClick={() => {
              onShowFullImage(displayPic);
              onClose();
            }}
          >
            <img 
              src={displayPic} 
              alt={displayName} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-around p-2 bg-[#111b21]">
            <button 
              onClick={handleMessage}
              className="p-3 text-[#00a884] hover:bg-white/5 rounded-full transition-colors"
              title="Message"
            >
              <IoChatbubble className="text-2xl" />
            </button>
            <button 
              onClick={handleAudioCall}
              className="p-3 text-[#00a884] hover:bg-white/5 rounded-full transition-colors"
              title="Audio Call"
            >
              <IoCall className="text-2xl" />
            </button>
            <button 
              onClick={handleVideoCall}
              className="p-3 text-[#00a884] hover:bg-white/5 rounded-full transition-colors"
              title="Video Call"
            >
              <IoVideocam className="text-2xl" />
            </button>
            <button 
              onClick={handleOpenInfo}
              className="p-3 text-[#00a884] hover:bg-white/5 rounded-full transition-colors"
              title="Info"
            >
              <IoInformationCircle className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <UserInfoModal 
          user={user} 
          onClose={() => {
            setShowInfo(false);
            onClose(); // Also close the popup when info is closed or leave it open? 
            // Usually, opening info replaces the popup.
          }} 
        />
      )}
    </>
  );
};

export default ProfilePopup;
