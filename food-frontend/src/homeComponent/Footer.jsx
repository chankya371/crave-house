import "../styles/home.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
       

        <p className="footer-tagline">
          Fresh food delivered fast to your doorstep
        </p>

        <div className="footer-socials">
          <a href="/facebook">
            <FaFacebookF />
          </a>

          <a href="/instagram">
            <FaInstagram />
          </a>

          <a href="/twitter">
            <FaTwitter />
          </a>
        </div>

        <div className="footer-bottom">
          © 2026 Crave House. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;