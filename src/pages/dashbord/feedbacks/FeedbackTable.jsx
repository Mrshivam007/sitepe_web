import { TablePagination } from "@/components/common/TablePagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { formatDate } from "@/utility/formateDate";
import { ArrowRight, UserRound } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function FeedbackTable({ feedbacks }) {
  return (
    <div>
      {" "}
      <div className="overflow-x-auto mt-7">
        <table className="min-w-full border-collapse border border-gray-200 bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </th>
              <th className="p-2 text-left border border-gray-300">Date</th>
              <th className="p-2 text-left border border-gray-300">
                Feedback by
              </th>
              <th className="p-2 text-left border border-gray-300">
                Related To
              </th>
              <th className="p-2 text-left border border-gray-300">Status</th>
              <th className="p-2 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => {
              return <TableContentRow feedback={feedback} />;
            })}
          </tbody>
        </table>
      </div>
      <TablePagination />
    </div>
  );
}

// table row content
const TableContentRow = ({ feedback }) => {
  const axiosPrivate = useAxiosPrivate();
  const [feedbackStatus, setFeedbackStatus] = useState(feedback.status);
  const [loadingFeedbackStatus, setLoadingFeedbackStatus] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackStatusChange = async (e) => {
    const newStatus = e.target.value;
    setFeedbackStatus(newStatus);
    setLoadingFeedbackStatus(true);

    try {
      await axiosPrivate.patch(`/api/v1/feedbacks/${feedback._id}`, {
        status: newStatus,
      });
      toast.success("Feedback status updated successfully!");
    } catch (error) {
      toast.error("Failed to update feedback status.");
      setFeedbackStatus(feedback.status); // Revert if error
    } finally {
      setLoadingFeedbackStatus(false);
    }
  };

  // Get the text color for each feedback status
  const getFeedbackStatusTextColor = (status) => {
    "Pending", "Processing", "Complete";
    switch (status) {
      case "Complete":
        return "text-green-600"; // Green for Delivered
      case "Pending":
        return "text-yellow-600"; // Yellow for Pending
      case "Processing":
        return "text-blue-600"; // Blue for Processing
      default:
        return "text-gray-600"; // Default gray for other statuses
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
      <td className="p-2 text-left">
        {formatDate(feedback.createdAt)?.split(",")?.slice(0, -1).join()}
      </td>
      <td className="p-2 text-left">
        {feedback.user.name || feedback.user.mobileNo}
      </td>
      <td className="p-2 text-left">{feedback.type}</td>
      <td className="p-2 text-left">
        <select
          id="feedback-status"
          value={feedbackStatus}
          onChange={handleFeedbackStatusChange}
          className={`border border-gray-300 rounded p-2 w-full ${getFeedbackStatusTextColor(
            feedbackStatus
          )}`}
          disabled={loadingFeedbackStatus}
        >
          {loadingFeedbackStatus ? (
            <option>Loading...</option>
          ) : (
            ["Pending", "Processing", "Complete"].map((status) => (
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
        <button
          onClick={() =>
            navigate(`/dashboard/feedbacks/${feedback._id}`, {
              state: feedback,
            })
          }
          className="px-4 py-1 bg-green-400 text-white rounded hover:bg-green-500"
        >
          <ArrowRight />
        </button>
      </td>
    </tr>
  );
};
