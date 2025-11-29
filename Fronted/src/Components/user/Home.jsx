import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Home.css";
import ScrollFloat from "./ScrollFloat";
import ShinyText from "./ShinyText";
import Reveal from "./Reveal";

function Home() {
  return (
    <Reveal>
    <section>

      <div className="container-fluid">
        <div className="row">
          <section className="home">
            <div className="text-container">
              <h1 className="text-center">
                <ShinyText
                  text="Elevate Your style with"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </h1>
              <h1 className="text-center text-2">
                <ShinyText
                  text="Chin Fashion"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </h1>
            
            </div>

            <div className="card-container">
              <div className="d-flex flex-column align-items-center">
                <div className="card-1">
                  <div className="image-box">
                    <img src="/uploads/img1.png" alt="Bag" />
                  </div>
                </div>
                <div className="card-2">
                  <img src="/uploads/img14.png" alt="Bag" />
                </div>
              </div>

              <div className="card-3">
                <img src="/uploads/img2.png" alt="Bag" />
              </div>

              <div className="d-flex-column mid-card-container">
                <div className="card-4">
                  <img src="/uploads/img13.png" alt="Bag" />
                </div>
                <button
                  className="btn-custom glow-on-hover glow-btn"
                  onClick={() =>
                    document
                      .getElementById("category")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore More
                </button>
              </div>

              <div className="card-5">
                <img src="/uploads/img9.png" alt="Bag" />
              </div>

              <div className="d-flex flex-column align-items-center">
                <div className="card-6">
                  <img src="/uploads/img6.png" alt="Bag" />
                </div>
                <div className="card-7">
                  <img src="/uploads/img12.png" alt="Bag" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
       
    </section>
    </Reveal>
  );
}

export default Home;
