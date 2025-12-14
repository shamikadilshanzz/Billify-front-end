import { HeroGrid } from "../components/HomePage/Herogrid"
import Navigation from "../components/Navigation/Navigation"

import "../App.css"
import Powerful from "../components/HomePage/Powerful"
import Reviews from "../components/HomePage/Reviews"
import FAQS from "../components/HomePage/FAQS"
import Footer from "../components/HomePage/Footer"
import styles from './history.module.css';
import MyCalendar from "../components/HomePage/MyCalender"
const HomePage = () => {
    return(
        <div>
            <Navigation/>
            <HeroGrid/>
            <Powerful/>
            <Reviews/>
            <FAQS/>
            <MyCalendar/>
            <Footer className={styles.footer}/>
            
            
        </div>
    )
}
export {HomePage}