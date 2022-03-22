import type { Auth0Session } from "./session.store";

const base_path = 'process.env.BASE_PATH'

export const signData = async (payload: unknown, sessionData: Auth0Session): Promise<string> => {
    try {
        const rawTokenResponse = await fetch(`${base_path}/.netlify/functions/sign-gathered-data`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...sessionData,
                requiredData: payload
            })
        })
        const response = await rawTokenResponse.json();
        return response.token
    } catch (error) {
       console.error(error);
       throw error
    }
}