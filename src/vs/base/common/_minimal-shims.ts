/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* NOTE: I only imported a subset of the base/common utils referenced by grid/splitview/sash. */

/* arrays.ts (subset) */
export function equals<T>(a: readonly T[], b: readonly T[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

/* event.ts (very small subset) */
export class Emitter<T> {
	private listeners: ((e: T) => void)[] = [];
	public event = (listener: (e: T) => void) => this.listeners.push(listener);
	fire(e: T) { for (const l of this.listeners) l(e); }
}

/* lifecycle.ts (minimal Disposable) */
export class Disposable {
	dispose() { /* noop */ }
}

/* numbers.ts (subset) */
export function rot(index: number, modulo: number): number { return (modulo + (index % modulo)) % modulo; }

/* types.ts (subset) */
export function isUndefined(obj: unknown): obj is undefined { return (typeof obj === 'undefined'); }
