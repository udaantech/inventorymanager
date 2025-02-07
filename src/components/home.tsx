import React, { useState, useRef } from "react";
import Header from "./dashboard/Header";
import NotificationPanel from "./dashboard/NotificationPanel";
import ProductCatalog from "./inventory/ProductCatalog";
import StatusTracker from "./requests/StatusTracker";
import { useAuth } from "@/lib/auth";

const Home = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const [cartItems, setCartItems] = useState<
    Array<{ productId: string; quantity: number }>
  >([]);

  const handleRequestChange = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.productId !== productId);
        }
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
      }
      if (quantity > 0) {
        return [...prev, { productId, quantity }];
      }
      return prev;
    });
  };

  // Close notifications panel when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        notificationCount={notifications}
        onNotificationClick={handleNotificationClick}
        userName={user?.email}
        onLogout={signOut}
      />

      <div className="flex gap-4 p-4 h-[calc(100vh-4rem)] relative">
        <div className="flex-1 space-y-4 overflow-auto">
          <ProductCatalog onRequestChange={handleRequestChange} />
          <StatusTracker />
        </div>

        {/* Notifications Panel with animation */}
        <div
          ref={notificationsPanelRef}
          className={`transition-transform duration-300 transform ${showNotifications ? "translate-x-0" : "translate-x-[320px]"} absolute right-0 top-0 bottom-0 z-50 h-full`}
        >
          <NotificationPanel onNotificationCountChange={setNotifications} />
        </div>
      </div>
    </div>
  );
};

export default Home;
