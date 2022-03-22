import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";
import type { JsonValue } from "./types/json";
import { browser } from "$app/env";


export function local<T extends JsonValue>(key: string, initial: T): Writable<T> {
  const toString = (value: T) => JSON.stringify(value, null, 2); // helper function
  const toObj = JSON.parse; // helper function

  if (browser) {
    if (sessionStorage.getItem(key) === null) {
      sessionStorage.setItem(key, toString(initial));
    }

    const saved = toObj(sessionStorage.getItem(key) || '');

    const store = writable(saved);

    return {
      subscribe: store.subscribe,
      set: (value: T) => {
        if(browser) {
          sessionStorage.setItem(key, toString(value));
        }

        store.set(value);
      },
      update: (fn: (value: T) => T) => {
        store.update(fn);
        if(browser) {
          sessionStorage.setItem(key, toString(get(store)));

        }
      }
    };
  } else {
    return writable(initial);
  }
}
