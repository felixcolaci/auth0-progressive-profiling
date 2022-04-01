import type { FormElement } from "./form-element";

export interface Form {
    title: string;
    subheading?: string;
    theme?: Theme,
    properties?: {
        [key: string]: FormElement;
    }
}

export interface Theme {
    logoUrl: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
}