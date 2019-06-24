// tslint:disable: no-any no-unsafe-any

/**
 * The properties mapper for gtag.
 */
export interface GTagPropertiesMapper {
    mapValues(properties: { [name: string]: string }): { [name: string]: string };
    mapKeys(properties?: { [name: string]: any }, excludeKeys?: string[]): { [name: string]: any } | undefined;
}
