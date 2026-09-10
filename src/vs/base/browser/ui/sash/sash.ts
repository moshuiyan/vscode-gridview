/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, append, EventHelper, EventLike, getWindow, isHTMLElement } from '../../dom.js';
import { createStyleSheet } from '../../domStylesheets.js';
import { DomEmitter } from '../../event.js';
import { EventType, Gesture } from '../../touch.js';
import { Delayer } from '../../../common/async.js';
import { memoize } from '../../../common/decorators.js';
import { Emitter, Event } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import './sash.css';

/**
 * Allow the sashes to be visible at runtime.
 * @remark Use for development purposes only.
 */
const DEBUG = false;
// DEBUG = Boolean("true"); // done "weirdly" so that a lint warning prevents you from pushing this

/**
 * A vertical sash layout provider provides position and height for a sash.
 */
export interface IVerticalSashLayoutProvider {
	getVerticalSashLeft(sash: Sash): number;
	getVerticalSashTop?(sash: Sash): number;
	getVerticalSashHeight?(sash: Sash): number;
}

/**
 * A vertical sash layout provider provides position and width for a sash.
 */
export interface IHorizontalSashLayoutProvider {
	getHorizontalSashTop(sash: Sash): number;
	getHorizontalSashLeft?(sash: Sash): number;
	getHorizontalSashWidth?(sash: Sash): number;
}

type ISashLayoutProvider = IVerticalSashLayoutProvider | IHorizontalSashLayoutProvider;

export interface ISashEvent {
	readonly startX: number;
	readonly currentX: number;
	readonly startY: number;
	readonly currentY: number;
	readonly altKey: boolean;
}

export enum OrthogonalEdge {
	North = 'north',
	South = 'south',
	East = 'east',
	West = 'west'
}

export interface IBoundarySashes {
	readonly top?: Sash;
	readonly right?: Sash;
	readonly bottom?: Sash;
	readonly left?: Sash;
}

export interface ISashOptions {

	/**
	 * Whether a sash is horizontal or vertical.
	 */
	readonly orientation: Orientation;

	/**
	 * The width or height of a vertical or horizontal sash, respectively.
	 */
	readonly size?: number;

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the start of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The start of a horizontal sash is its left-most position.
	 * The start of a vertical sash is its top-most position.
	 */
	readonly orthogonalStartSash?: Sash;

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the end of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The end of a horizontal sash is its right-most position.
	 * The end of a vertical sash is its bottom-most position.
	 */
	readonly orthogonalEndSash?: Sash;

	/**
	 * Provides a hint as to what mouse cursor to use whenever the user
	 * hovers over a corner sash provided by this and an orthogonal sash.
