import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice";

export default function UserAvatar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button>
          <img
            src={
              "https://res.cloudinary.com/do3fiil0d/image/upload/v1731310660/defaultuseravatar_cvy0bs.avif"
            }
            alt="User profile"
            width={200}
            height={200}
            className="w-8 h-8 rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4 py-2 pr-8">
        <DropdownMenuLabel>Takeshwar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/dashboard" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/dashboard/profile" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            onClick={() => {
              dispatch(logoutUser());
              navigate("/auth");
            }}
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
