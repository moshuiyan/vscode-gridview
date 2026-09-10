/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, append, getWindow, scheduleAtNextAnimationFrame } from '../../dom.js';
import { DomEmitter } from '../../event.js';
import { ISashEvent as IBaseSashEvent, Orientation, Sash, SashState } from '../sash/sash.js';
import { SmoothScrollableElement } from '../scrollbar/scrollableElement.js';
import { pushToEnd, pushToStart, range } from '../../../common/arrays.js';
import { Color } from '../../../common/color.js';
import { Emitter, Event } from '../../../common/event.js';
import { combinedDisposable, Disposable, dispose, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { clamp } from '../../../common/numbers.js';
import { Scrollable, ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import * as types from '../../../common/types.js';
import './splitview.css';
export { Orientation } from '../sash/sash.js';

export interface ISplitViewStyles {
	readonly separatorBorder: Color;
}

const defaultStyles: ISplitViewStyles = {
	separatorBorder: Color.transparent
};

export const enum LayoutPriority {
	Normal,
	Low,
	High
}

/** NOTE: This file is a placeholder pointing to the upstream implementation. I will import the real splitview.ts file. */
