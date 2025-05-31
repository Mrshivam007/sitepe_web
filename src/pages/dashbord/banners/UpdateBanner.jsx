import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateBannerById, updateCategoryById } from "@/api/ApiRoutes";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";

export default function UpdateBanner({ bannerForUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    isActive: true,
    bannerImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const { banner } = bannerForUpdate;
    console.log(banner);
    setFormData({
      title: banner.title,
      discount: banner.discount,
      isActive: banner.isActive,
      bannerImage: banner.imageUrl,
    });
  }, [bannerForUpdate]);

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
    const data = new FormData();
    // Append form data to FormData object
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    try {
      const response = await axiosPrivate.patch(
        `/api/v1/banners/${bannerForUpdate.banner._id}`,
        data, // Use the FormData object instead of formData
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error while updating banner: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <label className="block text-sm font-medium mb-1" htmlFor="discount">
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
        <label className="block text-sm font-medium mb-1" htmlFor="bannerImage">
          Banner Image(optinal)
        </label>
        <input
          type="file"
          id="bannerImage"
          name="bannerImage"
          onChange={handleChange}
          accept="image/*"
          className="border border-gray-300 rounded w-full"
        />
      </div>
      {/* Conditionally render image preview */}
      {formData.bannerImage && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Image Preview:</p>
          <img
            src={
              typeof formData.bannerImage === "string"
                ? formData.bannerImage
                : formData.bannerImage &&
                  URL.createObjectURL(formData.bannerImage)
            } // Create preview from bannerImage local path
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
  );
}
