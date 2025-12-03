import React from 'react'
import fo from '../HomePage/Footer.module.css'
export default function Footer() {
  return (
    <div className={fo.main}>
        <div className={fo.first}>
            <div className={fo.oneSe}>
                <h2 className={fo.brand}>Billify</h2>
                <p>Making professional invoicing simple and<br/> accessible for businesses of all sizes.</p>
                <div className={fo.social}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={fo.icon}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={fo.icon}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={fo.icon}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>    
                </div>
            </div>
        </div>
        <div className={fo.second}>
            <div className={fo.twoSe}>
                <h2 className={fo.head}>PRODUCT</h2>
                <h3 className={fo.sub}>Features</h3>
                <h3 className={fo.sub}>Pricing</h3>
                <h3 className={fo.sub}>Templates</h3>
                <h3 className={fo.sub}>Integrations</h3>
            </div>
            <div className={fo.threeSe}>
                <h2 className={fo.head}>SUPPORT</h2>
                <h3 className={fo.sub}>Help Center</h3>
                <h3 className={fo.sub}>Documentations</h3>
                <h3 className={fo.sub}>Tutorials</h3>
                <h3 className={fo.sub}>Contact</h3>
            </div>
            <div className={fo.fourSe}>
                <h2 className={fo.head}>COMPANY</h2>
                <h3 className={fo.sub}>About</h3>
                <h3 className={fo.sub}>Blog</h3>
                <h3 className={fo.sub}>Careers</h3>
                <h3 className={fo.sub}>Press</h3>
            </div>
            <div className={fo.fiveSe}>
                <h2 className={fo.head}>LEGAL</h2>
                <h3 className={fo.sub}>Pricacy</h3>
                <h3 className={fo.sub}>Teams</h3>
                <h3 className={fo.sub}>Cookie Policy</h3>
                <h3 className={fo.sub}>GPDR</h3>
            </div>
        </div>
        
    </div>
  )
}
