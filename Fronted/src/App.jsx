import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import NewArrivals from "./Components/user/NewArrivals";
import RecentlyViews from "./Components/user/RecentlyViews";
import Details from "./Components/user/Details";
import Contact from "./Components/user/Contact";
import Carts from "./Components/user/Carts";
import Login from "./Components/user/login";
import Signup from "./Components/user/Signup";
import Nav from "./Components/user/Nav";
import Home from "./Components/user/Home";
import Footer from "./Components/user/Footer";
import Category from "./Components/user/Category";
import AdminUser from "./Components/admin/AdminUser";
import AdminDashboard from "./Components/admin/AdminDashboard";
import AdminProduct from "./Components/admin/AdminProduct";
import AdminOrder from "./Components/admin/AdminOrder";
import AdminCategory from "./Components/admin/AdminCategory";
import AdminProductRating from "./Components/admin/AdminProductRating";
import AdminMessage from "./Components/admin/AdminMessage";
import AdminRoute from "./Components/admin/Adminroute";
import { ProductsProvider } from "./Components/user/ProductContext";
import { AuthProvider } from "./Components/context/AuthContext";
import { CartProvider } from "./Components/context/CartContext";
import ProductDetails from "./Components/user/ProductDetails";
import AdminLayout from "./Components/admin/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollIndicator from "./Components/user/ScrollSmoth";
import Reveal from "./Components/user/Reveal";
// Layout for user pages
function UserLayout({ children }) {
  return (
    <>
      <ScrollIndicator />  

      <Nav />
      {children}
      <Footer />
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Routes>
            {/* User Routes */}
            <Route
              path="/"
              element={
<UserLayout>
  <Reveal>
    <Home />
  </Reveal>

  <Reveal delay={0.2}>
    <div id="new-arrival">
      <NewArrivals />
    </div>
  </Reveal>

  <Reveal delay={0.5}>
    <RecentlyViews />
  </Reveal>

  <Reveal delay={0.5}>
    <div id="category">
      <Category />
    </div>
  </Reveal>

  <Reveal delay={0.5}>
    <div id="contact">
    <Contact />
    </div>
  </Reveal>
</UserLayout>              }
            />

            <Route
              path="/details/:id"
              element={
                <UserLayout>
                  <Details />
                </UserLayout>
              }
            />

            <Route
              path="/productDetails/:id"
              element={
                <UserLayout>
                  <ProductDetails />
                </UserLayout>
              }
            />

            <Route
              path="/carts"
              element={
                <UserLayout>
                  <Carts />
                </UserLayout>
              }
            />

            <Route
              path="/login"
              element={
                <UserLayout>
                  <Login />
                </UserLayout>
              }
            />

            <Route
              path="/signup"
              element={
                <UserLayout>
                  <Signup />
                </UserLayout>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminUser />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminProduct />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminOrder />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminCategory />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/message"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminMessage />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/product-ratings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminProductRating />
                  </AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
