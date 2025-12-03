import { Link } from "react-router"
import na from "../Navigation/Navigation.module.css"
import { useRef } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
const Navigation = ()=> {
    const mobileNavRef = useRef(null);

    function openSideBar(){
        if(mobileNavRef.current){
            mobileNavRef.current.style.display = "grid"
        }
    }
    function closeSideBar(){
        if(mobileNavRef.current){
            mobileNavRef.current.style.display = "none"
        }
    }
    return(
        <div className={na.main}>
            <header className={na.navbar}>
                <Link>
                    <img src="public/brand.png" className={na.brand}></img>
                </Link>
                <nav className={na.category}>
                    {[
                        {path:"/", label: "Home"},
                        {path:"app/features", label: "Features"},
                        {path:"app/testimonials", label: "Testimonials"},
                        {path:"app/pricing", label: "Pricing"},
                        {path:"app/f&q", label: "F&Q"},
                    ].map((item) => {
                        return <Link  to={item.path} className={na.item}>{item.label}</Link>
                    })}
                </nav>
                <div className={na.signO}>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                    <SignedOut>    
                        <Link to='sign-in' className={na.signin}>SignIn</Link>
                        <Link to='sign-up' className={na.getStarted}>SignUp</Link>
                    </SignedOut>
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2" 
                    stroke-linecap="round" stroke-linejoin="round" 
                    className={na.menu} onClick={openSideBar}>
                    <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
                    </svg>
                </div>
            </header>
            <header className={na.navbarMobile} ref={mobileNavRef}>
                <div>
                    <img src="public/Brand-Img/brand.png" className={na.brandMobile}></img>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" 
                        fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" 
                        stroke-linejoin="round" className={na.close} onClick={closeSideBar}>
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <nav className={na.categoryMobile}>
                    {[
                        {path:"/", label: "Home"},
                        {path:"app/features", label: "Features"},
                        {path:"app/testimonials", label: "Testimonials"},
                        {path:"app/pricing", label: "Pricing"},
                        {path:"app/f&q", label: "F&Q"},
                    ].map((item) => {
                        return <Link  to={item.path} className={na.itemMobile}>{item.label}</Link>
                    })}
                </nav>
                <div className={na.signOMobile}>
                    
                    <SignedOut>
                        <Link to='/sign-in' className={na.signinMobile}>SignIn</Link>
                        <Link to='/sign-up' className={na.getStartedMobile}>SignUp</Link>
                    </SignedOut>
                    
                </div>
            </header>
            
        </div>
        
    )
}

export default Navigation;

