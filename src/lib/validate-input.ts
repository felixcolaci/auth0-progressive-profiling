import type { Form } from "./types/form";

const base_path = 'process.env.BASE_PATH'

export const validateAndParseInput = async (sessionToken: string): Promise<Form> => { 
    try {
        const rawTokenResponse = await fetch(`${base_path}/.netlify/functions/verify-session`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sessionToken})
        })
        const payload = await rawTokenResponse.json();
        if (payload['requiredData']) {
            return (payload['requiredData'] as Form)
        }
        throw new Error('failed to generate form')
    } catch (error) {
       console.error(error);
       throw error
    }    
}