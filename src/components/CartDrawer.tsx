import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Ticket } from 'lucide-react';
import { Product } from '../data/fashionData';

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  addNotification: (message: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  addNotification
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.20 for 20%
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'complete'>('cart');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 250;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 15.00);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'KASHI20') {
      setAppliedDiscount(0.20);
      addNotification('Success! Promo code KASHI20 applied (20% off)');
    } else {
      addNotification('Invalid promo code. Try "KASHI20"');
    }
    setPromoCode('');
  };

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress || !phoneNumber) {
      addNotification('Please fill in your delivery details.');
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setCheckoutStep('complete');
      setIsCheckingOut(false);
      addNotification('Your order has been secured! Check your mail for tracking.');
    }, 1500);
  };

  const handleFinishCheckout = () => {
    onClearCart();
    setCheckoutStep('cart');
    setAppliedDiscount(0);
    setShippingAddress('');
    setPhoneNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 text-white border-l border-zinc-800 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold tracking-wider uppercase">Your Atelier Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Checkout Complete Screen */}
          {checkoutStep === 'complete' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="h-16 w-16 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center ring-4 ring-amber-400/20 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-amber-400 tracking-tight">Order Placed Successfully!</h3>
                <p className="text-xs text-zinc-400">
                  Congratulations! Your curated package from Kashi’s Styles is being assembled by our senior tailors.
                </p>
              </div>
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 w-full text-left space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Shipping Summary</p>
                <p className="text-sm font-semibold">{shippingAddress}</p>
                <p className="text-xs text-zinc-400">Estimated delivery: Express, 3-5 business days</p>
              </div>
              <button
                onClick={handleFinishCheckout}
                className="w-full py-3 bg-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg hover:bg-amber-300 transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          ) : checkoutStep === 'shipping' ? (
            /* Shipping Info Form */
            <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-400 tracking-wide uppercase mb-1">Shipping & Checkout</h3>
                  <p className="text-xs text-zinc-400">Complete your premium wardrobe checkout details.</p>
                </div>

                {/* Subtotal review */}
                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Items Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs text-amber-400">
                      <span>KASHI20 Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Order:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                      Full Delivery Address *
                    </label>
                    <textarea
                      required
                      placeholder="Street, Apartment number, City, State, ZIP Code"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                      Contact Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="p-3.5 bg-amber-400/5 rounded-lg border border-amber-400/10 text-[11px] text-zinc-300 leading-relaxed">
                    🌟 <strong className="text-amber-400">Kashi Guarantee:</strong> Cash on delivery and secure card payment both accepted upon courier handover. No pre-payment risk!
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg hover:from-amber-400 hover:to-amber-300 transition-colors flex items-center justify-center space-x-2"
                >
                  {isCheckingOut ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>CONFIRM ORDER FOR ${total.toFixed(2)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-2 bg-transparent text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Back to Cart
                </button>
              </div>
            </form>
          ) : (
            /* Cart Items List Step */
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Free Shipping Indicator */}
                {cartItems.length > 0 && (
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold">
                        {isFreeShipping 
                          ? '🎉 You qualify for Free Express Shipping!' 
                          : `Spend $${(freeShippingThreshold - subtotal).toFixed(2)} more for FREE Express Shipping!`}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-500" 
                        style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="p-4 bg-zinc-900 rounded-full text-zinc-600">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-300">Your wardrobe is empty</p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                        Add curated garments from our blog suggestions or shop the collection directly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                      <div 
                        key={`${item.product.id}-${item.selectedSize}-${idx}`}
                        className="flex items-center space-x-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all group"
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-16 w-14 object-cover rounded-lg bg-zinc-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Size: <span className="text-amber-400 font-bold uppercase">{item.selectedSize}</span> | Cat: {item.product.category}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 border border-zinc-800 rounded bg-zinc-950 px-1 py-0.5">
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                                className="text-zinc-500 hover:text-white px-1 text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold px-1 text-zinc-200">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                                className="text-zinc-500 hover:text-white px-1 text-xs"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs font-bold text-zinc-100">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Remove item button */}
                        <button 
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-850 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promo and Totals at Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-zinc-900 bg-zinc-900/30 space-y-4">
                  {/* Promo Input */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Promo Code (e.g. KASHI20)" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs placeholder-zinc-500 text-white uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button 
                      onClick={handleApplyPromo}
                      className="px-4 bg-zinc-800 hover:bg-amber-400 hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Items Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-amber-400 font-semibold">
                        <span>Discount (20% Off)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Express Shipping</span>
                      <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between text-sm font-bold text-white">
                      <span>Total</span>
                      <span className="text-amber-400 text-base">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartCheckout}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg hover:from-amber-400 hover:to-yellow-300 transition-colors flex items-center justify-center space-x-2 group"
                  >
                    <span>Proceed to Secured Checkout</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
