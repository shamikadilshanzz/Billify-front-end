import Pricing from "../components/HomePage/Pricing";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/HomePage/Footer";
import styles from './history.module.css';
const PricePage = () => {
    return(
        <div>
            <Navigation/>
            <Pricing/>
            <Footer className={styles.footer}/>
        </div>
    )
}

export default PricePage;