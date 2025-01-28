import Notification from "@/models/notification";

export const createNotification = async ({
  sentTo,
  title,
  message,
  link = "",
}) => {
  try {
    const notification = await Notification.create({
      sentTo,
      title,
      message,
      link,
    });
    return {
      success: true,
      message: "Notification sent to user.",
      data: notification,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to notify user. " + error.message,
    };
  }
};
