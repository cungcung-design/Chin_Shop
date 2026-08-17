import React, { useEffect, useState } from "react";
import { getAdminDashboard, getAdminOrders } from "../../libs/api";

export default function DashboardRight() {
  const [stats, setStats] = useState(null);
  const [itemsSold, setItemsSold] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // /api/admin/dashboard returns { users, products, categories, orders }
        // in a single request. Orders are still needed for the money figures,
        // which the dashboard endpoint doesn't aggregate.
        const [dashboard, orders] = await Promise.all([
          getAdminDashboard(),
          getAdminOrders(),
        ]);

        setStats(dashboard);

        setItemsSold(
          orders.reduce(
            (sum, order) =>
              sum +
              (order.items || []).reduce(
                (itemSum, item) => itemSum + (item.quantity || 1),
                0
              ),
            0
          )
        );

        // Use the totals the backend already calculated and stored.
        setRevenue(orders.reduce((sum, o) => sum + (o.totalPay || 0), 0));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    if (loading) {
      return (
        <div className="dashboard-right row g-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={i}>
              <div className="card stat-card-skeleton" />
            </div>
          ))}
        </div>
      );
    }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: `${stats.users} Users`, cls: "card-gradient-1" },
    {
      label: "Total Products",
      value: `${stats.products} Products`,
      cls: "card-gradient-4",
    },
    { label: "Total Orders", value: `${stats.orders} Orders`, cls: "card-gradient-5" },
    { label: "Items Sold", value: `${itemsSold} Items`, cls: "card-gradient-2" },
    {
      label: "Revenue",
      value: `$${revenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      cls: "card-gradient-3",
    },
    {
      label: "Categories",
      value: `${stats.categories} Categories`,
      cls: "card-gradient-6",
    },
  ];

  return (
    <div className="dashboard-right row g-3">
      {cards.map((c) => (
        <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={c.label}>
          <div className={`card ${c.cls}`}>
            <h3>{c.label}</h3>
            <p>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
