import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import UserDash from '../components/Dashnoard/UserDash'
import Navigation from '../components/Navigation/Navigation'
import Footer from '../components/HomePage/Footer'
import { getInvoiceById } from '../services/invoiceService'
import { useUser } from '@clerk/clerk-react'
import styles from './history.module.css';

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()
  const [invoiceData, setInvoiceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const invoiceId = searchParams.get('edit')

  useEffect(() => {
    if (invoiceId && isLoaded && user) {
      loadInvoice()
    }
  }, [invoiceId, isLoaded, user])

  const loadInvoice = async () => {
    try {
      setLoading(true)
      const invoice = await getInvoiceById(invoiceId)
      
      if (invoice.userId !== user.id) {
        alert('You do not have permission to edit this invoice.')
        navigate('/dashboard')
        return
      }
      
      setInvoiceData(invoice)
    } catch (error) {
      console.error('Error loading invoice:', error)
      alert('Failed to load invoice. Please try again.')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveComplete = () => {
    navigate('/history')
  }

  if (loading) {
    return (
      <>
        <Navigation/>
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading invoice...</div>
        <br></br>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation/>
      <UserDash 
        invoiceId={invoiceId}
        invoiceData={invoiceData}
        onSaveComplete={handleSaveComplete}
      /><br></br>
      <Footer className={styles.footer}/>
    </>
  )
}
