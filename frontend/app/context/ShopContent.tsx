'use client'
import { getCart } from "@/lib/api/cart";
import { getWishlist } from "@/lib/api/wishlist";
import { authClient } from "@/lib/auth-client";
import { ShopContextType } from "@/types/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({children}:{ children: React.ReactNode }) {
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const {isPending, data:session} = authClient.useSession()


    const fetchWishlistCount = useCallback(async () => {
        try {
            const response = await getWishlist();

            if(!response){
                throw new Error('Failed to fetch wishlist.')
            }

            setWishlistCount(response.data.items.length)
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
            throw error;
        }
    }, []);


    
    const fetchCartCount = useCallback(async ()=> {
        try {
            const response = await getCart();

            if(!response){
                throw new Error('Failed to fetch cart.')
            }
            const cartCount = response.data.items.reduce((total, item)=> total + item.quantity, 0);
            setCartCount(cartCount);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            throw error;
        }
    }, []);

    useEffect(() => {

        if(isPending) return;

        if(!session?.user){
            return;
        }
        const loadCounts = async () => {
            const results = await Promise.allSettled([
                fetchWishlistCount(),
                fetchCartCount()
            ]);

            results.forEach((result) => {
                if(result.status === 'rejected'){
                    console.error('Error fetching counts:', result.reason);
                }
            });
        };

        void loadCounts();
    }, [fetchWishlistCount, fetchCartCount, session, isPending]);

    const visibleWishlistCount = session?.user ? wishlistCount : 0;
    const visibleCartCount = session?.user ? cartCount : 0;
    

    return(
       <ShopContext.Provider value={{wishlistCount: visibleWishlistCount, setWishlistCount, cartCount: visibleCartCount, setCartCount, fetchCartCount, fetchWishlistCount}}>
            {children}
        </ShopContext.Provider>
    )
}


export function useShop(){
    const context = useContext(ShopContext)
        if(!context){
            throw new Error("useShop must be used within a ShopProvider")
        }
    return context
}