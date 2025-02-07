import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Bell, HelpCircle, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  branchName?: string;
  userAvatar?: string;
  userName?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogout?: () => void;
}

const Header = ({
  branchName = "Main Branch",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  userName = "John Doe",
  notificationCount = 0,
  onNotificationClick = () => {},
  onSettingsClick = () => {},
  onHelpClick = () => {},
  onLogout = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">{branchName}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={onHelpClick}>
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHelpClick}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
