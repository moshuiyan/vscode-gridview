/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* NOTE: This import is a small subset of the dom.ts file to make the tree compile in a minimal way.
   For full functionality, the full dom.ts will be copied in a follow-up if you want.
*/

export function $(selectorOrTag: string): HTMLElement {
	return document.createElement(selectorOrTag);
}

export enum EventType {
	POINTER_DOWN = 'pointerdown',
	POINTER_MOVE = 'pointermove',
	POINTER_UP = 'pointerup',
	WHEEL = 'wheel'
}

export function addDisposableListener(el: EventTarget, type: string, handler: (e: any) => void) {
	el.addEventListener(type, handler as EventListener);
	return {
		dispose() { el.removeEventListener(type, handler as EventListener); }
	};
}

export function append(parent: HTMLElement, child: HTMLElement) { parent.appendChild(child); }

export function getWindow(elem: HTMLElement): Window { return window; }

export function isHTMLElement(e: unknown): e is HTMLElement { return e instanceof HTMLElement; }

export function EventHelper() { }

export function createStyleSheet() { /* no-op for now */ }
