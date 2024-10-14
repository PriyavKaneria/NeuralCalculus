/* tslint:disable */
/* eslint-disable */
/**
* @param {number} side
* @returns {number}
*/
export function triangle_height(side: number): number;
/**
*/
export class Grid {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {Grid}
*/
  static new(width: number, height: number): Grid;
/**
* @param {number} index
*/
  set_flipping(index: number): void;
/**
* @param {number} index
* @returns {number}
*/
  get_flip_state(index: number): number;
/**
* @returns {boolean}
*/
  all_same(): boolean;
/**
* @param {boolean} flipped
*/
  step_flip_single_to_value(flipped: boolean): void;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
}
/**
*/
export class TransformMatrix {
  free(): void;
/**
* @returns {TransformMatrix}
*/
  static new(): TransformMatrix;
/**
* @param {TransformMatrix} other
* @returns {TransformMatrix}
*/
  multiply(other: TransformMatrix): TransformMatrix;
/**
* @param {number} tx
* @param {number} ty
* @returns {TransformMatrix}
*/
  translate(tx: number, ty: number): TransformMatrix;
/**
* @param {number} angle_deg
* @returns {TransformMatrix}
*/
  rotate(angle_deg: number): TransformMatrix;
/**
* @param {number} sx
* @param {number} sy
* @returns {TransformMatrix}
*/
  scale(sx: number, sy: number): TransformMatrix;
/**
* @param {number} mouse_x
* @param {number} mouse_y
* @param {number} x
* @param {number} y
* @param {number} flip_progress
* @returns {TransformMatrix}
*/
  apply_transformations(mouse_x: number, mouse_y: number, x: number, y: number, flip_progress: number): TransformMatrix;
/**
*/
  a: number;
/**
*/
  b: number;
/**
*/
  c: number;
/**
*/
  d: number;
/**
*/
  e: number;
/**
*/
  f: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_grid_free: (a: number, b: number) => void;
  readonly grid_new: (a: number, b: number) => number;
  readonly grid_set_flipping: (a: number, b: number) => void;
  readonly grid_get_flip_state: (a: number, b: number) => number;
  readonly grid_all_same: (a: number) => number;
  readonly grid_step_flip_single_to_value: (a: number, b: number) => void;
  readonly grid_width: (a: number) => number;
  readonly grid_height: (a: number) => number;
  readonly __wbg_transformmatrix_free: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_a: (a: number) => number;
  readonly __wbg_set_transformmatrix_a: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_b: (a: number) => number;
  readonly __wbg_set_transformmatrix_b: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_c: (a: number) => number;
  readonly __wbg_set_transformmatrix_c: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_d: (a: number) => number;
  readonly __wbg_set_transformmatrix_d: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_e: (a: number) => number;
  readonly __wbg_set_transformmatrix_e: (a: number, b: number) => void;
  readonly __wbg_get_transformmatrix_f: (a: number) => number;
  readonly __wbg_set_transformmatrix_f: (a: number, b: number) => void;
  readonly transformmatrix_new: () => number;
  readonly transformmatrix_multiply: (a: number, b: number) => number;
  readonly transformmatrix_translate: (a: number, b: number, c: number) => number;
  readonly transformmatrix_rotate: (a: number, b: number) => number;
  readonly transformmatrix_scale: (a: number, b: number, c: number) => number;
  readonly transformmatrix_apply_transformations: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly triangle_height: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
