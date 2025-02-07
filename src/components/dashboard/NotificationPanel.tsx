import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Notification,
  fetchNotifications,
  subscribeToNotifications,
  markNotificationAsRead,
} from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  onNotificationCountChange?: (count: number) => void;
}

const NotificationPanel = ({
  onNotificationCountChange = () => {},
}: NotificationPanelProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    fetchNotifications(user.id).then((data) => {
      setNotifications(data);
      onNotificationCountChange(data.filter((n) => !n.read).length);
    });

    // Subscribe to real-time updates
    const channel = subscribeToNotifications(user.id, (notification) => {
      setNotifications((prev) => {
        const newNotifications = [
          notification,
          ...prev.filter((n) => n.id !== notification.id),
        ];
        onNotificationCountChange(
          newNotifications.filter((n) => !n.read).length,
        );
        return newNotifications;
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
      onNotificationCountChange(updated.filter((n) => !n.read).length);
      return updated;
    });
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-[320px] h-full bg-white shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(notification.status)}
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
