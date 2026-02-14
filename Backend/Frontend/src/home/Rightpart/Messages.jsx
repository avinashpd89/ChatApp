import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.jsx";
import useConversation from "../../zustand/useConversation.js";
import Loading from "../../components/Loading.jsx";
import { formatChatHeaderDate } from "../../utils/dateUtils.js";

function Messages() {
  const { loading, message } = useGetMessage();

  const { selectedConversation } = useConversation();
  const lastMsgRef = useRef();
  const lastConvIdRef = useRef();

  useEffect(() => {
    const isNewChat = lastConvIdRef.current !== selectedConversation?._id;

    const scrollToBottom = () => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: isNewChat ? "auto" : "smooth",
          block: "end",
        });
      }
    };

    if (isNewChat) {
      // Small delay to ensure DOM is fully rendered and layout is settled
      const timer = setTimeout(scrollToBottom, 50);
      lastConvIdRef.current = selectedConversation?._id;
      return () => clearTimeout(timer);
    } else {
      scrollToBottom();
    }
  }, [message, selectedConversation?._id]);

  return (
    <div className="flex-1 overflow-y-auto min-w-0">
      {loading ? (
        <Loading />
      ) : message.length > 0 ? (
        <>
          {message.map((msg, index) => {
            const currentMsgDate = new Date(msg.createdAt).toDateString();
            const prevMsgDate =
              index > 0
                ? new Date(message[index - 1].createdAt).toDateString()
                : null;
            const showDateSeparator = currentMsgDate !== prevMsgDate;

            return (
              <React.Fragment key={msg._id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <span className="px-4 py-1 rounded-full bg-base-300/50 text-base-content/60 text-xs font-medium backdrop-blur-sm border border-white/5">
                      {formatChatHeaderDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <Message message={msg} />
              </React.Fragment>
            );
          })}
          <div ref={lastMsgRef} className="h-4" />
        </>
      ) : (
        <div>
          <p className="text-center mt-[20%]">
            Say! Hi to start the conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
