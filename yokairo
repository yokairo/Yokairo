import React, { useState } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { ShoppingCart, Star, Gift, Sparkles, CreditCard, Wallet, TrendingUp, RotateCcw } from "lucide-react"; import { motion } from "framer-motion"; import { Canvas } from "@react-three/fiber"; import { OrbitControls, Sphere, MeshWobbleMaterial } from "@react-three/drei";

const products = [ { id: 1, name: "LED Galaxy Projector", price: 49.99, rating: 4.8 }, { id: 2, name: "Posture Corrector Brace", price: 29.99, rating: 4.7 }, { id: 3, name: "Smart Water Bottle with Hydration Tracker", price: 39.99, rating: 4.6 }, { id: 4, name: "Portable Neck Fan", price: 34.99, rating: 4.7 }, { id: 5, name: "Magnetic Eyelashes & Eyeliner Set", price: 24.99, rating: 4.5 }, { id: 6, name: "Mini Projector for Home Theater", price: 89.99, rating: 4.8 } ];

export default function YokairoDropshipping() { const [cart, setCart] = useState([]); const [wishlist, setWishlist] = useState([]); const [rewards, setRewards] = useState(0);

const addToCart = (product) => { setCart([...cart, product]); setRewards(rewards + 10); // Gamification: Earn points };

const addToWishlist = (product) => { if (!wishlist.includes(product)) { setWishlist([...wishlist, product]); } };

const handlePayment = (method) => { alert(Processing payment via ${method}...); };

return ( <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white min-h-screen"> <motion.h1 className="text-4xl font-bold flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} > <Sparkles className="text-yellow-400" /> <span>Welcome to Yokairo Dropshipping - Powered by AI</span> </motion.h1>

<Canvas className="h-64 mt-6">
    <OrbitControls />
    <ambientLight intensity={0.5} />
    <directionalLight position={[2, 2, 2]} />
    <Sphere args={[1, 64, 64]}>
      <MeshWobbleMaterial attach="material" color="#ff007f" factor={1.5} speed={2} />
    </Sphere>
  </Canvas>
  
  <div className="mt-8 text-lg font-medium text-yellow-400 flex items-center space-x-2">
    <TrendingUp className="text-green-500" />
    <h2>Trending Dropshipping Products</h2>
  </div>
  
  <div className="grid grid-cols-3 gap-6 mt-6">
    {products.map((product) => (
      <motion.div key={product.id} whileHover={{ scale: 1.1 }} className="bg-gray-800 p-6 rounded-2xl shadow-xl">
        <Card className="border border-gray-700">
          <CardContent className="p-4 text-center">
            <h2 className="text-2xl font-semibold text-pink-400">{product.name}</h2>
            <p className="text-gray-300">${product.price.toFixed(2)}</p>
            <div className="flex justify-center items-center mt-2">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className={`w-4 h-4 ${index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <Button className="mt-3 bg-pink-500 hover:bg-pink-600" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
            <Button className="mt-3 ml-2 border border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white" variant="outline" onClick={() => addToWishlist(product)}>
              Wishlist
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
  
  <div className="mt-8 text-lg font-medium text-yellow-400 flex items-center space-x-2">
    <Gift className="text-green-500" />
    <h2>Your Reward Points: {rewards}</h2>
  </div>
  
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-pink-400">Select Payment Method</h2>
    <div className="flex space-x-4 mt-4">
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handlePayment('Credit Card')}>Credit Card</Button>
      <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => handlePayment('PayPal')}>PayPal</Button>
      <Button className="bg-green-500 hover:bg-green-600" onClick={() => handlePayment('Crypto')}>Crypto</Button>
      <Button className="bg-gray-800 hover:bg-gray-900" onClick={() => handlePayment('Apple Pay')}>Apple Pay</Button>
      <Button className="bg-red-500 hover:bg-red-600" onClick={() => handlePayment('Google Pay')}>Google Pay</Button>
    </div>
  </div>
</div>

); }

