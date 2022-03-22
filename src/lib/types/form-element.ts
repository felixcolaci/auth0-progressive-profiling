import type { FormElementType } from "./FormElementType";

export interface FormElement {
    label: string;
    type: FormElementType;
    required?: boolean;
    value?: unknown;
    properties?: {
        [key: string]: FormElement
    }
 
}

