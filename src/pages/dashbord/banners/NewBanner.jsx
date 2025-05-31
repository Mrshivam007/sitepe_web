import { createBanner } from "@/api/ApiRoutes";
import FormHeader from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function NewBanner() {
  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    isActive: true,
    bannerImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, bannerImage: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Append form data to FormData object
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axiosPrivate.post("/api/v1/banners", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          discount: "",
          isActive: true,
          bannerImage: null,
        });
      }
    } catch (error) {
      console.error("Error while creating banners: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <FormHeader title="New Banner" />
      <div className="w-full mt-5 mb-5 mx-auto p-5 bg-slate-50 rounded-md shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter banner title"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="discount"
            >
              Discount
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter discount percentage"
              min={0}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="bannerImage"
            >
              Banner Image
            </label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              onChange={handleChange}
              accept="image/*"
              required
              className="border border-gray-300 rounded w-full"
            />
          </div>
          {/* Conditionally render image preview */}
          {formData.bannerImage && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Image Preview:</p>
              <img
                src={URL.createObjectURL(formData.bannerImage)} // Create preview from bannerImage local path
                alt="Banner Preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium" htmlFor="isActive">
              Is Active?
            </label>
          </div>

          {!isLoading ? (
            <Button type="submit">Create Banner</Button>
          ) : (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
