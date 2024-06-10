import { useToaster } from "hooks/use-toaster";

interface NotificationPopupProps {
  notification: string;
}

const NotificationPopup = ({ notification }: NotificationPopupProps) => {
  const { error } = useToaster();

  error(notification);

  return null;
};

export default NotificationPopup;
