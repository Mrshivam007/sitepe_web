import React from "react";
import {
  AlignJustify,
  Bell,
  LayoutDashboard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Notifications from "../common/Notifications";
import UserAvatar from "../common/UserAvatar";

export default function Header({ showSidebar, setShowSidebar }) {
  return (
    <div className="h-full justify-between px-4 flex items-center">
      {/* Hidden on mobile, visible on larger screens */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="text-green-600 hidden md:block"
      >
        <AlignJustify />
      </button>

      {/* 3 Icons */}
      <div className="flex space-x-3 text-green-600">
        {/* <ThemeSwitcherBtn /> */}
        {/* Notification component */}
        <Notifications />
        {/* user avatar */}
        <UserAvatar />
      </div>

      {/* Visible on mobile, hidden on larger screens */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="text-green-600 md:hidden"
      >
        <AlignJustify />
      </button>
    </div>
  );
}
