import { HeroGrid } from "../components/HomePage/Herogrid"
import Navigation from "../components/Navigation/Navigation"

import "../App.css"
import Powerful from "../components/HomePage/Powerful"
import Reviews from "../components/HomePage/Reviews"
import FAQS from "../components/HomePage/FAQS"
import Footer from "../components/HomePage/Footer"
const HomePage = () => {
    return(
        <div>
            <Navigation/>
            <HeroGrid/>
            <Powerful/>
            <Reviews/>
            <FAQS/>
            <Footer/>
        </div>
    )
}
export {HomePage}