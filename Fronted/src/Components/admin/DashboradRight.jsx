import React, { useEffect, useState } from "react";
import {
  getUsers,
  getAllOrdersAdmin,
  getRevenue,
  getFeedbacks,
  getProducts,
} from "../../libs/api";

export default function DashboardRight() {
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setUsersCount(users.length);

        const products = await getProducts();
        setTotalProducts(products.length);

        const orders = await getAllOrdersAdmin();
        setOrdersCount(orders.length);

        // Calculate total items sold across all orders
        const totalItems = orders.reduce((sum, order) => {
          return (
            sum +
            order.items.reduce(
              (itemSum, item) => itemSum + (item.quantity || 1),
              0
            )
          );
        }, 0);
        setTotalItemsSold(totalItems);

        const totalRevenue = await getRevenue();
        setRevenue(totalRevenue);

        const feedbacks = await getFeedbacks();
        setFeedbackCount(feedbacks.length);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-right row g-3">
      <div className="col-md-3">
        <div className="card card-gradient-1">
          <h3>Total Users</h3>
          <p>{usersCount} Users</p>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card card-gradient-4">
          <h3>Total Products</h3>
          <p>{totalProducts} Products</p>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card card-gradient-2">
          <h3>Items Sold</h3>
          <p>{totalItemsSold} Items</p>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card card-gradient-3">
          <h3>Revenue</h3>
          <p>${revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
