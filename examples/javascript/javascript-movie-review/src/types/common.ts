export interface StrictObject {
	[key: string]: unknown;
	length?: never;
}
