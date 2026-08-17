import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ProductsContext } from "./ProductContext";
import { getCategories } from "../../libs/api";
import "./style/HomePremium.css";

function HeroSection({ onExplore }) {
  return (
    <section className="relative w-full bg-[#17231C] rounded-b-3xl overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80"
          alt="Cinematic fashion editorial"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[85vh] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-6 sm:mb-8">
            CHIN HERITAGE • MODERN DESIGN
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 sm:mb-8">
            Tradition,
            <br />
            Woven Into
            <br />
            Modern Style.
          </h1>

          <p className="text-white/75 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Discover contemporary fashion inspired by the craftsmanship, stories, and heritage of Chin culture.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onExplore}
              className="px-7 py-3.5 bg-[#173D2B] text-white rounded-full font-medium text-sm sm:text-base hover:bg-[#315C45] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
            >
              Explore Collection →
            </button>
            <button
              onClick={onExplore}
              className="px-7 py-3.5 bg-transparent border border-white/25 text-white rounded-full font-medium text-sm sm:text-base hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Our Heritage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscoveryBar({ onExplore }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg shadow-black/5 border border-gray-100 p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-[#173D2B] tracking-[0.15em] uppercase mb-1">
              Pattern / Style
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#F4F9F4] border border-gray-200 rounded-lg text-[#17231C] text-sm placeholder:text-white focus:outline-none focus:border-[#173D2B] focus:ring-2 focus:ring-[#173D2B]/10 transition-all"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-[#173D2B] tracking-[0.15em] uppercase mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#F4F9F4] border border-gray-200 rounded-lg text-[#17231C] text-sm placeholder:text-white focus:outline-none focus:border-[#173D2B] focus:ring-2 focus:ring-[#173D2B]/10 transition-all"
            />
          </div>

          <button
            onClick={onExplore}
            className="w-full md:w-auto px-5 py-2 bg-[#173D2B] text-white rounded-lg font-medium text-sm hover:bg-[#315C45] transition-all duration-300 whitespace-nowrap shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/15 hover:-translate-y-0.5"
          >
            Search Collection →
          </button>
        </div>
      </div>
    </div>
  );
}

function HeritageSection({ onExplore }) {
  return (
    <section id="heritage" className="pt-16 sm:pt-18 md:pt-20 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                alt="Artisan hand-weaving cloth on a wooden loom"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg border border-gray-100">
                <span className="text-[11px] sm:text-xs font-bold text-[#173D2B] tracking-[0.1em] uppercase">
                  Handmade & Ethical
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-xl lg:max-w-none">
            <span className="text-[11px] sm:text-xs font-bold text-[#173D2B] tracking-[0.2em] uppercase mb-4 sm:mb-5 block">
              OUR HERITAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#17231C] leading-[1.15] mb-6 sm:mb-8">
              Preserving Culture Through Modern Fashion
            </h2>
            <div className="space-y-4 sm:space-y-5">
              <p className="text-gray-600 text-base sm:text-lg leading-[1.8]">
                Traditional Chin weaving carries patterns that were once used to identify village, clan, and status. Today, those same motifs are being reimagined for contemporary wardrobes—without losing the stories embedded in each thread.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-[1.8]">
                From backstrap looms in the highlands to modern atelier cuts, the craft stays connected to its origins. Every garment keeps the maker's hand visible: slight shifts in tension, natural dye variations, and the irregularities that distinguish handmade work from machine production.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-[#173D2B] font-semibold text-sm sm:text-base border-b-2 border-[#173D2B] pb-1 hover:gap-3 hover:border-[#315C45] hover:text-[#315C45] transition-all duration-300"
            >
              Discover Our Heritage →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ title, description, image, category, categoryName, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer ${className || ""}`}
      onClick={handleClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-4 sm:p-5">
        <span className="text-[11px] font-bold text-[#173D2B] tracking-[0.08em] uppercase">
          {category}
        </span>
        <h3 className="font-serif text-[18px] sm:text-[20px] text-[#17231C] mt-1.5 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-[13px] leading-[1.5] mb-4 line-clamp-2">
          {description}
        </p>
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-[#173D2B] font-medium text-sm group hover:gap-2.5 transition-all duration-300"
        >
          <span>Explore Collection</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

function FeaturedCollections() {
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

  const displayedCategories = categories.slice(0, 3);

  const getCategoryImage = (categoryName) => {
    const normalized = categoryName.toLowerCase().trim();
    const product = products.find((p) => {
      const name = (p.categoryId?.name || "").toLowerCase().trim();
      return name === normalized && p.imageUrl?.[0];
    });
    if (product?.imageUrl?.[0]) return product.imageUrl[0];

    const fallbacks = {
      "shawls":
        "https://images.unsplash.com/photo-1601924634867-3a4c5c3d5a1e?auto=format&fit=crop&w=600&q=80",
      "jackets":
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
      "accessories":
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80",
      "chin traditional clothing":
        "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80",
      default:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    };

    return fallbacks[normalized] || fallbacks.default;
  };

  if (error) {
    return (
      <section className="py-10 sm:py-12 md:py-14 bg-[#F4F9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#173D2B] text-white rounded-full text-sm font-medium hover:bg-[#315C45] transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-14 bg-[#F4F9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold text-[#173D2B] tracking-[0.2em] uppercase mb-3 block">
              CURATED COLLECTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#17231C] leading-[1.15] mb-3">
              Featured Cultural Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl animate-pulse"
                style={{ minHeight: 320 }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-10 sm:py-12 md:py-14 bg-[#F4F9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">No collections available yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-10 sm:py-12 md:py-14 bg-[#F4F9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold text-[#173D2B] tracking-[0.2em] uppercase mb-3 block">
            CURATED COLLECTIONS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#17231C] leading-[1.15] mb-3">
            Featured Cultural Collections
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Discover contemporary fashion inspired by Chin heritage, craftsmanship, and traditional textile patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 featured-collections-grid">
          {displayedCategories.map((cat) => (
            <CollectionCard
              key={cat._id}
              title={cat.name}
              category={cat.name.toUpperCase()}
              description={
                cat.description ||
                `Explore our ${cat.name} collection.`
              }
              image={getCategoryImage(cat.name)}
              categoryName={cat.name}
              className="featured-collection-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePremium() {
  const navigate = useNavigate();

  const exploreMore = () => {
    navigate("/shop");
  };

  return (
    <div className="bg-[#F4F9F4] min-h-screen overflow-x-hidden">
      <HeroSection onExplore={exploreMore} />
      <div className="relative z-20 -mt-10 sm:-mt-12 md:-mt-14">
        <DiscoveryBar onExplore={exploreMore} />
      </div>
      <div className="-mt-2 sm:-mt-3 md:-mt-4" />
      <HeritageSection onExplore={exploreMore} />
      <FeaturedCollections />
    </div>
  );
}
