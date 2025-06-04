import React, { useState, useEffect } from "react";
import { formatDate } from "@/utility/formateDate";
import { ArrowRight, Loader, Printer } from "lucide-react";
import { toast } from "react-toastify";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getErrorMessage } from "@/utility/getErrorMessage";
import { TablePagination } from "@/components/common/TablePagination";

export default function UserTable({ users }) {
    console.log("table->",users);
  return (
    <div>
      <table className="w-full border-collapse border border-gray-200 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </th>
            <th className="p-2 text-left border border-gray-300">Customer</th>
            <th className="p-2 text-left border border-gray-300">Mobile No</th>
            <th className="p-2 text-left border border-gray-300">Active</th>
            <th className="p-2 text-left border border-gray-300">Items</th>
            <th className="p-2 text-left border border-gray-300">Role</th>
            <th className="p-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <TableContentRow key={user._id} user={user} />
          ))}
        </tbody>
      </table>
      <TablePagination />
    </div>
  );
}
const TableContentRow = ({ user }) => {
  const axiosPrivate = useAxiosPrivate();
  const [userRole, setUserRole] = useState(user.role);
  const [loadingRoleUpdate, setLoadingRoleUpdate] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setUserRole(newRole);
    setLoadingRoleUpdate(true);

    try {
      await axiosPrivate.patch(`/api/v1/users/${user._id}/role`, {
        role: newRole,
      });
      toast.success("User role updated successfully!");
    } catch (error) {
      console.log("Error while updating user role: ", error);
      const { message } = getErrorMessage(error);
      toast.error(message);
      setUserRole(user.role); // revert back if failed
    } finally {
      setLoadingRoleUpdate(false);
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
      <td className="p-2 text-left">{user.name || user.mobileNo}</td>
      <td className="p-2 text-left">{user.mobileNo}</td>
      <td className="p-2 text-left">{user.isActive ? "Yes" : "No"}</td>
      <td className="p-2 text-left">{user.items?.length || 0}</td>
      <td className="p-2 text-left">
        <select
          value={userRole}
          onChange={handleRoleChange}
          className="border border-gray-300 rounded p-2 w-full"
          disabled={loadingRoleUpdate}
        >
          {loadingRoleUpdate ? (
            <option>Loading...</option>
          ) : (
            ["Customer", "DeliveryPartner","Admin"].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))
          )}
        </select>
      </td>
      <td className="p-2 flex space-x-2">
        <button onClick={() => navigate(`/dashboard/users/${user._id}`)}>
          <ArrowRight color="green" />
        </button>
      </td>
    </tr>
  );
};
