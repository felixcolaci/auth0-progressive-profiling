import { base } from "$app/paths";
import { element } from "svelte/internal";
import type { Form } from "./types/form";
import { FormElementType } from "./types/FormElementType";

export const parseSchema = (schema: Form): Form[] => {
    if(!schema || (schema as unknown) == {} || !schema.properties) {
        return []
    }
    const result: Form[] = []

    const baseForm: Form = {
        title: "default",
        properties: {}
    }

    const atomicElements = Object.entries(schema?.properties)
    atomicElements.forEach(([key, item]) => {
        if(item.type === FormElementType.OBJECT) {
            result.push({
                title: item.label,
                properties: item.properties
            })
        } else {
            baseForm.properties[key] = item
        }
    })
    if (!result.length) {
        return [Object.assign(schema, {title: 'default'})]
    }

    return [baseForm, ...result]
}