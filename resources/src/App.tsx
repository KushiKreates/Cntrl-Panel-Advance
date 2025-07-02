import React from 'react';
import ssr from './lib/ssr';
import { Card } from './components/ui/card';
import { CoinsIcon, Heading1, MessageCircle, Shield } from 'lucide-react';
import { SidebarProvider } from './components/ui/sidebar';
import SidebarLayout from './components/Sidebar/sidebar';
import Motd from '@/components/Motd/Motd';

const App: React.FC = () => {
    const user = ssr.get("authUser")

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <SidebarLayout>
                    <div className="flex-1">
                        <main className="p-6">
                            
                           <Motd />
                        </main>
                    </div>
                </SidebarLayout>
            </div>
        </SidebarProvider>
    );
};

export default App;