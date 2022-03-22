import { writable } from "svelte/store";

export interface Auth0Session {
    sessionToken?: string;
    state?: string;
}

function createSessionStore() {
    const {subscribe, set} = writable({} as Auth0Session)
    return {
        subscribe,
        reset: () => {},
        init: (data: Auth0Session) => set(data),
    }
}

export const auth0Session = createSessionStore()