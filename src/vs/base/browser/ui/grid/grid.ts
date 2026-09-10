/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBoundarySashes, Orientation } from '../sash/sash.js';
import { equals, tail } from '../../../common/arrays.js';
import { Event } from '../../../common/event.js';
import { Disposable } from '../../../common/lifecycle.js';
import './gridview.css';
import { Box, GridView, IGridViewOptions, IGridViewStyles, IView as IGridViewView, IViewSize, orthogonal, Sizing as GridViewSizing, GridLocation } from './gridview.js';
import type { SplitView, AutoSizing as SplitViewAutoSizing } from '../splitview/splitview.js';

export type { IViewSize };
export { LayoutPriority, Orientation, orthogonal } from './gridview.js';

export const enum Direction {
	Up,
	Down,
	Left,
	Right
}

function oppositeDirection(direction: Direction): Direction {
	switch (direction) {
		case Direction.Up: return Direction.Down;
		case Direction.Down: return Direction.Up;
		case Direction.Left: return Direction.Right;
		case Direction.Right: return Direction.Left;
	}
}

/**
 * The interface to implement for views within a {@link Grid}.
 */
export interface IView extends IGridViewView {

	/**
	 * The preferred width for when the user double clicks a sash
	 * adjacent to this view.
	 */
	readonly preferredWidth?: number;

	/**
	 * The preferred height for when the user double clicks a sash
	 * adjacent to this view.
	 */
	readonly preferredHeight?: number;
}

export interface GridLeafNode<T extends IView> {
	readonly view: T;
	readonly box: Box;
	readonly cachedVisibleSize: number | undefined;
	readonly maximized: boolean;
}

export interface GridBranchNode<T extends IView> {
	readonly children: GridNode<T>[];
	readonly box: Box;
}

export type GridNode<T extends IView> = GridLeafNode<T> | GridBranchNode<T>;

export function isGridBranchNode<T extends IView>(node: GridNode<T>): node is GridBranchNode<T> {
	// eslint-disable-next-line local/code-no-any-casts
	return !!(node as any).children;
}

function getGridNode<T extends IView>(node: GridNode<T>, location: GridLocation): GridNode<T> {
	if (location.length === 0) {
		return node;
	}

	if (!isGridBranchNode(node)) {
		throw new Error('Invalid location');
	}

	const [index, ...rest] = location;
	return getGridNode(node.children[index], rest);
}

interface Range {
	readonly start: number;
	readonly end: number;
}

function intersects(one: Range, other: Range): boolean {
	return !(one.start >= other.end || other.start >= one.end);
}

interface Boundary {
	readonly offset: number;
	readonly range: Range;
}

function getBoxBoundary(box: Box, direction: Direction): Boundary {
	const orientation = getDirectionOrientation(direction);
	const offset = direction === Direction.Up ? box.top :
		direction === Direction.Right ? box.left + box.width :
			direction === Direction.Down ? box.top + box.height :
			box.left;

	const range = {
		start: orientation === Orientation.HORIZONTAL ? box.top : box.left,
		end: orientation === Orientation.HORIZONTAL ? box.top + box.height : box.left + box.width
	};

	return { offset, range };
}
