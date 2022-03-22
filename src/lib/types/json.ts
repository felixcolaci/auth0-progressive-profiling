export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonString = { [key: string]: string };
export type JsonBool = { [key: string]: boolean };
