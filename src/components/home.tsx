import React from "react";
import Header from "./dashboard/Header";
import NotificationPanel from "./dashboard/NotificationPanel";
import ProductCatalog from "./inventory/ProductCatalog";
import StatusTracker from "./requests/StatusTracker";

const Home = () => {
  const [notifications, setNotifications] = React.useState(3);

  const handleNotificationClick = () => {
    // Handle notification click
    console.log("Notification clicked");
  };

  const handleRequestChange = (productId: string, quantity: number) => {
    // Handle request change
    console.log(`Product ${productId} quantity changed to ${quantity}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        notificationCount={notifications}
        onNotificationClick={handleNotificationClick}
      />

      <div className="flex gap-4 p-4 h-[calc(100vh-4rem)]">
        <div className="flex-1 space-y-4 overflow-auto">
          <ProductCatalog onRequestChange={handleRequestChange} />
          <StatusTracker />
        </div>

        <NotificationPanel />
      </div>
    </div>
  );
};

export default Home;
