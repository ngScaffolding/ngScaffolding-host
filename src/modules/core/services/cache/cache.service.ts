import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { CacheEntry } from '../../models/cacheEntry.model';

@Injectable()
export class CacheService {

    private allValues: Array<CacheEntry>;

    constructor(private appSettingsService: AppSettingsService) {
        this.allValues = new Array<CacheEntry>();
    }

    public getValue(key: string): any {
        let retVal: string;

        // Do we already have one?
        let currentEntry: CacheEntry;
        for (let entry of this.allValues) {
            if (entry.key === key.toLowerCase()) {
                currentEntry = entry;
                break;
            }
        }

        // Found it
        if (currentEntry) {
            // Have we expired?: Returns null
            if (currentEntry.expires < new Date()) {
                this.resetValue(key);
            } else {
                // Not Expired, extract value
                retVal = currentEntry.value;
            }
        }

        return retVal;
    }

    public setValue(key: string, value: any, expires: number = null): void {
        // Create if we need a new one
        if (!this.allValues) {
            this.allValues = new Array<CacheEntry>();
        }

        // Work out Expiry
        if (expires === null) {
            expires = this.appSettingsService.cacheDefaultSeconds || 300;
        }

        // work out when this value expires
        let newExpires = new Date();
        newExpires.setSeconds(newExpires.getSeconds() + expires);

        // Do we already have one?
        let currentEntry: CacheEntry;
        for (let entry of this.allValues) {
            if (entry.key === key.toLowerCase()) {
                currentEntry = entry;
                break;
            }
        }

        // None Exist so make one
        if (!currentEntry) {
            currentEntry = new CacheEntry();

            // Keys are always stored as lower case
            currentEntry.key = key.toLowerCase();
            this.allValues.push(currentEntry);
        }

        // Set Value and Expiry
        currentEntry.value = value;
        currentEntry.expires = newExpires;
    }

    public resetValue(key: string): void {
        if (this.allValues) {
            // Do we already have one?
            let currentEntry: CacheEntry;
            for (let entry of this.allValues) {
                if (entry.key === key.toLowerCase()) {
                    currentEntry = entry;
                    break;
                }
            }

            // Exists?
            if (currentEntry) {
                // Remove it
                this.allValues = this.allValues.filter(obj => obj !== currentEntry);
            }
        }
    }

    public resetAll(): void {
        // Just a new one really
        this.allValues = new Array<CacheEntry>();
    }
}
