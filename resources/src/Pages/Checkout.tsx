import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Motd from '@/components/Motd/motd'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Links from '@/components/Links/links'
import Checkout from '@/components/Checkout/checkout'

// Simplify props if needed
interface DashboardProps {}

const CheckoutPage: React.FC<DashboardProps> = () => {
    const user = ssr.get('authUser') 
    const app = ssr.get('App')
    const client = Http.get('/api/motd')
    //@ts-ignore
   
    
    return (
        <>
            
         
            
               
            
            <>
            <h2 className="text-6xl mt-2 font-bold px-2">Checkout</h2>
            <p className="px-4 mb-4">Complete Your Purchase Online.</p>
                <Checkout />
            </>
        </>
    )
}

export default CheckoutPage;