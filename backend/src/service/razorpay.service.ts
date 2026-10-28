import { razorpay } from "../lib/razorpay.js";

export const createRazorpayOrder = async({amount, receipt}: {amount: number, receipt: string}) => {
    try {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            receipt: receipt,
        };
        return await razorpay.orders.create(options);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new Error("Failed to create Razorpay order");
    }
}


export const fetchRazorpayOrder = async(orderId: string) => {
    try {
        return await razorpay.orders.fetch(orderId);
    } catch (error) {
        console.error("Error fetching Razorpay order:", error);
        throw new Error("Failed to fetch Razorpay order");
    }
}