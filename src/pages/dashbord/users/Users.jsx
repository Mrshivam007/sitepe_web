import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePen, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async () => {
      try {
        console.log("User loading started...");
        const response = await axiosPrivate.get("/api/v1/users");
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.log("Error while fetching users: ", error);
        toast.error("Failed to fetch users.");
      }
    })();
  }, []);

  const handleFilter = () => {
    const lowercasedFilter = filterText.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(lowercasedFilter) ||
      user.mobileNo?.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="Users"
        LinkTitle="Add User"
        href="/dashboard/users/new"
      />

      {/* Filter Section */}
      <div className="rounded-lg mt-3 shadow-lg flex space-x-3 bg-slate-100 dark:bg-slate-700 p-6 dark:text-slate-50 text-slate-900">
        <Input
          placeholder="Filter by name or mobile"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <Button onClick={handleFilter} className="w-2/6 bg-green-600">
          <Filter size={20} className="mr-2" />
          Filter
        </Button>
        <Button disabled className="w-2/6">
          <FilePen size={20} className="mr-2" />
          Bulk Action
        </Button>
      </div>

      {/* Table */}
      <UserTable users={filteredUsers} />
    </div>
  );
}
