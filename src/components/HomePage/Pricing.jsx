import pr from '../HomePage/Pricing.module.css'
const Pricing = () => {
    return(
        <main className={pr.pricing}>
            <div className={pr.first}>
                <h1 className={pr.titleNam}>Pricing Plan</h1>
                <p className={pr.slogan}>Choose the plan that's right for you</p>
            </div>
            <br></br>
            <div className={pr.pricingContainer}>
                <div className={pr.firstPlan}>
                    <h2 className={pr.title}>Free</h2>
                    <p className={pr.sub}>Best for projects that are under construction.</p>
                    <div className={pr.price}>
                        <h2 className={pr.currency}>$</h2>
                        <h2 className={pr.value}>0</h2>
                        <h2 className={pr.forWhat}>/month</h2>
                    </div>
                    <button className={pr.btn}>Try for Free</button>
                    <div className={pr.great}>
                        <h2 className={pr.greatNa}>Great for</h2>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round" 
                        className={pr.lucArrow}><path d="M18 8L22 12L18 16"/>
                        <path d="M2 12H22"/>
                        </svg>
                    </div>
                    <p className={pr.greatPara}>Projects that are under constructions.</p>
                    <h2 className={pr.itemCat}>Free plan features</h2>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Create unlimited single-page invoices</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Download PNG of invoice</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Basic invoice template library (3 templates)</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Email sending (up to 5 invoices/month)</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Community support</p>
                    </div>
                </div>
                <div className={pr.secondPlan}>
                    <h2 className={pr.title2}>Popular</h2>
                    <p className={pr.sub2}>For freelancers and small teams who invoice regularly.</p>
                    <div className={pr.price2}>
                        <h2 className={pr.currency2}>$</h2>
                        <h2 className={pr.value2}>30</h2>
                        <h2 className={pr.forWhat2}>/month</h2>
                    </div>
                    <button className={pr.btn2}>Get Started</button>
                    <div className={pr.great2}>
                        <h2 className={pr.greatNa2}>Great for</h2>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round" 
                        className={pr.lucArrow2}><path d="M18 8L22 12L18 16"/>
                        <path d="M2 12H22"/>
                        </svg>
                    </div>
                    <p className={pr.greatPara2}>Projects that are under constructions.</p>
                    <h2 className={pr.itemCat2}>Free plan features</h2>
                    <div className={pr.char2}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#000000" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt2}>Create unlimited single-page invoices</p>
                    </div>
                    <div className={pr.char2}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#000000" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt2}>Download PNG of invoice</p>
                    </div>
                    <div className={pr.char2}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#000000" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt2}>Basic invoice template library (3 templates)</p>
                    </div>
                    <div className={pr.char2}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#000000" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt2}>Email sending (up to 5 invoices/month)</p>
                    </div>
                    <div className={pr.char2}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#000000" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt2}>Community support</p>
                    </div>
                </div>
                <div className={pr.firstPlan}>
                    <h2 className={pr.title}>Pro</h2>
                    <p className={pr.sub}>Best for projects that are under construction.</p>
                    <div className={pr.price}>
                        <h2 className={pr.currency}>$</h2>
                        <h2 className={pr.value}>99</h2>
                        <h2 className={pr.forWhat}>/month</h2>
                    </div>
                    <button className={pr.btn}>Try for Free</button>
                    <div className={pr.great}>
                        <h2 className={pr.greatNa}>Great for</h2>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round" 
                        className={pr.lucArrow}><path d="M18 8L22 12L18 16"/>
                        <path d="M2 12H22"/>
                        </svg>
                    </div>
                    <p className={pr.greatPara}>Projects that are under constructions.</p>
                    <h2 className={pr.itemCat}>Free plan features</h2>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Unlimited invoices & downloads (PDF)</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Custom branding (logo & colors)</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Recurring invoices & automatic reminders</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Invoice templates (50+) + template editor</p>
                    </div>
                    <div className={pr.char}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" 
                        viewBox="0 0 15 15"><path fill="#A700ED" 
                        fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z" 
                        clip-rule="evenodd"/>
                        </svg>
                        <p className={pr.charIt}>Priority email support</p>
                    </div>
                </div>
            </div>
            <div className="third"></div>
        </main>
    )
}
export default Pricing;