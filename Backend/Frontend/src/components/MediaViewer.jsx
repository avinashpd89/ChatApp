import { useEffect } from "react";
import { AiOutlineDownload, AiOutlineClose } from "react-icons/ai";
import { downloadImage, downloadVideo } from "../utils/downloadUtils";

function MediaViewer({ mediaUrl, mediaType, isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (mediaType === "image") {
      downloadImage(mediaUrl);
    } else if (mediaType === "video") {
      downloadVideo(mediaUrl);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}>
      <div
        className="relative w-full max-w-2xl sm:max-w-4xl flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}>
        {/* Media Container */}
        <div className="relative w-full flex items-center justify-center max-h-[75vh] sm:max-h-[85vh]">
          {mediaType === "image" ? (
            <img
              src={mediaUrl}
              alt="Full view"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-0 sm:top-4 sm:right-4 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110"
            title="Close (Esc)">
            <AiOutlineClose size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="w-full flex items-center justify-between gap-2 mt-3 sm:mt-4 px-2 sm:px-0">
          {/* Info text for closing */}
          <div className="text-white/60 text-xs sm:text-sm font-medium">
            
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap"
            title="Download">
            <AiOutlineDownload size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaViewer;
