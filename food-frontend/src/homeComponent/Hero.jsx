import "../styles/home.css";
import foodImage from "../assets/login.png";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      {/* LEFT */}
      <div className="hero-left">
        <p className="hero-tag">🔥 Crave House Special</p>

        <h1>
          Ignite Your <span>Cravings</span>
          <br />
          With Every Bite 🍔
        </h1>

        <p className="hero-subtitle">
          Flame-grilled burgers, cheesy pizzas, crispy fries, and refreshing
          drinks — delivered hot & fresh to your doorstep.
        </p>

        <div className="hero-buttons">
          <button
            className="order-btn"
            onClick={() => navigate("/categories")}
          >
            Order Now
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/categories")}
          >
            Explore Menu
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Hot Meals</p>
          </div>

          <div className="stat-card">
            <h3>10K+</h3>
            <p>Happy Foodies</p>
          </div>

          <div className="stat-card">
            <h3>25 Min</h3>
            <p>Fast Delivery</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        <div className="hero-glow"></div>
        <img src={foodImage} alt="Crave House Food" className="hero-food" />
      </div>
    </section>
  );
}

export default Hero;