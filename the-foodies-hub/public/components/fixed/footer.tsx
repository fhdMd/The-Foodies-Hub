import React from "react";
import Facebook from "./images/facebook.png";
import Instagram from "./images/instagram.png";
import Twitter from "./images/x.png";
import LinkedIn from "./images/linkedin.png";
import Image from "next/image";
import Link from "next/link";
import "./footer.css";

const Links = () => {
  const Links = ["About us", "Socials"];
  return (
    <div className="footer-links">
      {Links.map((link) => (
        <Link href="#" className="albert-sans-regular" key={link}>
          {link}
        </Link>
      ))}
    </div>
  );
};

const Socials = () => {
  const socials = [LinkedIn, Instagram, Facebook, Twitter];
  return (
    <div className="social">
      <div className="ghost">
        {socials.map((social, index) => (
          <Link href={`#`} key={index}>
            <Image key={index} src={social} alt={social + ""} />
          </Link>
        ))}
      </div>
      <div className="socials">
        {socials.map((social, index) => (
          <a href="#" key={index}>
            <Image key={index} src={social} alt={social + ""} />
          </a>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer>
      <div className="footer-bar">
        <Links />
        <Socials />
      </div>
    </footer>
  );
};

export default Footer;
