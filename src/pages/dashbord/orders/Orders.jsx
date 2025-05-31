import { Input } from "@/components/ui/input";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Orders() {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Filter Orders</AccordionTrigger>
          <AccordionContent>
            <div className="rounded-lg mt-3 shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-100 dark:bg-slate-700 p-3 dark:text-slate-50 text-slate-900">
              <div className="flex flex-col">
                <label
                  htmlFor="start-date"
                  className="text-slate-700 dark:text-slate-200"
                >
                  Start Date
                </label>
                <input
                  className="border border-gray-300 rounded p-2 w-full bg-white dark:bg-slate-600 dark:text-slate-50 focus:outline-none focus:ring focus:ring-blue-300"
                  type="date"
                  id="start-date"
                  placeholder="Start date"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="start-date"
                  className="text-slate-700 dark:text-slate-200"
                >
                  End Date
                </label>
                <input
                  className="border border-gray-300 rounded p-2 w-full bg-white dark:bg-slate-600 dark:text-slate-50 focus:outline-none focus:ring focus:ring-blue-300"
                  type="date"
                  id="start-date"
                  placeholder="Start date"
                />
              </div>

              <input
                className="border border-gray-300 rounded p-2 w-full"
                type="text"
                name=""
                id=""
                placeholder="User Id"
              />
              <input
                className="border border-gray-300 rounded p-2 w-full"
                type="text"
                name=""
                id=""
                placeholder="Order Id"
              />
              <select
                id="order-status"
                // value={orderStatus}
                // onChange={handleOrderStatusChange}
                className={`border border-gray-300 rounded p-2 w-full`}
              >
                <option value="">Select Order Status</option>
                {[
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                  "Returned",
                ].map((status) => (
                  <option key={status} value={status} className="p-2">
                    {status}
                  </option>
                ))}
              </select>
              <select
                id="payment-status"
                // value={orderStatus}
                // onChange={handleOrderStatusChange}
                className={`border border-gray-300 rounded p-2 w-full`}
              >
                <option value="">Select Payment Status</option>
                {["Paid", "Not Paid"].map((status) => (
                  <option key={status} value={status} className="p-2">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
