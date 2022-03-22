import type { FormElement } from "./form-element";

export interface Form {
    title: string;
    properties?: {
        [key: string]: FormElement;
    }
}