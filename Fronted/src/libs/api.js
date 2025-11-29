const API_URL = "http://localhost:5000/api";

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ===================== AUTH =====================
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login failed: ${errorText}`);
  }
  return res.json();
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Registration failed: ${errorText}`);
  }
  return res.json();
};

// ===================== USERS =====================
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const createUser = async (userData) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

export const updateUser = async (id, userData) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update user: ${errorText}`);
  }
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

// ===================== CATEGORIES =====================
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const getCategoryById = async (id) => {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
};

export const createCategory = async (data) => {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

export const updateCategory = async (id, data) => {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};

// ===================== PRODUCTS =====================
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

export const clearProductRatingsComments = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}/ratings-comments`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to clear ratings and comments");
  return res.json();
};
export const deleteComment = async (productId, commentId) => {
  const res = await fetch(
    `${API_URL}/products/${productId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
};

// Rate product
export const rateProduct = async (id, rating, comment) => {
  // Get user ID from token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch (err) {
      console.error("Failed to decode token for userId", err);
    }
  }

  const res = await fetch(`${API_URL}/products/${id}/rate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating, comment, userId }),
  });
  if (!res.ok) throw new Error("Failed to rate product");
  return res.json();
};

// ===================== CART =====================
export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCart = async (
  productId,
  quantity = 1,
  color = "",
  size = ""
) => {
  const res = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity, color, size }),
  });
  if (!res.ok) throw new Error("Failed to add product to cart");
  return res.json();
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await fetch(`${API_URL}/cart/update/${itemId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
};

export const removeCartItem = async (itemId) => {
  const res = await fetch(`${API_URL}/cart/remove/${itemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  return res.json();
};

// ===================== ORDERS =====================
export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const getUserOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch user orders");
  return res.json();
};

export const getOrderById = async (id) => {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

export const getAllOrdersAdmin = async () => {
  const res = await fetch(`${API_URL}/orders/admin/all`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch admin orders");
  return res.json();
};

export const updateOrderStatusAdmin = async (orderId, status) => {
  const res = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
};

export const deleteOrderAdmin = async (orderId) => {
  const res = await fetch(`${API_URL}/orders/admin/${orderId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
};
// Orders
export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// Revenue (total sum of orders)
export const getRevenue = async () => {
  const orders = await getAllOrdersAdmin();
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.totalPay || 0);
  }, 0);

  return totalRevenue;
};

export const getFeedbacks = async () => {
  const res = await fetch(`${API_URL}/feedbacks`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch feedbacks");
  return res.json();
};

// ===================== CONTACT =====================
export const sendContactMessage = async (contactData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  if (!res.ok) throw new Error("Failed to send contact message");
  return res.json();
};

export const getAllMessages = async () => {
  const res = await fetch(`${API_URL}/contact`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export const deleteMessage = async (id) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete message");
  return res.json();
};

export const updateMessageStatus = async (id, body) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update message status");
  return res.json();
};
