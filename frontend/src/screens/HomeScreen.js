import React from "react";
import Header from "./../components/Header";
import ShopSection from "./../components/homeComponents/ShopSection";
import ContactInfo from "./../components/homeComponents/ContactInfo";
import Footer from "./../components/Footer";
import Chatbot from "../components/homeComponents/ChatBot";

const HomeScreen = () => {
  window.scrollTo(0, 0);

  return (
    <div>
      <Header />
      <ShopSection/>
      <ContactInfo />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default HomeScreen;
