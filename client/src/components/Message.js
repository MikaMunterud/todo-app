export default function Message({ message, setMessage, className }) {
  setTimeout(function () {
    setMessage(false);
  }, 7000);
  return message ? <p className={className}>{message}</p> : null;
}
