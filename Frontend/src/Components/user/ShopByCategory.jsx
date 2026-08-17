import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsContext } from "./ProductContext";
import { getCategories } from "../../libs/api";
import MediaImage from "../common/MediaImage";
import "./style/ShopByCategory.css";

const CATEGORY_FALLBACK_IMAGES = {
  "chin traditional clothing":
    "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80",
  "shawls":
    "https://images.unsplash.com/photo-1601924634867-3a4c5c3d5a1e?auto=format&fit=crop&w=600&q=80",
  "jackets":
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
  "accessories":
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80",
  default:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
};

function CategoryCard({ title, category, description, image, cta, isFeatured }) {
  const navigate = useNavigate();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate(`/shop?category=${encodeURIComponent(title)}`);
      }}
      className={`category-card ${isFeatured ? "category-card--featured" : "category-card--side"}`}
    >
      <div className={`category-card__image-wrap ${isFeatured ? "category-card__image-wrap--featured" : "category-card__image-wrap--side"}`}>
        <MediaImage
          src={image}
          alt={title}
          className="category-card__image"
          loading="lazy"
          fallback={CATEGORY_FALLBACK_IMAGES.default}
        />
        <div className="category-card__overlay" />
      </div>
      <div className="category-card__content">
        <span className="category-card__label">{category}</span>
        <h3 className="category-card__title">{title}</h3>
        {description && (
          <p className="category-card__desc">{description}</p>
        )}
        <span className="category-card__cta">
          {cta}
          <span className="category-card__cta-arrow">→</span>
        </span>
      </div>
    </a>
  );
}

export default function ShopByCategory() {
  const { products } = useContext(ProductsContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err.message || "Failed to load categories.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const getCategoryImage = (categoryName) => {
    const normalized = categoryName.toLowerCase().trim();
    const product = products.find((p) => {
      const name = (p.categoryId?.name || "").toLowerCase().trim();
      return name === normalized && p.imageUrl?.[0];
    });
    if (product?.imageUrl?.[0]) return product.imageUrl[0];

    const fallback =
      CATEGORY_FALLBACK_IMAGES[normalized] || CATEGORY_FALLBACK_IMAGES.default;
    return fallback;
  };

  const getCategoryProductCount = (categoryName) => {
    const normalized = categoryName.toLowerCase().trim();
    return products.filter((p) => {
      const name = (p.categoryId?.name || "").toLowerCase().trim();
      return name === normalized;
    }).length;
  };

  const buildCardData = (cat) => {
    const image = getCategoryImage(cat.name);
    const count = getCategoryProductCount(cat.name);
    return {
      id: cat._id,
      title: cat.name,
      category: cat.name.toUpperCase(),
      description:
        count > 0
          ? `${count} piece${count !== 1 ? "s" : ""} available`
          : "Discover unique pieces in this collection.",
      image,
      cta: count > 0 ? "Explore Collection →" : "Explore →",
    };
  };

  if (error) {
    return (
      <section className="shop-by-category-section">
        <div className="shop-by-category-inner">
          <div className="shop-by-category-header">
            <span className="shop-by-category-eyebrow">SHOP BY CATEGORY</span>
            <p className="shop-by-category-subtitle">Discover your style through heritage</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#173D2B] text-white rounded-full text-sm font-medium hover:bg-[#315C45] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="shop-by-category-section">
        <div className="shop-by-category-inner">
          <div className="shop-by-category-header">
            <span className="shop-by-category-eyebrow">SHOP BY CATEGORY</span>
            <p className="shop-by-category-subtitle">Discover your style through heritage</p>
          </div>
          <div className="shop-by-category-grid">
            <div className="shop-by-category-col--featured">
              <div className="category-card category-card--featured" style={{ background: "#E8DDC8", minHeight: 360 }} />
            </div>
            <div className="shop-by-category-col--side">
              <div className="category-card category-card--side" style={{ background: "#E8DDC8", minHeight: 220 }} />
              <div className="category-card category-card--side" style={{ background: "#E8DDC8", minHeight: 220 }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="shop-by-category-section">
        <div className="shop-by-category-inner">
          <div className="shop-by-category-header">
            <span className="shop-by-category-eyebrow">SHOP BY CATEGORY</span>
            <p className="shop-by-category-subtitle">Discover your style through heritage</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available yet. Check back soon.</p>
          </div>
        </div>
      </section>
    );
  }

  const featured = buildCardData(categories[0]);
  const sideCategories = categories.slice(1, 3).map(buildCardData);

  return (
    <section className="shop-by-category-section">
      <div className="shop-by-category-inner">
        {/* Header */}
        <div className="shop-by-category-header">
          <span className="shop-by-category-eyebrow">SHOP BY CATEGORY</span>
          <p className="shop-by-category-subtitle">Discover your style through heritage</p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="shop-by-category-grid">
          {/* Left: Featured Category */}
          <div className="shop-by-category-col--featured">
            <CategoryCard key={featured.id} {...featured} isFeatured />
          </div>

          {/* Right: Side Categories */}
          <div className="shop-by-category-col--side">
            {sideCategories.map((cat) => (
              <CategoryCard key={cat.id} {...cat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
