"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Coins,
  Server,
  Tag,
  Gift,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import Http from "@/lib/Http"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { RetroGrid } from "@/components/ui/retro-grid"
import NadhiLoader from "../Loader/Nadhi.dev"

interface Product {
  id: string
  type: string
  price: number
  quantity: number
  description: string
  currency_code: string
  disabled: number
  created_at: string
  updated_at: string
  display: string
}

interface StoreApiResponse {
  success: boolean
  data: {
    products: Product[]
  }
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false)
  const [voucherStatus, setVoucherStatus] = useState<{
    message: string
    type: "success" | "error" | null
  }>({ message: "", type: null })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Get voucher code from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("voucher")
    if (code) {
      setVoucherCode(code)
      setVoucherDialogOpen(true)
    }
  }, [])

  useEffect(() => {
    Http.get<StoreApiResponse>("/api/store")
      .then((response) => {
        if (response.success) {
          setProducts(response.data.products)
        } else {
          setError("Failed to load products.")
        }
      })
      .catch((err) => {
        console.error(err)
        setError("An error occurred while fetching store data.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getProductIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("credit")) return <Coins className="h-8 w-8" />
    if (lowerType.includes("server") || lowerType.includes("slot")) return <Server className="h-8 w-8" />
    return <Tag className="h-8 w-8" />
  }

  const handleRedeemVoucher = () => {
    if (!voucherCode.trim()) return

    setVoucherStatus({ message: "", type: null })

    Http.post("/api/vouchers/redeem", { code: voucherCode })
      .then((response) => {
        if (response.success) {
          setVoucherStatus({
            message: response.message || "Voucher redeemed successfully!",
            type: "success",
          })
          setAlertMessage(response.success)
          setAlertOpen(true)

          // Show toast notification
          toast.success("Your voucher has been redeemed successfully.")

          // Close dialog after short delay
          setTimeout(() => {
            setVoucherDialogOpen(false)
            setVoucherCode("")
          }, 1500)
        } else {
          setVoucherStatus({
            message: response.message || "Failed to redeem voucher",
            type: "error",
          })
        }
      })
      .catch((err) => {
        console.error(err)
        setVoucherStatus({
          message: err.responseJSON?.message || "An error occurred",
          type: "error",
        })
      })
  }

  const handlePurchase = (productId: string) => {
    window.location.href = `/home/checkout/${productId}`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <NadhiLoader size="lg" className="mb-4" />
        <h3 className="text-xl font-medium">Loading store products...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} size="lg">
          Try Again
        </Button>
      </div>
    )
  }

  // Group products by type
  const creditProducts = products.filter((p) => p.type.toLowerCase().includes("credit"))
  const serverProducts = products.filter((p) => p.type.toLowerCase().includes("server"))
  const otherProducts = products.filter(
    (p) => !p.type.toLowerCase().includes("credit") && !p.type.toLowerCase().includes("server"),
  )

  return (
    <>
      {/* Sonner’s Toaster must be rendered once in your tree */}
      <Toaster />
      <div className="pb-12">
        {/* Hero Section with RetroGrid */}
        <div className="relative overflow-hidden w-full py-16 text-white shadow-lg">
          <RetroGrid />
          <div className="container mx-auto px-6 relative dark:text-white text-black z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              Store
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl opacity-90 mb-8 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Upgrade your experience with premium products and services
            </p>

            {/* Redeem Voucher Button */}
            <Dialog open={voucherDialogOpen} onOpenChange={setVoucherDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border-0 backdrop-blur-sm flex items-center gap-2"
                >
                  <Gift className="h-5 w-5" />
                  Redeem a Voucher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Redeem Your Voucher</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="voucher-code" className="text-base">
                    Enter your voucher code
                  </Label>
                  <Input
                    id="voucher-code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="e.g. SUMMER2025"
                    className="mt-2 text-lg p-6"
                  />
                  {voucherStatus.type && (
                    <div
                      className={`mt-3 p-3 rounded-md ${
                        voucherStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {voucherStatus.message}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setVoucherDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRedeemVoucher} size="lg" className="px-8">
                    Redeem
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-6 mt-12">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Browse Products</h2>
              <TabsList className="bg-muted/30">
                <TabsTrigger value="all" className="text-base">
                  All
                </TabsTrigger>
                <TabsTrigger value="credits" className="text-base">
                  Credits
                </TabsTrigger>
                <TabsTrigger value="servers" className="text-base">
                  Server Slots
                </TabsTrigger>
                <TabsTrigger value="other" className="text-base">
                  Other
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onPurchase={handlePurchase} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="credits">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {creditProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onPurchase={handlePurchase} />
                ))}
                {creditProducts.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 text-lg">No credit products available.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="servers">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {serverProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onPurchase={handlePurchase} />
                ))}
                {serverProducts.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 text-lg">No server products available.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="other">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {otherProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onPurchase={handlePurchase} />
                ))}
                {otherProducts.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 text-lg">No other products available.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Success Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Voucher Redeemed 🎉</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface ProductCardProps {
  product: Product
  onPurchase: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase }) => {
  const getProductIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("credit")) return <Coins className="h-5 w-5" />
    if (lowerType.includes("server") || lowerType.includes("slot")) return <Server className="h-5 w-5" />
    return <Tag className="h-5 w-5" />
  }

  const getIconColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("credit")) return "text-emerald-600"
    if (lowerType.includes("server")) return "text-blue-600"
    return "text-amber-600"
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header with Icon and Type */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-muted/50 ${getIconColor(product.type)}`}>
              {getProductIcon(product.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">
                {product.display} {product.type}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{product.description}</p>

          {/* Quantity Info for Credits */}
          {product.type.toLowerCase().includes("credit") && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-muted/30 border border-border/30">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">+{product.quantity} credits</span>
            </div>
          )}

          {/* Price and Purchase */}
          <div className="mt-auto space-y-4">
            <div className="flex items-baseline justify-start space-x-1 mb-4">
              <span className="text-5xl font-bold">{product.price}</span>
              <span className="text-sm font-normal text-muted-foreground">/{product.currency_code}</span>
            </div>

            <Button
              className="w-full group"
              disabled={!!product.disabled}
              onClick={() => onPurchase(product.id)}
              variant={product.disabled ? "secondary" : "default"}
            >
              <span>{product.disabled ? "Currently Unavailable" : "Purchase"}</span>
              {!product.disabled && (
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Store
