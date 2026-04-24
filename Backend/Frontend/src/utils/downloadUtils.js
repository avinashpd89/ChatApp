// Utility function to download files from data URLs or blob URLs
export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate filename with timestamp for images/videos
export const generateMediaFilename = (extension, type = "media") => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  return `${type}_${timestamp}.${extension}`;
};

// Get file extension from data URL
export const getExtensionFromDataUrl = (dataUrl) => {
  if (!dataUrl) return "png";
  const match = dataUrl.match(/data:([^;]+);/);
  if (match && match[1]) {
    const mimeType = match[1];
    if (mimeType.includes("image")) {
      const ext = mimeType.split("/")[1];
      return ext === "jpeg" ? "jpg" : ext;
    }
    if (mimeType.includes("video")) {
      return mimeType.split("/")[1] || "mp4";
    }
  }
  return "png";
};

// Download image from data URL
export const downloadImage = (dataUrl, filename) => {
  const extension = getExtensionFromDataUrl(dataUrl);
  const finalFilename = filename || generateMediaFilename(extension, "image");
  downloadFile(dataUrl, finalFilename);
};

// Download video from data URL
export const downloadVideo = (dataUrl, filename) => {
  const extension = getExtensionFromDataUrl(dataUrl);
  const finalFilename = filename || generateMediaFilename(extension, "video");
  downloadFile(dataUrl, finalFilename);
};
