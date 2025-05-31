import { TablePagination } from "@/components/common/TablePagination";
import UpdateSheet from "@/components/common/UpdateSheet";
import React, { useEffect, useRef, useState } from "react";
import UpdateProduct from "./UpdateProduct";
import { getAllProduct } from "@/api/ApiRoutes";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productForUpdate, setProductForUpdate] = useState({
    isOpen: false,
    product: null,
  });
  const axiosPrivate = useAxiosPrivate();
  const btnRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/products");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.log("Error while fetching products: ", error);
        const { message } = getErrorMessage(error);
        toast.error(message);
      }
    })();
  }, []);

  return (
    <div>
      <UpdateSheet btnRef={btnRef} title="Update Product Basic Details">
        {productForUpdate.isOpen && (
          <UpdateProduct btnRef={btnRef} productForUpdate={productForUpdate} />
        )}
      </UpdateSheet>
      <div className="overflow-x-auto mt-7">
        <table className="w-full border-collapse border border-gray-200 bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </th>
              <th className="p-2 text-left border border-gray-300">
                Product Name
              </th>
              <th className="p-2 text-left border border-gray-300">Image</th>
              <th className="p-2 text-left border border-gray-300">
                Sub Category
              </th>
              <th className="p-2 text-left border border-gray-300">Schemes</th>
              <th className="p-2 text-left border border-gray-300">Tags</th>
              <th className="p-2 text-left border border-gray-300">Life</th>
              <th className="p-2 text-left border border-gray-300">Active</th>
              <th className="p-2 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr className="border border-gray-300">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="p-2 text-left">{product.title}</td>
                  <td className="p-2 text-left">
                    <Avatar>
                      <AvatarImage src={product.imageUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-2 text-left">{product.subCategory.title}</td>
                  <td className="p-2 text-left">
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={product.schemes?.length ?? "Schemes"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {product.schemes.map((scheme) => {
                          return (
                            <SelectItem value={scheme.qty}>
                              {scheme.qty}
                              {scheme.unit} ₹{scheme.price}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2 text-left">
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={product.tags?.length ?? "Tags"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {product.tags.map((tag) => {
                          return <SelectItem value={tag}>{tag}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2 text-left">{product.life}</td>
                  <td className="p-2 text-left">
                    {product.isActive ? "Yes" : "No"}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setProductForUpdate({
                          isOpen: true,
                          product: product,
                        });
                        if (btnRef.current) {
                          console.log("click btn1", btnRef);
                          btnRef.current.click();
                        }
                      }}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        navigate(
                          `/dashboard/products/${product.slug}/schemes`,
                          { state: product }
                        );
                      }}
                      className="px-4 py-1 bg-green-400 text-white rounded hover:bg-green-500"
                    >
                      <ArrowRight />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TablePagination />
    </div>
  );
}
