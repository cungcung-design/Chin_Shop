import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const exploreMore = () => {
    const section = document.getElementById("category");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/shop");
    }
  };

  return (
    <section className="home">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1600&q=80"
            alt="Chin Traditional Weaving & Fashion"
            className="home-hero__image"
          />
          <div className="home-hero__overlay" />
        </div>

        <div className="home-hero__content">
          <span className="home-hero__eyebrow">CHIN HERITAGE • MODERN DESIGN</span>
          <h1 className="home-hero__title">Tradition, Woven Into Modern Style.</h1>
          <p className="home-hero__text">
            Discover contemporary fashion inspired by the craftsmanship, stories, and heritage of Chin culture.
          </p>
          <div className="home-hero__actions">
            <button
              className="home-hero__cta-primary"
              onClick={exploreMore}
            >
              Explore Collection →
            </button>
            <button className="home-hero__cta-secondary">
              Our Heritage
            </button>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="home-hero__search">
          <div className="home-hero__search-inner">
            <div className="home-hero__search-field">
              <label className="home-hero__search-label">Pattern / Style</label>
              <input
                type="text"
                placeholder="e.g., Lawmh, Zah cing"
                className="home-hero__search-input"
              />
            </div>
            <div className="home-hero__search-field">
              <label className="home-hero__search-label">Category</label>
              <input
                type="text"
                placeholder="Shawls, Jackets, Dresses"
                className="home-hero__search-input"
              />
            </div>
            <button className="home-hero__search-btn" onClick={exploreMore}>
              Search Collection →
            </button>
          </div>
        </div>
      </section>

      {/* Cultural Story Section */}
      <section className="home-story">
        <div className="home-story__inner">
          <div className="home-story__image-wrap">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
              alt="Artisan hand-weaving cloth on a wooden loom"
              className="home-story__image"
            />
            <div className="home-story__badge">
              <span className="home-story__badge-label">Handmade & Ethical</span>
            </div>
          </div>
          <div className="home-story__content">
            <span className="home-story__eyebrow">OUR HERITAGE</span>
            <h2 className="home-story__title">Preserving Culture Through Modern Fashion</h2>
            <p className="home-story__text">
              Traditional Chin weaving carries patterns that were once used to identify village, clan, and status. Today, those same motifs are being reimagined for contemporary wardrobes—without losing the stories embedded in each thread.
            </p>
            <p className="home-story__text">
              From backstrap looms in the highlands to modern atelier cuts, the craft stays connected to its origins. Every garment keeps the maker’s hand visible: slight shifts in tension, natural dye variations, and the irregularities that distinguish handmade work from machine production.
            </p>
            <button className="home-story__cta" onClick={exploreMore}>
              Discover Our Heritage →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="home-collections">
        <div className="home-collections__inner">
          <div className="home-collections__header">
            <span className="home-collections__eyebrow">CURATED COLLECTIONS</span>
            <h2 className="home-collections__title">Featured Cultural Collections</h2>
            <p className="home-collections__text">
              Discover contemporary fashion inspired by Chin heritage, craftsmanship, and traditional textile patterns.
            </p>
          </div>

          <div className="home-collections__grid">
            {/* Card 1 */}
            <div className="home-collection-card" onClick={exploreMore}>
              <div className="home-collection-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                  alt="Handwoven Shawls"
                  className="home-collection-card__image"
                />
              </div>
              <div className="home-collection-card__body">
                <span className="home-collection-card__tag">Handwoven Shawls</span>
                <h3 className="home-collection-card__name">Handwoven Shawls</h3>
                <p className="home-collection-card__desc">
                  Traditional weaving techniques presented through elegant contemporary designs.
                </p>
                <button className="home-collection-card__btn">
                  Explore Collection →
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="home-collection-card" onClick={exploreMore}>
              <div className="home-collection-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Fusion Wear"
                  className="home-collection-card__image"
                />
              </div>
              <div className="home-collection-card__body">
                <span className="home-collection-card__tag">Modern Fusion Wear</span>
                <h3 className="home-collection-card__name">Modern Fusion Wear</h3>
                <p className="home-collection-card__desc">
                  Contemporary silhouettes combined with distinctive Chin-inspired patterns.
                </p>
                <button className="home-collection-card__btn">
                  Explore Collection →
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="home-collection-card" onClick={exploreMore}>
              <div className="home-collection-card__image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
                  alt="Cultural Accessories"
                  className="home-collection-card__image"
                />
              </div>
              <div className="home-collection-card__body">
                <span className="home-collection-card__tag">Cultural Accessories</span>
                <h3 className="home-collection-card__name">Cultural Accessories</h3>
                <p className="home-collection-card__desc">
                  Carefully crafted accessories inspired by traditional Chin textiles and motifs.
                </p>
                <button className="home-collection-card__btn">
                  Explore Collection →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Home;
