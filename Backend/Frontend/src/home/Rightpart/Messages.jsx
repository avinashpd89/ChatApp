import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.jsx";
import useConversation from "../../zustand/useConversation.js";
import Loading from "../../components/Loading.jsx";
import { formatChatHeaderDate } from "../../utils/dateUtils.js";

function Messages() {
  const { loading, message } = useGetMessage();

  const { selectedConversation } = useConversation();
  const containerRef = useRef();
  const contentRef = useRef();
  const lastConvIdRef = useRef();
  const isInitialLoadRef = useRef(true);

  // Scroll to bottom functionality
  const scrollToBottom = (behavior) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: behavior || "auto",
      });
    }
  };

  // Reset initial load flag when conversation changes
  useEffect(() => {
    if (lastConvIdRef.current !== selectedConversation?._id) {
      isInitialLoadRef.current = true;
      lastConvIdRef.current = selectedConversation?._id;
      // Immediate scroll for sync feel
      scrollToBottom("auto");
    }
  }, [selectedConversation?._id]);

  // Detect mobile keyboard opening via VisualViewport API
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportResize = () => {
      // When keyboard opens, viewport height shrinks.
      // We scroll to bottom to keep the latest messages visible.
      scrollToBottom("smooth");
    };

    window.visualViewport.addEventListener("resize", handleViewportResize);
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize,
        );
      }
    };
  }, []);

  // Use ResizeObserver to catch ANY height changes (including late image loads)
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      const behavior = isInitialLoadRef.current ? "auto" : "smooth";
      scrollToBottom(behavior);

      // After first scroll on new chat, future scrolls (new messages) should be smooth
      if (isInitialLoadRef.current) {
        // Small timeout to protect against rapid initial ResizeObserver fires
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 100);
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [selectedConversation?._id]); // Re-bind if conversation changes just to be safe

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto min-w-0">
      <div ref={contentRef} className="flex flex-col">
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
            <div className="h-4" />
          </>
        ) : (
          <div>
            <p className="text-center mt-[20%]">
              Say! Hi to start the conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
