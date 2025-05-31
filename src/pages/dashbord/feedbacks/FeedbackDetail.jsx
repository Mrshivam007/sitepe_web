import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import FormHeader from "@/components/common/FormHeader";
import { useLocation, useParams } from "react-router-dom";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utility/getErrorMessage";

const FeedbackDetail = ({}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const [feedback, setFeedback] = useState(location.state);
  const [status, setStatus] = useState("Complete"); // Manage status
  const axiosPrivate = useAxiosPrivate();
  const { feedbackId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          `/api/v1/feedbacks/${feedbackId}`
        );
        setFeedback(response.data.data);
      } catch (error) {
        console.log("Error while fetching feedback: ", error);
        const { message } = getErrorMessage(error);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
    // call fetch feedback if feedback not come from location.state
    if (!location.state) {
      fetchFeedback();
    }
  }, []);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  if (!isLoading && !feedback) {
    return <p className="text-center">feedback not found</p>;
  }
  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div>
      <FormHeader title={"Feedback Details"} />
      {/* Feedback Details Card */}
      <div className="relative w-full mx-auto mt-5 bg-slate-50 shadow-lg rounded-lg overflow-hidden">
        {/* Delete Icon */}
        <div className="absolute top-3 right-3">
          <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg">
            <Trash size={18} />
          </button>
        </div>

        {/* User Information */}
        <div className="p-6 border-b">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span> {feedback.user.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span>{" "}
              {feedback.user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Mobile No:</span>{" "}
              {feedback.user.mobileNo}
            </p>
          </div>
        </div>

        {/* Feedback Content */}
        <div className="p-6">
          <p className="text-gray-800 mb-4">
            <span className="font-semibold">Type:</span> {feedback.type}
          </p>
          <div className="text-gray-800 mb-4">
            <label className="font-semibold mr-2" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="border rounded px-2 py-1"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <p className="text-gray-800 mb-4">
            <span className="font-semibold">Feedback:</span> {feedback.text}
          </p>

          {/* Image Gallery */}
          {feedback.imageUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Images:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {feedback.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Feedback Image ${index + 1}`}
                    className="cursor-pointer rounded-lg hover:opacity-90"
                    onClick={() => openImageModal(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <img
            src={selectedImage}
            alt="Full Screen"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackDetail;
