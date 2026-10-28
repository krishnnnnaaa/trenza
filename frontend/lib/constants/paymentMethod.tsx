import { paymentMethodType } from "@/types/types";
import {
	Banknote,
	CreditCard,
} from "lucide-react";

import visa from '@/assets/svg/visa.svg'
import mastercard from '@/assets/svg/mastercard.svg'
import upi from '@/assets/svg/upi.svg'



export const PAYMENT_METHODS:paymentMethodType[] = [
	// {
	// 	id: "upi",
	// 	title: "UPI",
	// 	subtitle: "Pay instantly using any UPI app",
	// 	icon: upi,
	// 	subIcons: [phonepe, gpay, paytm],
	// 	note: "Supports Google Pay, PhonePe, Paytm and more",
	// },
	// {
	// 	id: "card",
	// 	title: "Credit / Debit Card",
	// 	subtitle: "Pay securely with your card",
	// 	icon: CreditCard,
	// 	subIcons: [visa, mastercard, rupay],
	// 	note: "All major cards are accepted",
	// },
	// {
	// 	id: "net-banking",
	// 	title: "Net Banking",
	// 	subtitle: "Pay directly from your bank account",
	// 	icon: Landmark,
	// },
	{
		id: "online",
		title: "Online Payment",
		subtitle: "Pay securely using various online methods",
		icon: CreditCard,
		subIcons: [upi, visa, mastercard],
		note: "Supports Credit/Debit Cards, UPI and Net Banking",
	},
	{
		id: "cash-on-delivery",
		title: "Cash on Delivery",
		subtitle: "Pay when your order arrives",
		icon: Banknote,
		note: "Additional charges may apply",
	},
] as const;
