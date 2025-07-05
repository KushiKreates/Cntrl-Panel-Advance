"use client"

import React, { useEffect, useState } from "react"
import Http from "@/lib/Http"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast, Toaster } from "sonner"
import { 
  ChevronRight, 
  CreditCard, 
  Gift, 
  ShoppingCart, 
  Tag, 
  Info, 
  Receipt,
  Shield,
  ArrowRight,
  ShoppingCartIcon
} from "lucide-react"
import ssr from "@/lib/ssr"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCartBoldIcon } from "@heroui/shared-icons"
import { Navigate, useNavigate } from "@tanstack/react-router"

interface Product {
  id: string
  type: string
  price: number
  quantity: number
  description: string
  currency: string
  formattedPrice: string
}

interface PaymentGateway {
  name: string
  label: string
}

interface CheckoutData {
  product: Product
  tax: {
    percent: number
    value: number
    formattedValue: string
  }
  discount: {
    percent: number
    value: number
    formattedValue: string
  }
  total: number
  isFree: boolean
  isCouponsEnabled: boolean
}

interface SSRData {
  paymentGateways: PaymentGateway[]
  productIsFree: boolean
}

export default function Checkout() {
  // Extract productId from URL path
  const [productId, setProductId] = useState<string>("");

  useEffect(() => {
    // Extract productId from URL like /home/checkout/123
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    setProductId(id);
  }, []);

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentGateway[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState({ percent: 0, value: 0, formattedValue: "" })
  const [originalDiscount, setOriginalDiscount] = useState({ percent: 0, value: 0, formattedValue: "" })
  const [isCouponsEnabled, setIsCouponsEnabled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!productId) return;

    // grab the two blobs you injected on window
    const ck = window.checkout as CheckoutData
    const data = ssr.get('checkoutData') as SSRData
    

    // hydrate your state
    console.log("Hydrating checkout state with:", ck, data)
    setProduct(ck.product)
    setTotal(ck.total)
    setTax(ck.tax)
    setOriginalDiscount(ck.discount)
    setIsCouponsEnabled(ck.isCouponsEnabled)
    setPaymentMethods(data.paymentGateways)
    if (data.productIsFree || ck.isFree) setSelectedMethod('free')

    setLoading(false)
  }, [productId])

  const formatPrice = (amount: number, currency: string = product?.currency || 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const applyCoupon = () => {
    if (!coupon.trim() || !product) return
    Http.post<{ valid: boolean; value: number; type: "percentage" | "amount" }>(
      "/api/coupons/redeem",
      { coupon, productId }
    )
      .then((res) => {
        if (res.valid) {
          const newTotal =
            res.type === "percentage"
              ? total * (1 - res.value / 100)
              : total - res.value
          setDiscount(total - newTotal)
          setTotal(newTotal)
          setCouponApplied(true)
          toast.success("Coupon applied!")
        } else {
          toast.error("Invalid coupon.")
        }
      })
      .catch(() => toast.error("Coupon check failed."))
  }

  const submitPayment = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method.")
      return
    }
    toast.custom((t) => (
      <div className={`p-4 rounded-lg shadow-lg bg-white dark:bg-zinc-800 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="flex items-center gap-2">
          <ShoppingCartBoldIcon className="h-6 w-6 text-primary" />
          <span className="font-semibold">Redirecting to payment...</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we process your payment.
        </p>
      </div>
    ))
    // Redirect to server for processing using plain window.location
    Navigate({to:
        `/new/payment/pay?product_id=${productId}&method=${selectedMethod}&coupon=${couponApplied ? coupon : ""}`
    })
  // window.location.href = `/new/payment/pay?product_id=${productId}&method=${selectedMethod}&coupon=${couponApplied ? coupon : ""}`;
  console.log(`/new/payment/pay?product_id=${productId}&method=${selectedMethod}&coupon=${couponApplied ? coupon : ""}`)

  
  }

  if (loading || !product) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CreditCard className="animate-pulse h-12 w-12 text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Loading checkout information...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container max-w-6xl mx-auto px-4 py-12">
        
        
        <div className="grid gap-8 lg:grid-cols-5">
          {/* LEFT: Order Summary - Now takes 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/40 ">
              <CardHeader className="bg-gradient-to-r  border-b border-border/30">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 rounded-lg bg-muted/40">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Item</span>
                      <span className="font-medium">
                        {product.quantity} {product.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Description</span>
                      <span className="text-sm max-w-[200px] text-right">
                        {product.description}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit Price</span>
                      <span>{product.formattedPrice}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  {/* Show original discount if any */}
                  {originalDiscount.value > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Tag className="h-4 w-4" /> Discount
                      </span>
                      <Badge variant="outline" className="text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50">
                        {originalDiscount.formattedValue}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Show coupon discount if applied */}
                  {couponApplied && discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Gift className="h-4 w-4" /> Coupon
                      </span>
                      <Badge variant="outline" className="text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50">
                        -{formatPrice(discount)}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Show tax if any */}
                  {tax.value > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Receipt className="h-4 w-4" /> Tax ({tax.percent}%)
                      </span>
                      <span>{tax.formattedValue}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secure checkout badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-3 rounded-md border border-border/40 bg-background">
              <Shield className="h-4 w-4" />
              <span>This checkout is powered by <a className="font-bold font-jakarta" href="https://ctrlpanel.gg">Ctrl-Panel</a></span>
            </div>
          </div>

          {/* RIGHT: Payment & Coupon - Now takes 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border border-border/40 ">
              <CardHeader className="bg-gradient-to-r  border-b border-border/30">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="max-h-[280px] pr-4">
                  <RadioGroup
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((gw) => (
                      <div 
                        key={gw.name} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${selectedMethod === gw.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50 hover:border-border hover:bg-accent/50'
                        } transition-all duration-200`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={gw.name} id={gw.name} />
                          <Label htmlFor={gw.name} className="flex items-center space-x-3 cursor-pointer">
                            {gw.image && (
                              <div className="w-10 h-7 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-md border border-border/50 p-1">
                                <img
                                  src={gw.image}
                                  alt={gw.name}
                                  className="h-5 max-w-[32px] object-contain"
                                />
                              </div>
                            )}
                            <span className="font-medium">{gw.label || gw.name}</span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </CardContent>
            </Card>

            {isCouponsEnabled && (
              <Card className="border border-border/40 ">
                <CardHeader className="bg-gradient-to-r  border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Discount Code</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter promo code"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          className={couponApplied ? "border-green-500 focus-visible:ring-green-500" : ""}
                          disabled={couponApplied}
                        />
                      </div>
                      <Button
                        onClick={applyCoupon}
                        disabled={couponApplied || !coupon}
                        variant={couponApplied ? "outline" : "default"}
                        className={couponApplied ? "border-green-500 text-green-600" : ""}
                      >
                        {couponApplied ? "Applied ✓" : "Apply"}
                      </Button>
                    </div>
                    {couponApplied && (
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <p>Discount of <span className="font-semibold">{formatPrice(discount)}</span> applied to your order!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={submitPayment}
                    size="lg"
                    className="w-full text-base py-6 group"
                    disabled={!selectedMethod}
                  >
                    <span className="flex items-center gap-2">
                      Complete Payment
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}