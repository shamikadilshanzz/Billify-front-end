import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import { HomePage } from './pages/home.page.jsx'
import { Routes, Route } from 'react-router'
import SignInPage from './pages/sign-in.page.jsx'
import Dashboard from './pages/dashboard.page.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import SignUpPage from './pages/sign-up.page.jsx'
import ProtecedLayout from './layouts/protected.layout.jsx'
import FAQS from './components/HomePage/FAQS.jsx'
import FAQSPage from './pages/faqs.page.jsx'
import Pricing from './components/HomePage/Pricing.jsx'
import PricePage from './pages/price.page.jsx'
/* 
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDi_YxuzWMCzKCu63X6L3FPay-thB7mdz8",
  authDomain: "billify-7b276.firebaseapp.com",
  projectId: "billify-7b276",
  storageBucket: "billify-7b276.firebasestorage.app",
  messagingSenderId: "1053658518616",
  appId: "1:1053658518616:web:d3a0ae9fbc3767bf75e62d",
  measurementId: "G-4ESLSN69BD"
};


const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

export const saveInvoiceToFirestore = async (invoiceData) => {
  try {
    await addDoc(collection(firestore, "invoices"), invoiceData);
    console.log("Invoice saved successfully!");
  } catch (error) {
    console.error("Error saving invoice:", error);
  }
};
 */
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ layout: { unsafe_disableDevelopmentModeWarnings: true } }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/app/f&q" element={<FAQSPage />} />
          <Route path='/app/pricing' element = {<PricePage/>}/>
          <Route element={<ProtecedLayout />}>
            {/* PASS FIRESTORE SAVE FUNCTION DOWN */}
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)
