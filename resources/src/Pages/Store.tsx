import React from 'react'
import { Card } from '@/components/ui/card'
import { CoinsIcon, MessageCircle, Shield } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'
import SidebarLayout from '@/components/Sidebar/sidebar'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'

import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Store from '@/components/Store/store'
import Dashboard from './Home'

// adjust this prop type to whatever shape your `authUser` really has
interface DashboardProps {
    user: {
        id: string
        name: string
        credits?: number
    }
}

const StorePage: React.FC<DashboardProps> = () => {
    const user = ssr.get('authUser') 

    const client = Http.get('/api/motd')
    const store = Http.get('/api/store')
    
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <SidebarLayout>
                    <div className="flex-1">
                        <main className="p-6">
                            <Header page={"Store"} />
                            <AppAlert/>
                           
                           <Store/>
                        </main>
                    </div>
                </SidebarLayout>
            </div>
        </SidebarProvider>
    )
}

export default StorePage;