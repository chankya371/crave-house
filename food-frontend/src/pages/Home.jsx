
import Hero from "../homeComponent/Hero";
import WhyChoose from "../homeComponent/WhyChoose";
import FoodList from "../homeComponent/FoodList";
import Footer from "../homeComponent/Footer";
import PopularCategories from "../homeComponent/PopularCategories";

function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <PopularCategories />
      <FoodList />
      <Footer />
    </>
  );
}

export default Home;