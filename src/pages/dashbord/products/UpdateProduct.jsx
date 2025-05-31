import FormHeader from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getAllSubCategories,
  getAllUnit,
  updateBasicDetailOfProduct,
} from "@/api/ApiRoutes";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";

export default function UpdateProduct({ productForUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    life: "",
    tags: [],
    subCategory: "",
    isActive: false,
  });
  const [image, setImage] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    if (productForUpdate && productForUpdate.product) {
      setFormData({
        title: productForUpdate.product.title,
        description: productForUpdate.product.description,
        life: productForUpdate.product.life,
        tags: productForUpdate.product.tags,
        subCategory: productForUpdate.product.subCategory._id,
        isActive: productForUpdate.product.isActive,
      });
    }
    (async () => {
      const subCategoriesResponse = await axiosPrivate.get(
        "/api/v1/subcategories"
      );
      if (subCategoriesResponse.data.success) {
        setSubCategories(subCategoriesResponse.data.data);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      const newTag = value.trim();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      e.target.value = "";
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsLoading(true);
    // Prepare form data to send
    const data = new FormData();

    // Use Object.keys to append all form data
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        // Send tags as a JSON string
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append("productImage", image); // Append image

    try {
      const response = await axiosPrivate.patch(
        `/api/v1/products/${productForUpdate.product._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error while creating product: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title, Slug, SubCategory */}
        <div className="mb-4 lg:flex lg:space-x-4">
          <div className="lg:w-1/3">
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="eg.Fresh Red Tomato"
              value={formData.title}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div className="lg:w-1/3">
            <label className="block text-sm font-medium mb-1" htmlFor="slug">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={formData.title.replaceAll(" ", "-").toLowerCase()}
              placeholder="eg.fresh-red-tomato"
              className="border cursor-not-allowed border-gray-300 rounded p-2 w-full bg-gray-100"
              disabled
            />
          </div>

          <div className="lg:w-1/3">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="subCategory"
            >
              SubCategory
            </label>
            <select
              id="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">Select subCategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description, Image */}
        <div className="mb-4 lg:flex lg:space-x-4">
          <div className="lg:w-1/2">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="eg. this very fresh tomato"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
            ></textarea>
          </div>

          <div className="lg:w-1/2">
            <label className="block text-sm font-medium mb-1" htmlFor="image">
              Image (optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        </div>

        {/* IsActive, Life, Tags */}
        <div className="mb-4 lg:flex lg:space-x-4 items-end w-full">
          <div className="lg:w-1/4">
            <label className="block text-sm font-medium mb-1" htmlFor="life">
              Life (Expire)
            </label>
            <input
              type="text"
              id="life"
              placeholder="eg. 1 Year,3 Month.."
              value={formData.life}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          <div className="lg:w-1/4">
            <label className="block text-sm font-medium mb-1" htmlFor="tags">
              Tags (Press Enter to Add)
            </label>
            <input
              type="text"
              id="tags"
              placeholder="Enter tags and press Enter"
              onKeyDown={handleTagInputChange} // Handle Enter to add tags
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          <div className="flex items-center lg:w-1/4">
            <input
              type="checkbox"
              className="mr-2"
              id="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <label className="text-sm font-medium" htmlFor="isActive">
              Active
            </label>
          </div>
        </div>

        {/* Display Tags */}
        <div className="mb-2">
          {formData.tags.length > 0 && (
            <div>
              <span className="text-sm font-medium">Tags:</span>
              <div className="flex flex-wrap mt-1">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)} // Remove tag on click
                      className="ml-2 text-red-600"
                    >
                      &times; {/* Close icon */}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {!isLoading ? (
          <Button type="submit">Update</Button>
        ) : (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
      </form>
    </div>
  );
}
