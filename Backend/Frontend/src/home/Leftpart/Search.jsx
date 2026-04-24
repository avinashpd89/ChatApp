import React, { useState, useRef, useEffect } from "react";
import { IoSearch, IoPersonAdd, IoMoon, IoSunny, IoSettingsOutline } from "react-icons/io5";
import { HiEllipsisVertical } from "react-icons/hi2";
import { MdGroupAdd } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import useGetAllUsers from "../../context/userGetAllUsers.jsx";
import useConversation from "../../zustand/useConversation.js";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import GroupCreationModal from "../../components/GroupCreationModal.jsx";
import ProfileModal from "../../components/ProfileModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { compressImage } from "../../utils/imageCompression";

function Search({ onFilterChange, searchQuery, setSearchQuery }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const menuRef = useRef(null);
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation, users, setUsers, setGroups, groups, clearAllData, setIsModalOpen } = useConversation();

  // New states for Settings / Profile / Theme / Logout
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("ChatApp")) || { user: {} }
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync global modal state to hide input box
  useEffect(() => {
    setIsModalOpen(isProfileModalOpen || confirmDelete || isCreatingGroup);
    return () => setIsModalOpen(false);
  }, [isProfileModalOpen, confirmDelete, isCreatingGroup, setIsModalOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Theme effect
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  // Profile update handler
  const handleUpdateProfile = async (newName, file) => {
    let base64Data = null;
    if (file) {
      try {
        const compressedBlob = await compressImage(file, {
          maxWidth: 1024,
          maxHeight: 1024,
          quality: 0.7,
        });

        const convertToBase64 = (blob) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(blob);
          });
        };
        base64Data = await convertToBase64(compressedBlob);
      } catch (compressionError) {
        console.error("Compression failed:", compressionError);
        return toast.error("Failed to process image");
      }
    }

    try {
      const payload = {};
      if (newName) payload.name = newName;
      if (base64Data) payload.profilepic = base64Data;

      const res = await axios.put("/api/user/update", payload);

      const updatedUser = { ...authUser, user: res.data.user };
      try {
        localStorage.setItem("ChatApp", JSON.stringify(updatedUser));
      } catch (storageError) {
        if (storageError.name === "QuotaExceededError") {
          console.warn("Storage full! Saving user without profile pic to local cache.");
          const leanUser = {
            ...updatedUser,
            user: { ...updatedUser.user, profilepic: "" },
          };
          localStorage.setItem("ChatApp", JSON.stringify(leanUser));
        }
      }
      setAuthUser(updatedUser);

      toast.success("Profile updated!");
      setIsProfileModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/user/delete/${authUser.user._id}`);
      toast.success("Account deleted permanently");
      clearAllData();
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete account");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      clearAllData();
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
      toast.success("Logout successfully");
      window.location.reload();
    } catch (error) {
      console.log("Error in Logout: ", error);
      toast.error("Error in logout");
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    onFilterChange(type);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const conversation = allUsers.find((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (conversation) {
      setSelectedConversation(conversation);
    } else {
      toast.error("User not found");
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!addEmail) return;
    try {
      const response = await axios.post("/api/user/add", { email: addEmail });
      toast.success(response.data.message);
      setAddEmail("");
      setIsAdding(false);
      setUsers([...users, response.data.user]);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to add contact";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-base-content">
            {isAdding ? "Add Contact" : "Chats"}
          </h2>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-primary hover:text-primary-focus p-2 rounded-full hover:bg-base-200 transition-colors"
              title="Menu">
              <HiEllipsisVertical className="text-2xl" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-base-100 rounded-lg shadow-lg border border-base-200 z-[100] w-52">
                {isAdding ? (
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 rounded-lg transition-colors">
                    <IoSearch className="text-lg" />
                    <span>Return to Search</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsAdding(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 rounded-t-lg transition-colors">
                      <IoPersonAdd className="text-lg" />
                      <span>Add New Contact</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingGroup(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 transition-colors">
                      <MdGroupAdd className="text-lg" />
                      <span>Create New Group</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 transition-colors border-t border-base-200">
                      <IoSettingsOutline className="text-lg" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setTheme(theme === "light" ? "dark" : "light");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 transition-colors">
                      {theme === "light" ? (
                        <>
                          <IoMoon className="text-lg" />
                          <span>Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <IoSunny className="text-lg" />
                          <span>Light Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3 rounded-b-lg transition-colors text-red-500 border-t border-base-200">
                      <BiLogOutCircle className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        {!isAdding && (
          <div className="flex gap-2 mb-2 px-1 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterType === "all"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}>
              All
            </button>
            <button
              onClick={() => handleFilterChange("unread")}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterType === "unread"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}>
              Unread
            </button>
            <button
              onClick={() => handleFilterChange("groups")}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterType === "groups"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}>
              Groups
            </button>
            <button
              onClick={() => handleFilterChange("calls")}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterType === "calls"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}>
              Calls
            </button>
          </div>
        )}

        {isCreatingGroup && (
          <GroupCreationModal
            closeModal={() => setIsCreatingGroup(false)}
            users={users}
            onGroupCreated={(newGroup) => {
              setGroups([...groups, newGroup]);
              setSelectedConversation(newGroup);
            }}
          />
        )}

        {isAdding ? (
          <form onSubmit={handleAddContact}>
            <div className="flex items-center gap-2 bg-[#202c33] rounded-full px-4 py-2 border border-gray-700/50 focus-within:border-blue-500/50 transition-all duration-300">
              <IoPersonAdd className="text-gray-400 text-xl" />
              <input
                type="email"
                className="grow bg-transparent outline-none text-gray-200 placeholder-gray-400 font-normal"
                placeholder="Enter email to add"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
              />
              <button
                type="submit"
                className="text-blue-500 font-semibold text-sm hover:text-blue-400 transition-colors">
                ADD
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3 bg-[#202c33] rounded-full px-4 py-2.5 border border-gray-700/50 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <button type="submit">
                <IoSearch className="text-gray-400 text-xl hover:text-white transition-colors" />
              </button>
              <input
                type="text"
                className="grow bg-transparent outline-none text-gray-200 placeholder-gray-400 font-normal"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}
      </div>

      {authUser?.user && (
        <>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            user={authUser.user}
            onUpdate={handleUpdateProfile}
            onDeleteAccount={() => setConfirmDelete(true)}
          />

          <ConfirmationModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDeleteAccount}
            title="Delete Account Permanent?"
            message="Are you sure you want to delete your account permanently? All your data will be lost. This action cannot be undone."
            confirmText="Delete Permanent"
            confirmButtonClass="btn-error"
          />
        </>
      )}
    </div>
  );
}

export default Search;
