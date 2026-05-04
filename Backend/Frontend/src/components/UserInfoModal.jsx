import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  IoArrowBack,
  IoChatbubble,
  IoCall,
  IoVideocam,
  IoChevronForward,
  IoClose,
  IoSearch,
} from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../assets/avatar.jpg";
import { useCall } from "../context/CallProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import MediaViewer from "./MediaViewer";
import userGetAllUsers from "../context/userGetAllUsers";

const UserInfoModal = ({ user, onClose }) => {
  const { callUser } = useCall();
  const navigate = useNavigate();
  const { setUsers, users: allStoredUsers } = useConversation();
  const [allUsers] = userGetAllUsers();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSearch, setShareSearch] = useState("");

  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showFullMedia, setShowFullMedia] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");
  const [viewerType, setViewerType] = useState("image");

  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch and filter media
  useEffect(() => {
    const fetchMedia = async () => {
      setLoadingMedia(true);
      try {
        const res = await axios.get(`/api/message/get/${user._id}`);
        const messages = res.data;

        // This is a simplified extraction. In a real app, we might need to decrypt them first
        // if they are E2E encrypted. Assuming we want to show what's currently available.
        const extractedMedia = messages
          .filter(
            (m) =>
              m.messageType === "image" ||
              m.messageType === "video" ||
              m.messageType === "document" ||
              m.message?.match(/(https?:\/\/[^\s]+)/g),
          )
          .map((m) => ({
            id: m._id,
            type: m.messageType,
            url: m.message,
            timestamp: m.createdAt,
          }));

        setMediaItems(extractedMedia);
      } catch (err) {
        console.error("Error fetching media", err);
      } finally {
        setLoadingMedia(false);
      }
    };
    fetchMedia();
  }, [user._id]);

  if (!user) return null;

  const handleMessage = () => {
    navigate(`?conversation=${user._id}`);
    onClose();
  };

  const handleAudioCall = () => {
    if (user.isGroup) {
      callUser(
        user._id,
        user.groupName,
        user.groupProfilePic,
        false,
        user.members,
      );
    } else {
      callUser(user._id, user.name, user.profilepic, false);
    }
    onClose();
  };

  const handleVideoCall = () => {
    if (user.isGroup) {
      callUser(
        user._id,
        user.groupName,
        user.groupProfilePic,
        true,
        user.members,
      );
    } else {
      callUser(user._id, user.name, user.profilepic, true);
    }
    onClose();
  };

  const handleEditName = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditing(false);
      return;
    }
    try {
      await axios.put(`/api/user/update/${user._id}`, { name: newName });
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, name: newName } : u)),
      );
      user.name = newName; // Local update for UI
      setIsEditing(false);
      toast.success("Name updated");
    } catch (err) {
      toast.error("Failed to update name");
    }
  };

  const handleShareContact = async (targetUser) => {
    try {
      const shareContent = `Contact Info:\nName: ${user.name}\nEmail: ${user.email}`;
      await axios.post("/api/message/send/" + targetUser._id, {
        message: shareContent,
        messageType: "text",
      });
      toast.success(`Shared with ${targetUser.name}`);
      setIsSharing(false);
    } catch (err) {
      toast.error("Failed to share contact");
    }
  };

  const handleShowFullProfilePic = () => {
    setViewerUrl(displayPic);
    setViewerType("image");
    setViewerOpen(true);
  };

  const displayName = user.isGroup ? user.groupName : user.name;
  const displayPic =
    (user.isGroup ? user.groupProfilePic : user.profilepic) || Avatar;
  const displayEmail = user.email || "No email provided";

  const filteredShareUsers =
    allUsers?.filter(
      (u) =>
        u._id !== user._id &&
        (u.name.toLowerCase().includes(shareSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(shareSearch.toLowerCase())),
    ) || [];

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-[#0b141a] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 bg-[#0b141a] sticky top-0 z-10">
        <button onClick={onClose} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-1">
            <BsThreeDotsVertical className="text-xl" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-[#233138] rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-[#182229] transition-colors">
                Edit Name
              </button>
              <button
                onClick={() => {
                  setIsSharing(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-[#182229] transition-colors border-t border-white/5">
                Share Contact
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6">
          <div
            className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg ring-2 ring-white/5 cursor-pointer"
            onClick={handleShowFullProfilePic}>
            <img
              src={displayPic}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>

          {isEditing ? (
            <div className="flex flex-col items-center gap-2 px-4 w-full max-w-sm">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="bg-transparent text-white text-2xl font-semibold border-b-2 border-[#00a884] outline-none text-center w-full"
                onBlur={handleEditName}
                onKeyDown={(e) => e.key === "Enter" && handleEditName()}
              />
              <p className="text-[#00a884] text-xs">Press Enter to save</p>
            </div>
          ) : (
            <h1 className="text-white text-2xl font-semibold mb-1">
              {displayName}
            </h1>
          )}

          <p className="text-gray-400 text-lg mb-6">{displayEmail}</p>

          {/* Action Buttons Row */}
          <div className="flex justify-center gap-4 w-full px-4 mb-8">
            <button
              onClick={handleMessage}
              className="flex-1 max-w-[100px] aspect-square bg-[#111b21] rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-[#182229] transition-colors">
              <IoChatbubble className="text-[#00a884] text-2xl" />
              <span className="text-white text-xs font-medium">Message</span>
            </button>
            <button
              onClick={handleAudioCall}
              className="flex-1 max-w-[100px] aspect-square bg-[#111b21] rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-[#182229] transition-colors">
              <IoCall className="text-[#00a884] text-2xl" />
              <span className="text-white text-xs font-medium">Audio</span>
            </button>
            <button
              onClick={handleVideoCall}
              className="flex-1 max-w-[100px] aspect-square bg-[#111b21] rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-[#182229] transition-colors">
              <IoVideocam className="text-[#00a884] text-2xl" />
              <span className="text-white text-xs font-medium">Video</span>
            </button>
          </div>
        </div>

        {/* Media Section */}
        <div className="px-4 py-4 border-t border-white/5 bg-[#0b141a]">
          <div
            onClick={() => setShowFullMedia(true)}
            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <span className="text-white font-medium">
              Media, links, and docs
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{mediaItems.length}</span>
              <IoChevronForward className="text-gray-400" />
            </div>
          </div>

          {/* Media Preview Grid */}
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            {mediaItems.length > 0 ? (
              mediaItems.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === "image" || item.type === "video") {
                      setViewerUrl(item.url);
                      setViewerType(item.type);
                      setViewerOpen(true);
                    }
                  }}
                  className="w-24 h-24 bg-gray-800 rounded-lg shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <IoVideocam className="text-white/50 text-2xl" />
                      <video
                        src={item.url}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-[10px] text-gray-400 uppercase truncate w-full">
                        {item.type}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full py-8 text-center text-gray-500 text-sm">
                No media found in this chat
              </div>
            )}
          </div>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Full Media Gallery View */}
      {showFullMedia && (
        <div className="fixed inset-0 z-[2100] bg-[#0b141a] flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center p-4 gap-4 bg-[#0b141a] sticky top-0 border-b border-white/5">
            <button
              onClick={() => setShowFullMedia(false)}
              className="text-white">
              <IoArrowBack className="text-2xl" />
            </button>
            <span className="text-white font-medium">
              Media, links, and docs
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-1">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === "image" || item.type === "video") {
                    setViewerUrl(item.url);
                    setViewerType(item.type);
                    setViewerOpen(true);
                  }
                }}
                className="aspect-square bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt="media"
                    className="w-full h-full object-cover"
                  />
                ) : item.type === "video" ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <IoVideocam className="text-white/50 text-3xl" />
                    <video
                      src={item.url}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2 text-center break-all text-[10px] text-gray-400">
                    {item.url.substring(0, 20)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Selection Modal */}
      {isSharing && (
        <div className="fixed inset-0 z-[2200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111b21] w-full max-w-sm rounded-2xl flex flex-col max-h-[80vh] shadow-2xl border border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Share Contact</h3>
              <button
                onClick={() => setIsSharing(false)}
                className="text-gray-400 hover:text-white">
                <IoClose className="text-2xl" />
              </button>
            </div>

            <div className="p-4 bg-[#202c33] mx-4 my-2 rounded-full flex items-center gap-3">
              <IoSearch className="text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search contact to share..."
                className="bg-transparent outline-none text-white w-full text-sm"
                value={shareSearch}
                onChange={(e) => setShareSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {filteredShareUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleShareContact(u)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img
                      src={u.profilepic || Avatar}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-sm">
                      {u.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">{u.email}</p>
                  </div>
                </div>
              ))}
              {filteredShareUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No contacts found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Media Viewer */}
      {viewerOpen && (
        <MediaViewer
          mediaUrl={viewerUrl}
          mediaType={viewerType}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          showDownload={viewerType === "image" && viewerUrl === displayPic ? false : true}
        />
      )}
    </div>,
    document.body,
  );
};

export default UserInfoModal;
