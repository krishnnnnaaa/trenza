import { NextRequest } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;
export async function getSessionToken(req: NextRequest){
    try {
       const response = await fetch(`${backendUrl}api/auth/get-session`, {
            headers: {
                Cookie: req.headers.get("cookie")!
            }
        })

        if (!response.ok) {
    throw new Error(
        `Failed to fetch session token: ${response.status} ${response.statusText}`
    );
}
        const data = await response.json();

        if (!data || !data.session) {
            return null;
        }
        console.log("Session API status:", response.status);
console.log("Session data exists:", !!data);
console.log("Session exists:", !!data?.session);
console.log("Cookie forwarded:", !!req.headers.get("cookie"));
        return data.session;
    } catch (error) {
        console.error("Error fetching session token:", error);
        throw error;
    }
}