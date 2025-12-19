import React from "react";
import { useCall } from "../context/CallProvider";
import {
  MdCallEnd,
  MdCall,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";

const CallInterface = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    remoteStream,
    micActive,
    cameraActive,
    toggleMic,
    toggleCamera,
    callEnded,
    leaveCall,
    answerCall,
    isCalling,
    rejectCall,
    isCallRejected,
  } = useCall();

  // Only render if there is an active interaction
  if (!call.isReceivingCall && !isCalling) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-95 text-white">
      {/* Outgoing Call - Ringing */}
      {isCalling && !callAccepted && (
        <div className="text-center flex flex-col items-center">
          <h2 className="text-2xl mb-6">
            {isCallRejected ? "Call Rejected" : "Calling..."}
          </h2>
          {/* Local Video Preview */}
          <div className="w-64 h-48 bg-gray-800 rounded-lg overflow-hidden mb-8 shadow-lg">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={leaveCall}
            className="btn btn-error btn-circle btn-lg text-white">
            <MdCallEnd className="text-3xl" />
          </button>
        </div>
      )}

      {/* Incoming Call Notification */}
      {call.isReceivingCall && !callAccepted && !isCalling && (
        <div className="text-center flex flex-col items-center bg-gray-800 p-10 rounded-2xl shadow-2xl">
          <h2 className="text-3xl mb-2 font-bold">{call.name}</h2>
          <p className="mb-8 text-gray-300">Incoming Video Call...</p>
          <div className="flex space-x-8">
            <button
              onClick={answerCall}
              className="btn btn-success btn-circle btn-lg text-white animate-pulse">
              <MdCall className="text-3xl" />
            </button>
            <button
              onClick={rejectCall}
              className="btn btn-error btn-circle btn-lg text-white">
              <MdCallEnd className="text-3xl" />
            </button>
          </div>
        </div>
      )}

      {/* Active Video Call */}
      {callAccepted && !callEnded && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[85vh] bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-2xl border border-gray-800">
            {/* Remote Video - Main Screen */}
            {remoteStream ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">{call.name?.[0] || "?"}</span>
                </div>
                <p>Waiting for video...</p>
              </div>
            )}

            {/* Local Video - Picture in Picture */}
            <div className="absolute top-4 right-4 w-64 h-48 bg-gray-900 shadow-xl border-2 border-gray-700 rounded-xl overflow-hidden">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6 bg-gray-900 bg-opacity-80 p-4 rounded-full border border-gray-700 backdrop-blur-sm">
              <button
                onClick={toggleMic}
                className={`btn btn-circle ${
                  micActive ? "btn-ghost" : "btn-error"
                } text-white`}>
                {micActive ? (
                  <MdMic className="text-2xl" />
                ) : (
                  <MdMicOff className="text-2xl" />
                )}
              </button>
              <button
                onClick={toggleCamera}
                className={`btn btn-circle ${
                  cameraActive ? "btn-ghost" : "btn-error"
                } text-white`}>
                {cameraActive ? (
                  <MdVideocam className="text-2xl" />
                ) : (
                  <MdVideocamOff className="text-2xl" />
                )}
              </button>
              <button
                onClick={leaveCall}
                className="btn btn-error btn-circle text-white">
                <MdCallEnd className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallInterface;
