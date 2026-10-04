import React from "react";
import { getAdminOrders } from "@/app/actions/adminOrders";
import OrdersManagerClient from "./OrdersManagerClient";

export const metadata = {
  title: "Admin - Orders & Consignments | Chattogram Tech Store",
  description: "Manage incoming customer orders, dispatch status, and fulfillment slips.",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <OrdersManagerClient initialOrders={orders} />;
}
