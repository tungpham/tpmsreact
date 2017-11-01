import notification from 'antd/lib/notification';
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 5,
});

const NotificationCenter = {

  success(message) {
    notification['success']({
      message: 'Success!',
      description: message,
    });
  },

  newMessage(title, message) {
    notification['success']({
      message: title,
      description: message,
    });
  },

  warning(message) {
    notification['warning']({
      message: 'Warning!',
      description: message,
    });
  },

  somethingLookLikeWentWrong() {
    notification['error']({
      message: 'Oops!',
      description: 'Something look like went wrong!',
    });
  }
};

export default NotificationCenter;
