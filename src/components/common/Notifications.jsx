import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utility/formateDate";
import { getErrorMessage } from "@/utility/getErrorMessage";
import { toast } from "react-toastify";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { removeNotification } from "@/features/notifications/notificationsSlice";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const notifications = useSelector((state) => state.notifications.items);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          type="button"
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg "
        >
          <Bell className="text-green-600" />
          <span className="sr-only">Notifications</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-0 end-5 dark:border-gray-900">
            {notifications.length}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4 py-2 pr-4 ">
        <DropdownMenuLabel>Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          {notifications.map((notification) => {
            return (
              <div key={notification._id}>
                <DropdownMenuItem>
                  <div className="flex items-center justify-between mr-3">
                    <img
                      src={
                        notification.userImg ||
                        "https://res.cloudinary.com/do3fiil0d/image/upload/v1731310660/defaultuseravatar_cvy0bs.avif"
                      }
                      alt="User profile"
                      width={200}
                      height={200}
                      className="w-9 h-9 rounded-full border"
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/orders/${notification._id}`);
                      }}
                      className="flex flex-col space-y-1 ml-3 mr-3"
                    >
                      <p className="text-xs">
                        Order from{" "}
                        {notification.userFullName || notification.userMo}
                      </p>

                      <div className="flex items-center space-x-5">
                        <p className="px-1 font-thin bg-green-700 text-white rounded-full text-xs">
                          {notification.orderStatus}
                        </p>
                        <p className="text-xs">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs">
                        <span className="text-green-900">
                          ₹{notification.amount.toFixed(2)}
                        </span>{" "}
                        ( {notification.orderItems.length} x Items )
                      </p>
                    </div>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await axiosPrivate.patch(
                            `/api/v1/orders/${notification._id}/notifications/remove`
                          );
                          dispatch(removeNotification(notification._id));
                          toast.success("Notification removed !");
                        } catch (error) {
                          const { message } = getErrorMessage(error);
                          toast.error(message);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      className="rounded-md hover:bg-red-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
