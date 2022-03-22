import { createRemoteJWKSet, jwtVerify } from "jose";

import type { Form } from "./types/form";

import { Buffer } from "buffer";

export const validateAndParseInput = async (sessionToken: string): Promise<Form> => {
    console.log(sessionToken)
  
    const payload = extractPayload(sessionToken)
    console.log(payload)
    if (payload['requiredData']) {
        return (payload['requiredData'] as Form)
    }
    throw new Error('failed to generate form')
}

const extractPayload = (sessionToken: string) => {
    const payload = sessionToken.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload)
}