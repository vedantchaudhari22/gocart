'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";

export default function PublicLayout({ children }) {

    const dispatch = useDispatch();
    const { user } = useUser();
    const { getToken } = useAuth();
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchProducts({}));
    }, [])

    useEffect(() => {
        if (user) {
            (async () => {
                const token = await getToken();
                dispatch(fetchCart({ token }));
            })();
        }
    }, [user])

    useEffect(() => {
        if (user) {
            (async () => {
                const token = await getToken();
                dispatch(uploadCart({ token }));
            })();
        }
    }, [cartItems]);

    useEffect(() => {
        if (user) {
            (async () => {
                try {
                    const token = await getToken();
                    dispatch(fetchAddress({ token }));
                    dispatch(fetchUserRatings({ getToken }))
                } catch (error) {
                    console.error("Failed to fetch addresses:", error);
                }
            })();
        }
    }, [user, getToken, dispatch]);




    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
