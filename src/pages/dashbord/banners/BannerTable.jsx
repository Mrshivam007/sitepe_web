import { getAllBanner } from "@/api/ApiRoutes";
import { TablePagination } from "@/components/common/TablePagination";
import UpdateSheet from "@/components/common/UpdateSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import UpdateBanner from "./UpdateBanner";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { getErrorMessage } from "@/utility/getErrorMessage";

export default function BannerTable() {
  const [banners, setBanners] = useState([]);
  const [bannerForUpdate, setBannerForUpdate] = useState({
    isOpen: false,
    banner: null,
  });
  const axiosPrivate = useAxiosPrivate();
  const btnRef = useRef(null);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/banners");
        console.log(response);
        setBanners(response.data.data);
      } catch (error) {
        const { message } = getErrorMessage(error);
        toast.error(message);
      }
    })();
  }, []);
  return (
    <div>
      <UpdateSheet btnRef={btnRef} title="Update Banner">
        {bannerForUpdate.isOpen && (
          <UpdateBanner btnRef={btnRef} bannerForUpdate={bannerForUpdate} />
        )}
      </UpdateSheet>
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
              <th className="p-2 text-left border border-gray-300">Title</th>
              <th className="p-2 text-left border border-gray-300">Image</th>
              <th className="p-2 text-left border border-gray-300">discount</th>
              <th className="p-2 text-left border border-gray-300">Active</th>
              <th className="p-2 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => {
              return (
                <tr key={banner._id} className="border border-gray-300">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="p-2 text-left">{banner.title}</td>
                  <td className="p-2 text-left">
                    <Avatar>
                      <AvatarImage src={banner.imageUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-2 text-left">{banner.discount}</td>
                  <td className="p-2 text-left">
                    {banner.isActive ? "Yes" : "Not"}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setBannerForUpdate({
                          isOpen: true,
                          banner: banner,
                        });
                        console.log(btnRef);
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
