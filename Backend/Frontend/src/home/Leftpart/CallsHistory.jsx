import React from 'react';
import useConversation from '../../zustand/useConversation';
import { IoVideocam, IoCall, IoTrashOutline } from 'react-icons/io5';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { useCall } from '../../context/CallProvider';
import { useAuth } from '../../context/Authprovider';
import toast from 'react-hot-toast';
import Avatar from "../../assets/avatar.jpg";

const CallsHistory = () => {
    const { callHistory, deleteCallHistory } = useConversation();
    const { callUser } = useCall();
    const [authUser] = useAuth();

    const userCallHistory = (callHistory || []).filter(call => call.ownerId === authUser?.user?._id);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        deleteCallHistory(id);
        toast.success("Call history deleted");
    };

    const handleCall = (e, call, isVideo) => {
        e.stopPropagation();
        callUser(
            call.contactId,
            call.name,
            call.profilepic,
            isVideo,
            call.isGroup ? [] : null // Basic group check
        );
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${timeString}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${timeString}`;
        } else {
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            return `${day} ${month}, ${timeString}`;
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="px-4 py-2 text-base-content font-semibold bg-base-200 rounded-md flex items-center justify-between">
                <span>Recent</span>
            </h1>
            <div className="py-2 flex-1 overflow-y-auto hide-scrollbar">
                {userCallHistory && userCallHistory.length > 0 ? (
                    userCallHistory.map((call, index) => (
                        <div key={index} className="flex space-x-4 px-4 py-3 hover:bg-base-200 duration-300 cursor-pointer rounded-md items-center group">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img src={call.profilepic || Avatar} alt="profile" />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <span className="font-medium text-base-content">
                                    {call.name || "Unknown"}
                                </span>
                                <div className="flex items-center text-sm text-gray-500 mt-0.5">
                                    {call.direction === 'incoming' ? (
                                        <FiArrowDownLeft className="mr-1 text-green-500" />
                                    ) : (
                                        <FiArrowUpRight className="mr-1 text-green-500" />
                                    )}
                                    <span>{formatTime(call.timestamp)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {call.type === 'video' ? (
                                    <button 
                                        onClick={(e) => handleCall(e, call, true)}
                                        className="p-2 text-base-content opacity-70 hover:opacity-100 hover:bg-base-300 rounded-full transition-all"
                                        title="Video Call"
                                    >
                                        <IoVideocam className="text-xl" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={(e) => handleCall(e, call, false)}
                                        className="p-2 text-base-content opacity-70 hover:opacity-100 hover:bg-base-300 rounded-full transition-all"
                                        title="Audio Call"
                                    >
                                        <IoCall className="text-xl" />
                                    </button>
                                )}
                                <button 
                                    onClick={(e) => handleDelete(e, call.id)}
                                    className="p-2 text-error opacity-0 group-hover:opacity-100 hover:bg-error/10 rounded-full transition-all duration-200"
                                    title="Delete history"
                                >
                                    <IoTrashOutline className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <p className="text-gray-400 text-lg">No call history</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallsHistory;
