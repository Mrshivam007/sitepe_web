import { getAllUnit, host } from "@/api/ApiRoutes";
import FormHeader from "@/components/common/FormHeader";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const NewScheme = () => {
  const [formData, setFormData] = useState({
    qty: 0,
    unit: "",
    message: "",
    offerPercent: 0,
    inStock: true,
    price: 0,
    priorityToShow: true,
    timeToDeliver: "",
  });
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const { productSlug } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state);
  const [units, setUnits] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // get product by slug from server
    if (!product) {
      (async () => {
        try {
          // axios call
          setProductLoading(true);
          const response = await axiosPrivate.get(
            `/api/v1/products/productbyslug/${productSlug}`
          );
          if (response.data.success) {
            setProduct(response.data.data);
          }
        } catch (error) {
          console.log("Error while fetching product by slug: ", error);
          const { message } = getErrorMessage(error);
          toast.error(message);
        } finally {
          setProductLoading(false);
        }
      })();
    }
  }, []);

  //fetch units
  (async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/units");
      if (response.data.success) {
        setUnits(response.data.data);
      }
    } catch (error) {
      console.log("Error while fetching units: ", error);
    }
  })();
  if (!productLoading && !product) {
    return (
      <div className="mt-7">
        <h3 className="text-center">Product not found</h3>
      </div>
    );
  }
  if (productLoading) {
    return (
      <div className="mt-7">
        <h3 className="text-center">Loading...</h3>
      </div>
    );
  }
  // handle change for all field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle image change
  const handleImageChange = (e) => {
    if (images.length >= 5) {
      toast.info("only 5 image can upload for a scheme");
      return;
    }
    const files = Array.from(e.target.files);

    files.slice(0, 5).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImages((prevImages) => [...prevImages, loadEvent.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...files].slice(0, 5)); // Add files to selectedFiles state
  };

  // image delete
  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // submiting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    // Append image files to formdata object
    selectedFiles.forEach((file) => data.append("productImages", file));
    // Append form data to FormData object
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axiosPrivate.patch(
        `/api/v1/products/${product._id}/addscheme`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          qty: 0,
          unit: "",
          message: "",
          offerPercent: 0,
          inStock: true,
          price: 0,
          priorityToShow: true,
          timeToDeliver: "",
        });
        setImages([]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Error while creating scheme: ", error);
      const { message, code } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <FormHeader title="New Scheme" />
      <div className="max-w-7xl mt-5 mx-auto p-6 bg-slate-50 rounded-lg shadow-lg">
        <ProductCard product={product} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Quantity Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                min={1}
              />
            </div>

            {/* Unit Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1" htmlFor="unit">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Message</label>
              <input
                type="text"
                name="message"
                placeholder="eg. 3 items in 1 packet or (charger+ear phone free)"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Offer Percentage Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Offer Percentage
              </label>
              <input
                type="number"
                name="offerPercent"
                value={formData.offerPercent}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* In Stock Checkbox */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                In Stock
              </label>
            </div>

            {/* Price Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                min={0}
              />
            </div>

            {/* Priority to Show Checkbox */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                <input
                  type="checkbox"
                  name="priorityToShow"
                  checked={formData.priorityToShow}
                  onChange={handleChange}
                  className="mr-2"
                />
                Priority to Show
              </label>
            </div>

            {/* Time to Deliver Field */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Time to Deliver
              </label>
              <input
                type="text"
                name="timeToDeliver"
                placeholder="eg. 1 MIN ,1 Hr ,1 Day"
                value={formData.timeToDeliver}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Scheme Images Section */}
          <label className="block text-sm font-medium mb-1">Images</label>
          <div className="flex items-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="mr-2 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex space-x-2 mb-4">
            {images.map(
              (image, index) =>
                image && (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={image}
                      alt={`Scheme Image ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleImageDelete(index)}
                      className="text-red-600 hover:text-red-800 text-xs mt-1"
                    >
                      Delete
                    </button>
                  </div>
                )
            )}
          </div>

          {/* Submit Button */}
          {!isLoading ? (
            <Button type="submit">Create</Button>
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
};

export default NewScheme;
