import React from 'react';
import ssr from './lib/ssr';
import { Card } from './components/ui/card';
import { CoinsIcon, Heading1, MessageCircle, Shield } from 'lucide-react';
import { SidebarProvider } from './components/ui/sidebar';
import SidebarLayout from './components/Sidebar/sidebar';

const App: React.FC = () => {
    const user = ssr.get("authUser")

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <SidebarLayout>
                    <div className="flex-1">
                        <main className="p-6">
                            <Card className="w-full">
                                <div className="p-6">
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-2">
                                                Welcome, {user?.name}!

                                            </h1>
                                            <p className="text-muted-foreground">
                                                This is your dashboard. You can manage your servers, view stats, and more.
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Quick Stats Cards */}
                                            <Card className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                                                        <p className="text-2xl font-bold">{user?.id}</p>
                                                    </div>
                                                    <Shield className="h-6 w-6 text-primary" />
                                                </div>
                                            </Card>

                                            <Card className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground">Credits</h3>
                                                        <p className="text-2xl font-bold">{user?.credits?.toLocaleString()}</p>
                                                    </div>
                                                    <CoinsIcon  className="h-6 w-6 text-primary" />
                                                </div>
                                            </Card>

                                            <Card className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
                                                        <p className="text-2xl font-bold">12</p>
                                                    </div>
                                                    <MessageCircle className="h-6 w-6 text-primary" />
                                                </div>
                                            </Card>
                                        </div>

                                        <div className="bg-black text-white p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-2">Tailwind Test</h3>
                                            <p>This area is for testing Tailwind styles</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </main>
                    </div>
                </SidebarLayout>
            </div>
        </SidebarProvider>
    );
};

export default App;