import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Store from '@/components/Store/store'
import ServersList from '@/components/Servers/servers'
import Tickets from '@/components/Ticket/tickets'

// Simplify props if needed
interface StorePageProps {}

const TicketPage: React.FC<StorePageProps> = () => {
    const user = ssr.get('authUser') 
    

    
   
    
    return (
        <>
           <h2 className="text-6xl font-bold px-2">Tickets</h2>
            <p className="px-4 mb-4">Browse and Create Tickets</p>
            <AppAlert/>
            <Tickets />
            
            

           
        </>
    )
}

export default TicketPage;