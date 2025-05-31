import React, { useState, useEffect } from "react";
import { formatDate } from "@/utility/formateDate";
import { ArrowRight, Loader, Printer } from "lucide-react";
import { toast } from "react-toastify";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { TablePagination } from "@/components/common/TablePagination";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getErrorMessage } from "@/utility/getErrorMessage";

export default function OrdersTable({ orders }) {
  return (
    <div>
      <table className="w-full border-collapse border border-gray-200 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </th>
            <th className="p-2 text-left border border-gray-300">Customer</th>
            <th className="p-2 text-left border border-gray-300">Mobile No</th>
            <th className="p-2 text-left border border-gray-300">Address</th>
            <th className="p-2 text-left border border-gray-300">Order Date</th>
            <th className="p-2 text-left border border-gray-300">Items</th>
            <th className="p-2 text-left border border-gray-300">Amount</th>
            <th className="p-2 text-left border border-gray-300">Status</th>
            <th className="p-2 text-left border border-gray-300">IsPaid</th>
            <th className="p-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <TableContentRow key={order._id} order={order} />
          ))}
        </tbody>
      </table>
      <TablePagination />
    </div>
  );
}
const TableContentRow = ({ order }) => {
  const axiosPrivate = useAxiosPrivate();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [isPaid, setIsPaid] = useState(order.isPaid ? "Paid" : "Not Paid");
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(false);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrderStatusChange = async (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    setLoadingOrderStatus(true);

    try {
      await axiosPrivate.patch(`/api/v1/orders/${order._id}/order-status`, {
        status: newStatus,
      });
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.log("Error while updating ordet status: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
      setOrderStatus(order.orderStatus); // Revert if error
    } finally {
      setLoadingOrderStatus(false);
    }
  };

  const handlePaymentStatusChange = async (e) => {
    const newPaymentStatus = e.target.value;
    setIsPaid(newPaymentStatus);
    setLoadingPaymentStatus(true);

    try {
      await axiosPrivate.patch(`/api/v1/orders/${order._id}/payment-status`, {
        isPaid: newPaymentStatus === "Paid",
      });
      toast.success("Payment status updated successfully!");
    } catch (error) {
      console.log("Error while updating payment status: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
      setIsPaid(order.isPaid ? "Paid" : "Not Paid"); // Revert if error
    } finally {
      setLoadingPaymentStatus(false);
    }
  };

  // Get the text color for each order status
  const getOrderStatusTextColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "text-red-600"; // Red for Cancelled
      case "Delivered":
        return "text-green-600"; // Green for Delivered
      case "Pending":
        return "text-yellow-500"; // Yellow for Pending
      case "Processing":
        return "text-blue-500"; // Blue for Processing
      case "Shipped":
        return "text-purple-500"; // Purple for Shipped
      case "Returned":
        return "text-orange-600"; // Orange for Returned
      default:
        return "text-gray-600"; // Default gray for other statuses
    }
  };

  // Get the text color for payment status
  const getPaymentStatusTextColor = (status) => {
    return status === "Paid" ? "text-green-600" : "text-red-600"; // Green for Paid, Red for Not Paid
  };

  const getShortAddress = (location) => {
    let SlitedLocation = location.split(",");
    // SlitedLocation-> [code,area,city,state,country]
    if (SlitedLocation.length <= 4) {
      return `${SlitedLocation[0]},${SlitedLocation[1]}`;
    }
    let indexOfShortAddress = SlitedLocation.length - 4;
    return `${SlitedLocation[indexOfShortAddress]},${
      SlitedLocation[indexOfShortAddress + 1]
    }`;
  };

  const downloadInvoice = async (orderId) => {
    try {
      setDownloadLoading(true);
      const response = await axiosPrivate.get(
        `/api/v1/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${orderId}.pdf`; // The filename for the downloaded PDF
      link.click();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error while fetching invoice: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setDownloadLoading(false);
    }
  };

  const displayInvoice = async (orderId) => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url);

      // Optionally, revoke the object URL to release memory
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error while displaying the invoice:", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <tr className="border border-gray-300">
      <td className="p-2 text-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </td>
      <td className="p-2 text-left">{order.userFullName || order.userMo}</td>
      <td className="p-2 text-left">{order.userMo}</td>
      <td className="p-2 text-left">
         {typeof order?.shippingAddress?.address === "string"
          ? getShortAddress(order.shippingAddress.address)
          : ""}
      </td>
      <td className="p-2 text-left">{formatDate(order.createdAt)}</td>
      <td className="p-2 text-left">{order.orderItems?.length} Items</td>
      <td className="p-2 text-left">₹{order.amount.toFixed(2)}</td>
      <td className="p-2 text-left">
        <select
          id="order-status"
          value={orderStatus}
          onChange={handleOrderStatusChange}
          className={`border border-gray-300 rounded p-2 w-full ${getOrderStatusTextColor(
            orderStatus
          )}`}
          disabled={loadingOrderStatus}
        >
          {loadingOrderStatus ? (
            <option>Loading...</option>
          ) : (
            [
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
              "Returned",
            ].map((status) => (
              <option
                key={status}
                value={status}
                className="p-2" // Padding to make option more readable
              >
                {status}
              </option>
            ))
          )}
        </select>
      </td>
      <td className="p-2 text-left">
        <select
          id="payment-status"
          value={isPaid}
          onChange={handlePaymentStatusChange}
          className={`border border-gray-300 rounded p-2 w-full ${getPaymentStatusTextColor(
            isPaid
          )}`}
          disabled={loadingPaymentStatus}
        >
          {loadingPaymentStatus ? (
            <option>Loading...</option>
          ) : (
            ["Paid", "Not Paid"].map((status) => (
              <option
                key={status}
                value={status}
                className="p-2" // Padding to make option more readable
              >
                {status}
              </option>
            ))
          )}
        </select>
      </td>
      <td className="p-2 flex space-x-2">
        {!downloadLoading ? (
          <button onClick={() => downloadInvoice(order._id)}>
            <Printer size={20} />
          </button>
        ) : (
          <Loader className="animate-spin" size={20} />
        )}
        <button onClick={() => navigate(`/dashboard/orders/${order._id}`)}>
          <ArrowRight color="green" />
        </button>
      </td>
    </tr>
  );
};
