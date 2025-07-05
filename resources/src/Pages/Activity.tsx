import React from 'react'
import ssr from '@/lib/ssr'
import Http from '@/lib/Http'
import Header from '@/components/Cards/header'
import AppAlert from '@/components/Alert/alert'
import Store from '@/components/Store/store'

// Simplify props if needed
interface StorePageProps {}

const ActivityLog: React.FC<StorePageProps> = () => {
    const user = ssr.get('authUser') 
    const client = Http.get('/api/motd')
    const store = Http.get('/api/store')
    
    return (
        <>
            <Header page="Activity" />
            <AppAlert/>
           
        </>
    )
}

export default ActivityLog;