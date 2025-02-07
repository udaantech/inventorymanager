import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell, CheckCircle, Clock, XCircle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
}

interface NotificationPanelProps {
  notifications?: Notification[];
}

const NotificationPanel = ({
  notifications = [
    {
      id: "1",
      title: "Request #1234 Updated",
      message: "Your inventory request has been approved",
      timestamp: "2 hours ago",
      status: "approved",
    },
    {
      id: "2",
      title: "Request #1235 Pending",
      message: "Awaiting headquarters review",
      timestamp: "3 hours ago",
      status: "pending",
    },
    {
      id: "3",
      title: "Request #1233 Rejected",
      message: "Request exceeded maximum limit",
      timestamp: "1 day ago",
      status: "rejected",
    },
  ] as Notification[],
}: NotificationPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-[320px] h-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[800px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="bg-gray-50">
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
                        {notification.timestamp}
                      </p>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
