"use client"

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Http from '@/lib/Http'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Calendar, 
  Server, 
  HardDrive, 
  Cpu, 
  Database, 
  RefreshCw, 
  ExternalLink,
  Clock,
  Tag,
  Info,
  Layers,
  Trash2,
  Settings,
  X,
  AlertCircle
} from "lucide-react"
import { formatDistance } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import NadhiLoader from '../Loader/Nadhi.dev'

interface ServerProduct {
  id: string
  name: string
  description: string
  price: string
  memory: number
  cpu: number
  swap: number
  disk: number
  io: number
  databases: number
  backups: number
  serverlimit: number
  allocations: number
  oom_killer: number
  created_at: string
  updated_at: string
  disabled: number
  minimum_credits: string
  billing_period: string
}

interface ServerData {
  id: string
  temp_id: string
  name: string
  description: string | null
  suspended: string | null
  identifier: string
  pterodactyl_id: number
  user_id: number
  product_id: string
  created_at: string
  updated_at: string
  last_billed: string
  canceled: string | null
  location: string
  egg: string
  nest: string
  node: string
  product: ServerProduct
}

interface ServersResponse {
  servers: ServerData[]
}

// Query keys
const QUERY_KEYS = {
  servers: ['servers'] as const,
  server: (id: string) => ['servers', id] as const,
}

// API functions
const fetchServers = async (): Promise<ServersResponse> => {
  const response = await Http.get('/api/servers')
  return response
}

const deleteServer = async (serverId: string): Promise<void> => {
  await Http.delete(`/api/servers/${serverId}`)
}

const cancelServer = async (serverId: string): Promise<void> => {
  await Http.post(`/api/servers/${serverId}/cancel`)
}

export default function ServersList() {
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null)
  const queryClient = useQueryClient()

  // Fetch servers with React Query
  const {
    data: serversData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: QUERY_KEYS.servers,
    queryFn: fetchServers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Delete server mutation
  const deleteServerMutation = useMutation({
    mutationFn: deleteServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.servers })
    },
    onError: (error) => {
      console.error('Failed to delete server:', error)
      // You can add toast notification here
    }
  })

  // Cancel server mutation
  const cancelServerMutation = useMutation({
    mutationFn: cancelServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.servers })
    },
    onError: (error) => {
      console.error('Failed to cancel server:', error)
      // You can add toast notification here
    }
  })

  const servers = serversData?.servers || []

  const formatMemory = (memory: number) => {
    return memory >= 1024 ? `${memory / 1024}GB` : `${memory}MB`
  }

  const formatDisk = (disk: number) => {
    return disk >= 1024 ? `${disk / 1024}GB` : `${disk}MB`
  }

  const getBillingLabel = (period: string) => {
    const labels: Record<string, string> = {
      'hourly': 'Hour',
      'daily': 'Day',
      'weekly': 'Week',
      'monthly': 'Month',
      'quarterly': 'Quarter',
      'half-annually': 'Half-Year',
      'annually': 'Year'
    }
    return labels[period] || period
  }

  const handleDeleteServer = (server: ServerData) => {
    if (window.confirm(`Are you sure you want to delete "${server.name}"? This action cannot be undone.`)) {
      deleteServerMutation.mutate(server.id)
    }
  }

  const handleSettingsServer = (server: ServerData) => {
    console.log('Settings for server:', server.name, server.id)
    // Navigate to settings or open settings modal
  }

  const handleCancelServer = (server: ServerData) => {
    if (window.confirm(`Are you sure you want to cancel "${server.name}"?`)) {
      cancelServerMutation.mutate(server.id)
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center">
          <NadhiLoader size="lg" />
          <p className="text-muted-foreground">Loading your servers...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load servers: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  

  // Empty state
  if (servers.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-64">
        <Server className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No servers found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have any servers yet. Create your first server to get started.
        </p>
        <Button className="mt-6">Create Server</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className=" px-4 text-2xl font-bold tracking-tight">
          Servers ({servers.length})
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <Card key={server.id} className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{server.name}</CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">
                    {server.product.name} • {server.nest} ({server.egg})
                  </CardDescription>
                </div>
                <Badge variant={server.canceled ? "destructive" : "default"} className="ml-2">
                  {server.canceled ? "Canceled" : "Active"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm">
                  <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Memory:</span>
                  <span className="font-medium">{formatMemory(server.product.memory)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">CPU:</span>
                  <span className="font-medium">{server.product.cpu}%</span>
                </div>
                <div className="flex items-center text-sm">
                  <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Disk:</span>
                  <span className="font-medium">{formatDisk(server.product.disk)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Created:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium">
                          {formatDistance(new Date(server.created_at), new Date(), { addSuffix: true })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{new Date(server.created_at).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Tag className="h-3 w-3 mr-1" />
                <span className="truncate">ID: {server.temp_id || server.id.substring(0, 8)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button variant="outline" size="sm" asChild>
                <a href={`/panel/server/${server.identifier}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Panel
                </a>
              </Button>
              
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteServer(server)}
                        disabled={deleteServerMutation.isLoading}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Server</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSettingsServer(server)}
                        className="h-8 w-8 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Server Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {!server.canceled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCancelServer(server)}
                          disabled={cancelServerMutation.isLoading}
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-600 hover:bg-orange-600/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancel Server</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedServer(server)}>
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  {selectedServer && (
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>{selectedServer.name}</DialogTitle>
                        <DialogDescription>
                          Server details and specifications
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-4 py-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="px-3 py-1">
                              {selectedServer.node} • {selectedServer.location}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                              {selectedServer.nest} - {selectedServer.egg}
                            </Badge>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center">
                              <Layers className="h-4 w-4 mr-2 text-primary" />
                              Server Specifications
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Memory</p>
                                <p className="font-medium">{formatMemory(selectedServer.product.memory)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">CPU</p>
                                <p className="font-medium">{selectedServer.product.cpu}%</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Storage</p>
                                <p className="font-medium">{formatDisk(selectedServer.product.disk)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Databases</p>
                                <p className="font-medium">{selectedServer.product.databases}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Backups</p>
                                <p className="font-medium">{selectedServer.product.backups}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">I/O</p>
                                <p className="font-medium">{selectedServer.product.io}</p>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-primary" />
                              Billing Information
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="font-medium">{selectedServer.product.price} credits</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Billing Period</p>
                                <p className="font-medium">Per {getBillingLabel(selectedServer.product.billing_period)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last Billed</p>
                                <p className="font-medium">{new Date(selectedServer.last_billed).toLocaleString()}</p>
                              </div>
                              {selectedServer.canceled && (
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Canceled On</p>
                                  <p className="font-medium">{new Date(selectedServer.canceled).toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center">
                              <Info className="h-4 w-4 mr-2 text-primary" />
                              Technical Details
                            </h4>
                            
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Server ID</p>
                                <p className="font-mono text-xs bg-muted p-1.5 rounded">{selectedServer.id}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Pterodactyl ID</p>
                                <p className="font-medium">{selectedServer.pterodactyl_id}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Identifier</p>
                                <p className="font-medium font-mono">{selectedServer.identifier}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(selectedServer.created_at).toLocaleString()}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{new Date(selectedServer.updated_at).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                      
                      <DialogFooter className="flex gap-2 sm:justify-between">
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteServer(selectedServer)}
                            disabled={deleteServerMutation.isLoading}
                          >
                            {deleteServerMutation.isLoading ? 'Deleting...' : 'Delete Server'}
                          </Button>
                          {!selectedServer.canceled && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelServer(selectedServer)}
                              disabled={cancelServerMutation.isLoading}
                            >
                              {cancelServerMutation.isLoading ? 'Canceling...' : 'Cancel Server'}
                            </Button>
                          )}
                        </div>
                        <Button asChild>
                          <a href={`/panel/server/${selectedServer.identifier}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Manage Server
                          </a>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}