import { writable } from "svelte/store";
import type { Form } from "./types/form";

function createSchemaStore() {
    const {subscribe, set, update} = writable({} as Form)
    return {
        subscribe,
        reset: () => {},
        init: (schema: Form) => set(schema),
    }
}

export const schema = createSchemaStore()