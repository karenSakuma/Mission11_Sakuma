import { useState } from 'react';

{
  /*One of the bootstrap components */
}
const ToastNotification = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);

  return (
    <div
      className={`toast position-fixed bottom-0 end-0 m-3 ${show ? 'show' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/*notifcation shown at bottom right corner */}
      <div className="toast-header">
        <strong className="me-auto">Notification</strong>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShow(false)}
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

export default ToastNotification;
