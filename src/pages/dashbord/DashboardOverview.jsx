import Heading from "@/components/common/Heading";
import LargeCards from "@/components/common/LargeCards";
import SmallCards from "@/components/common/SmallCards";
import SocketService from "@/api/socketService";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import OrdersTable from "./OrdersTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

export default function DashboardOverview() {
  const [orders, setOrders] = useState([]);
  const { socket } = useOutletContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (socket) {
      socket.on("receiveOrderNotification", (notification) => {
        console.log("order recived from OrderTable-->");
        setOrders((prevOrders) => [notification.order, ...prevOrders]);
      });
    }
  }, [socket]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/orders");
        setOrders(response.data.data);
      } catch (error) {
        console.log("Error while fetching orders: ", error);
        toast.error("Failed to fetch orders.");
      }
    })();
  }, []);
  return (
    <div>
      <Heading title="Dashboard Overview" />
      {/* Large Cards */}
      <LargeCards />
      {/* Small Cards */}
      <SmallCards />
      {/* Charts */}
      {/* <DashboardCharts sales={sales} orders={orders} /> */}
      {/* Recent Orders Table */}
      {/* <CustomDataTable />  */}
      <div className="overflow-x-auto mt-6">
        <h1 className="mb-2 text-xl font-semibold">Recent Orders</h1>
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
