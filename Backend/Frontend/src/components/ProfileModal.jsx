import React, { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";

const ProfileModal = ({ isOpen, onClose, user, onUpdate, onDeleteAccount }) => {
  const [name, setName] = useState(user.name);
  const [profilePic, setProfilePic] = useState(user.profilepic);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [isViewingProfilePic, setIsViewingProfilePic] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    onUpdate(name, file);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300">
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center mb-6 text-base-content">
            Edit Profile
          </h2>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsViewingProfilePic(true)}>
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-2 shadow-lg hover:brightness-110 transition-all cursor-pointer z-10"
                title="Change Photo">
                <FaCamera className="text-sm" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input input-bordered w-full bg-base-200 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary w-full text-white mt-4">
            Save Changes
          </button>

          <div className="divider">DANGER ZONE</div>

          <button
            onClick={onDeleteAccount}
            className="btn btn-outline btn-error w-full">
            Delete Account Permanent
          </button>
        </div>
      </div>
    </div>

      {isViewingProfilePic && (
        <div
          className="fixed inset-0 z-[100] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          onClick={() => setIsViewingProfilePic(false)}>
          <div className="relative max-w-lg w-full p-4 flex justify-center">
            <img
              src={profilePic}
              alt="My Profile"
              className="max-w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
