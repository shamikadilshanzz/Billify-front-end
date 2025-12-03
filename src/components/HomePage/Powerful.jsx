import React from 'react'
import po from '../HomePage/Powerful.module.css'

export default function Poweful() {
  return (
    <div className={po.main}>
      <div className={po.one}>
        <h2 className={po.title}>Everything you need to<br/> invoice like a pro</h2>
        <p className={po.subT}>Three core features that make invoicing simple and reliable.<br/>Built for those who mean business.</p>
      </div>
      <div className={po.two}>
          <div className={po.obj}>
            <h3 className={po.inT}>Quick Invoice Generation</h3>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round" className={po.svgI}>
            <path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/>
            <path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/>
            <path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>
            </svg>
            <p className={po.descript}>Create a complete invoice in under<br/> a minute with our streamlined iterface</p>
          </div>
          <div className={po.obj}>
            <h3 className={po.inT}>Customizable templates</h3>
            <svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round" className={po.svgI}>
            <path d="M2 12h20"/><path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/>
            <path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"/>
            <path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"/>
            <path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1"/>
            </svg>
            <p className={po.descript}>Design invoices that match your brand with flexible templates and personal touches.</p>
          </div>
          <div className={po.obj}>
            <h3 className={po.inT}>Secure cloud storage</h3>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round" className ={po.svgI}><ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
            </svg>
            <p className={po.descript}>Your invoices are safe and accessible anywhere, anytime, with enterprise-grade security.</p>
          </div>
      </div>
    </div>
  )
}
