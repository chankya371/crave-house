import { FaFire, FaBolt, FaCrown } from "react-icons/fa";
import "../styles/home.css";

function WhyChoose() {
  return (
    <section className="why">
      <div className="why-header">
        <p className="why-tag">🔥 Why Crave House?</p>

        <h2>
          Why Food Lovers Choose <span>Crave House</span>
        </h2>

        <p className="why-subtitle">
          From flame-grilled flavors to lightning-fast delivery, we bring
          unforgettable food experiences right to your doorstep.
        </p>
      </div>

      <div className="why-cards">
        <div className="why-card">
          <div className="why-icon">
            <FaFire />
          </div>
          <h3>Flame-Grilled Freshness</h3>
          <p>
            Every burger, pizza, and snack is prepared hot, fresh, and packed
            with irresistible flavor.
          </p>
        </div>

        <div className="why-card featured">
          <div className="why-icon">
            <FaBolt />
          </div>
          <h3>Lightning Fast Delivery</h3>
          <p>
            Hungry? We deliver your favorites in record time while keeping every
            bite hot and delicious.
          </p>
        </div>

        <div className="why-card">
          <div className="why-icon">
            <FaCrown />
          </div>
          <h3>Trusted by Foodies</h3>
          <p>
            Thousands of happy customers choose Crave House for quality, taste,
            and premium food service.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;