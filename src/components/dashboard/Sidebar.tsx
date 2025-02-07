import { Button } from "@/components/ui/button";
import { Package, Boxes, ClipboardList, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: Package, label: "Product Management", path: "/dashboard/products" },
    {
      icon: Boxes,
      label: "Inventory Management",
      path: "/dashboard/inventory",
    },
    { icon: ClipboardList, label: "Orders", path: "/dashboard/orders" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
