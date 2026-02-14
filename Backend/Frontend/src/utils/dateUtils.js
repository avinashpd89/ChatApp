export const formatChatHeaderDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time part for comparison
    const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    if (isSameDay(messageDate, today)) {
        return "Today";
    }

    if (isSameDay(messageDate, yesterday)) {
        return "Yesterday";
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (messageDate > oneWeekAgo) {
        return messageDate.toLocaleDateString(undefined, { weekday: "long" });
    }

    return messageDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
};
