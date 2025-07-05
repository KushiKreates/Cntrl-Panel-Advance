import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Store from '@/components/Store/store'
import ServersList from '@/components/Servers/servers'

// Simplify props if needed
interface StorePageProps {}

const ServerPage: React.FC<StorePageProps> = () => {
    const user = ssr.get('authUser') 
    const client = Http.get('/api/motd')
    const servers = Http.get('/api/servers')
    
   
    
    return (
        <>
           <h2 className="text-6xl font-bold px-2">Your Servers.</h2>
            <p className="px-4 mb-4">Your powerful servers on the internet</p>
            <AppAlert/>
            
            <ServersList />

           
        </>
    )
}

export default ServerPage;