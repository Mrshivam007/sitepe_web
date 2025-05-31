import { host } from "@/api/ApiRoutes";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { getErrorMessage } from "@/utility/getErrorMessage";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UpdateScheme from "./UpdateScheme";
import UpdateSheet from "@/components/common/UpdateSheet";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

const Schemes = () => {
  const { productSlug } = useParams();
  const location = useLocation();
  const [productLoading, setProductLoading] = useState(false);
  const [product, setProduct] = useState(location.state);
  const btnRef = useRef(null);
  const [schemeForUpdate, setSchemeForUpdate] = useState({
    isOpen: false,
    scheme: null,
  });
const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    // get product by slug from server
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
        console.log("Error while fetching product: ", error);
        const { message } = getErrorMessage(error);
        toast.error(message);
      } finally {
        setProductLoading(false);
      }
    })();
  }, []);

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
  return (
    <div>
      <UpdateSheet btnRef={btnRef} title="Update Product Scheme">
        {schemeForUpdate.isOpen && (
          <UpdateScheme product={product} schemeForUpdate={schemeForUpdate} />
        )}
      </UpdateSheet>
      <PageHeader
        heading="Schemes"
        LinkTitle="Add Scheme"
        href={`/dashboard/products/${product.slug}/schemes/new`}
        data={product}
      />
      <div className="max-w-7xl mx-auto p-6 bg-slate-50  rounded-lg shadow-lg">
        {/* Product Card */}
        <ProductCard product={product} />

        {/* Schemes Section */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Available Schemes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.schemes.map((scheme, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Qty: {scheme.qty} {scheme.unit}
                </h3>
                <span className="text-sm text-gray-500">
                  {scheme.timeToDeliver}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{scheme.message}</p>
              <div className="flex justify-between items-center my-2">
                <span className="text-green-600 font-bold">
                  ₹{scheme.price}
                </span>
                <span className="text-sm text-red-500">
                  {scheme.offerPercent ? `${scheme.offerPercent}% off` : ""}
                </span>
              </div>
              <p
                className={`text-sm ${
                  scheme.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {scheme.inStock ? "In Stock" : "Out of Stock"}
              </p>

              {/* Scheme Images Carousel */}
              <div className="grid grid-cols-5 gap-1 mt-2">
                {scheme.imageUrls.slice(0, 5).map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`Scheme Image ${imgIndex + 1}`}
                    className="h-16 w-16 object-cover rounded-md" // No border class
                  />
                ))}
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex mt-4 justify-between">
                <button
                  onClick={() => {
                    setSchemeForUpdate({
                      isOpen: true,
                      scheme: scheme,
                    });
                    if (btnRef.current) {
                      console.log("click btn1", btnRef);
                      btnRef.current.click();
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700 font-medium transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schemes;
