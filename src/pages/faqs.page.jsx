import Navigation from "../components/Navigation/Navigation";
import FAQS from "../components/HomePage/FAQS";
import Footer from "../components/HomePage/Footer";
import faqs from "./faqs-page.module.css";
export default function FAQSPage() {
  return (
    <div className={faqs.faqsn}>
      <Navigation />
      <FAQS />
      <Footer className={faqs.footer}/>
    </div>
  );
}