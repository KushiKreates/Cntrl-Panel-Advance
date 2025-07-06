import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Store from '@/components/Store/store'
import ServersList from '@/components/Servers/servers'
import Tickets from '@/components/Ticket/tickets'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import TicketView from '@/components/Ticket/view'

// Simplify props if needed
interface StorePageProps {}

const TicketViewPage: React.FC<StorePageProps> = () => {
    const user = ssr.get('authUser') 
    //@ts-ignore
    /**
     * Tansstack's route getting thing is ass.
     */
    const pathSegments = window.location.pathname.split('/');
    const ticketId = pathSegments[pathSegments.length - 1] || 'No Ticket ID';

   
    const { data, isLoading, error } = useQuery({
      queryKey: ['ticket', ticketId],
      queryFn: () => Http.get(`/api/tickets/${ticketId}`)
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error loading ticket.</div>
    }

    console.log(data)
    


    

    
   
    
    return (
        <>
           <h2 className="text-6xl font-bold px-2">Ticket - {ticketId}</h2>
            <p className="px-4 mb-4">Your in ticket {ticketId}, you can contiue the conversation.</p>
            <AppAlert/>

            <TicketView ticket={data.data.ticket} />
           
            
            

           
        </>
    )
}

export default TicketViewPage;