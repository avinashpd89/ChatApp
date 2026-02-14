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
    callEnded,
    leaveCall,
    answerCall,
    isCalling,
    rejectCall,
    isCallRejected,
    toggleMic,
    toggleCamera,
    isMuted,
    isCameraOff,
    isGroupCall,
    peers,
  } = useCall();

  if (!call?.isReceivingCall && !isCalling) return null;

  // 🔥 Dynamic Grid Logic
  const totalParticipants = (peers?.length || 0) + 1;
  const columns = Math.ceil(Math.sqrt(totalParticipants));

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white">
      
      {/* ================= OUTGOING CALL ================= */}
      {isCalling && !callAccepted && (
        <div className="text-center flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {call.profilepic ? (
              <img
                src={call.profilepic}
                alt={call.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-primary">
                {call.name?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-2">{call.name}</h2>

          <p className="text-gray-400 mb-8">
            {isCallRejected
              ? "Call Rejected"
              : isGroupCall
              ? "Starting Group Call..."
              : "Calling..."}
          </p>

          {call.callType === "video" && (
            <div className="w-64 h-48 bg-gray-800 rounded-lg overflow-hidden mb-8">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            onClick={leaveCall}
            className="btn btn-error btn-circle btn-lg text-white"
          >
            <MdCallEnd className="text-3xl" />
          </button>
        </div>
      )}

      {/* ================= INCOMING CALL ================= */}
      {call.isReceivingCall && !callAccepted && !isCalling && (
        <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-6 overflow-hidden">
            {call.profilepic ? (
              <img
                src={call.profilepic}
                alt={call.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-primary">
                {call.name?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">{call.name}</h2>

          <p className="mb-8">
            Incoming {call.isGroupCall ? "Group " : ""}
            {call.callType === "video" ? "Video" : "Audio"} Call
          </p>

          <div className="flex justify-center space-x-8">
            <button
              onClick={answerCall}
              className="btn btn-success btn-circle btn-lg"
            >
              <MdCall className="text-3xl" />
            </button>

            <button
              onClick={rejectCall}
              className="btn btn-error btn-circle btn-lg"
            >
              <MdCallEnd className="text-3xl" />
            </button>
          </div>
        </div>
      )}

      {/* ================= ACTIVE CALL ================= */}
      {callAccepted && !callEnded && (
        <div className="w-full h-full flex flex-col p-4">

          {/* ================= GROUP CALL ================= */}
          {isGroupCall ? (
            <>
              <div
                className="flex-1 grid gap-2 md:gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
              >
                {/* LOCAL VIDEO */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {call.callType === "video" ? (
                    <video
                      playsInline
                      muted
                      ref={myVideo}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <MdMic className="text-5xl text-primary" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-sm">
                    You {isMuted && "🔇"} {isCameraOff && "📷"}
                  </div>
                </div>

                {/* REMOTE USERS */}
                {peers?.map((peer) => (
                  <div
                    key={peer.peerId}
                    className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video"
                  >
                    <video
                      playsInline
                      autoPlay
                      ref={(el) => {
                        if (el && peer.stream) {
                          el.srcObject = peer.stream;
                        }
                      }}
                      className={`w-full h-full object-cover ${
                        call.callType === "audio" ? "hidden" : ""
                      }`}
                    />

                    {call.callType === "audio" && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-4xl font-bold text-primary">
                          {peer.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-sm">
                      {peer.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* CONTROLS */}
              <div className="mt-6 flex justify-center gap-6">
                <button
                  onClick={toggleMic}
                  className={`btn btn-circle btn-lg ${
                    isMuted ? "btn-error" : "btn-neutral"
                  }`}
                >
                  {isMuted ? (
                    <MdMicOff className="text-2xl" />
                  ) : (
                    <MdMic className="text-2xl" />
                  )}
                </button>

                {call.callType === "video" && (
                  <button
                    onClick={toggleCamera}
                    className={`btn btn-circle btn-lg ${
                      isCameraOff ? "btn-error" : "btn-neutral"
                    }`}
                  >
                    {isCameraOff ? (
                      <MdVideocamOff className="text-2xl" />
                    ) : (
                      <MdVideocam className="text-2xl" />
                    )}
                  </button>
                )}

                <button
                  onClick={leaveCall}
                  className="btn btn-error text-white px-8 rounded-full"
                >
                  <MdCallEnd className="text-xl" /> End Call
                </button>
              </div>
            </>
          ) : (
            /* ================= 1 TO 1 CALL ================= */
            <>
              <div className="relative w-full max-w-5xl h-[75vh] bg-black rounded-lg overflow-hidden">
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className={`w-full h-full object-contain ${
                    call.callType === "audio" ? "hidden" : ""
                  }`}
                />

                {call.callType === "audio" && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                      {call.profilepic ? (
                        <img
                          src={call.profilepic}
                          alt={call.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-8xl font-bold text-primary">
                          {call.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl">{call.name}</h3>
                  </div>
                )}

                {call.callType === "video" && (
                  <div className="absolute top-4 right-4 w-56 h-40 bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      playsInline
                      muted
                      ref={myVideo}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* CONTROLS */}
              <div className="mt-6 flex gap-6">
                <button
                  onClick={toggleMic}
                  className={`btn btn-circle btn-lg ${
                    isMuted ? "btn-error" : "btn-neutral"
                  }`}
                >
                  {isMuted ? (
                    <MdMicOff className="text-2xl" />
                  ) : (
                    <MdMic className="text-2xl" />
                  )}
                </button>

                {call.callType === "video" && (
                  <button
                    onClick={toggleCamera}
                    className={`btn btn-circle btn-lg ${
                      isCameraOff ? "btn-error" : "btn-neutral"
                    }`}
                  >
                    {isCameraOff ? (
                      <MdVideocamOff className="text-2xl" />
                    ) : (
                      <MdVideocam className="text-2xl" />
                    )}
                  </button>
                )}

                <button
                  onClick={leaveCall}
                  className="btn btn-error text-white px-8 rounded-full"
                >
                  <MdCallEnd className="text-xl" /> End Call
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CallInterface;
