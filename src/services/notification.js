export const grantForNotification = function(){
  Notification.requestPermission().then((result) => {
    if (result === 'granted') {
      randomNotification();
    }
  });
}
function randomNotification() {
  const notifTitle = 'Granted Notification';
  const notifBody = `Congratulation! Soon you will receive updates about this website`;
  const notifImg = `logo.png`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}