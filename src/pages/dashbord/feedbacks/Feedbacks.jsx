import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePen, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import FeedbackTable from "./FeedbackTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await axiosPrivate("/api/v1/feedbacks");
        setFeedbacks(response.data.data);
        console.log(response);
      } catch (error) {
        console.log("Error while fetching feedbacks: ", error);
      }
    }
    fetchFeedbacks();
  }, []);

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="Feedbacks"
        LinkTitle="Add Feedback"
        href="/dashboard/feedbacks/new"
      />

      <div className="rounded-lg mt-3 shadow-lg flex space-x-3 bg-slate-100 dark:bg-slate-700 p-6 dark:text-slate-50 text-slate-900">
        <select
          id="feedback-type"
          //   value={formData.unit}
          //   onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 w-full"
        >
          <option value="">Select type</option>
          {["Application", "Product", "Service"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          id="feedback-status"
          //   value={formData.unit}
          //   onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 w-full"
        >
          <option value="">Select status</option>
          {["Pending", "Processing", "Complete"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <Button variant="" className="w-2/6 bg-green-600">
          <Filter size={20} className="mr-2" />
          Filter
        </Button>
      </div>
      {/* Table data */}
      <FeedbackTable feedbacks={feedbacks} />
    </div>
  );
}
