//Angular
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

//Utils
import { StorageKey } from "../constants/storageKeys";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})

export class StorageService {
    private isBrowser = false;

    constructor(@Inject(PLATFORM_ID) platformId : any) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    private isValid() : boolean {
        return this.isBrowser && !!window.localStorage;
    }

    setItem(key : StorageKey, value : any) : void {
        if(!this.isValid) return;

        try
        {
            const data = typeof value == "string" ? value : JSON.stringify(value);
            localStorage.setItem(key, data);
        }
        catch(e) {
            console.error("LocalStorage Error: ", e);
        }
    }

    getItem<T>(key : StorageKey) : T | null {
        if(!this.isValid) return null;

        const data = localStorage.getItem(key);
        if(!data) return null;

        try
        {
            return JSON.parse(data) as T;
        } catch(e) {
            return data as unknown as T;
        }
    }
}