// tslint:disable: no-any no-unsafe-any

import { Injectable } from '@angular/core';

/**
 * The default properties mapper for gtag.
 */
@Injectable({
    providedIn: 'root'
})
export class GTagPropertiesMapper {
    private readonly _upperCharRegex = /([A-Z])/g;

    mapValues(properties: { [name: string]: string }): { [name: string]: string } {
        const mappedProperties: { [name: string]: string } = {};
        Object.keys(properties)
            .forEach(key => {
                const normalizedValue = this.changeCase(properties[key]);
                mappedProperties[key] = normalizedValue;
            });

        return mappedProperties;
    }

    mapKeys(properties?: { [name: string]: any }, excludeKeys?: string[]): { [name: string]: any } | undefined {
        if (!properties) {
            return undefined;
        }

        const mappedProperties: { [name: string]: number | string } = {};

        Object.keys(properties)
            .filter(key => excludeKeys == null || !excludeKeys.includes(key))
            .forEach(key => {
                const normalizedKey = this.changeCase(key);
                mappedProperties[normalizedKey] = properties[key];
            });

        return mappedProperties;
    }

    private changeCase(prop: string): string {
        return prop.replace(this._upperCharRegex, '_$1').toLowerCase();
    }
}
