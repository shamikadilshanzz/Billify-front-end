import hero from '../HomePage/Herogrid.module.css'
import { Button } from '../../ui/Button';
import { Link } from 'react-router';
const HeroGrid = ()=> {
    return(
        <div className={hero.main}>
            <div className={hero.left}>
                <h2 className={hero.head}>Create Professional</h2>
                <h3 className={hero.second}>invoices in seconds</h3>
                <p className={hero.para}>Streamline your billing process with our intuitive invoice<br></br> generator. Create, send, and track professional <br/>invoices effortlessly</p>
                <br></br>
                <Link to={'dashboard'} className={hero.getStarted}>Get Started</Link>
            </div>
            <div>
                <img src='public\home3.png' className={hero.home1}></img>
            </div>
        </div>
    )
}
export {HeroGrid};