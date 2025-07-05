import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Motd from '@/components/Motd/motd'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Links from '@/components/Links/links'
import ServersList from '@/components/Servers/servers'

// Simplify props if needed
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
    const user = ssr.get('authUser') 
    const app = ssr.get('App')
    const client = Http.get('/api/motd')
    
    return (
        <>
            <Header page="Dashboard" />
            <AppAlert/>
            
               
                    <Motd />
                    <div className="md:mb-28">
                        <h2 className="text-6xl font-bold px-2">Your Servers.</h2>
                        <p className="px-4 mb-4">Your powerful servers on the internet</p>
                        <ServersList />
                    </div>
               
            
            <>
            <h2 className="text-6xl font-bold px-2">Useful Links</h2>
            <p className="px-3 mb-4">Here are some useful links to help you navigate the application.</p>
                <Links/>


            </>
        </>
    )
}

export default Dashboard