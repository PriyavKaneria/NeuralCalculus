let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {number} side
* @returns {number}
*/
export function triangle_height(side) {
    const ret = wasm.triangle_height(side);
    return ret;
}

const GridFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_grid_free(ptr >>> 0, 1));
/**
*/
export class Grid {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Grid.prototype);
        obj.__wbg_ptr = ptr;
        GridFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GridFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_grid_free(ptr, 0);
    }
    /**
    * @param {number} width
    * @param {number} height
    * @returns {Grid}
    */
    static new(width, height) {
        const ret = wasm.grid_new(width, height);
        return Grid.__wrap(ret);
    }
    /**
    * @param {number} index
    */
    set_flipping(index) {
        wasm.grid_set_flipping(this.__wbg_ptr, index);
    }
    /**
    * @param {number} index
    * @returns {number}
    */
    get_flip_state(index) {
        const ret = wasm.grid_get_flip_state(this.__wbg_ptr, index);
        return ret;
    }
    /**
    * @returns {boolean}
    */
    all_same() {
        const ret = wasm.grid_all_same(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} flipped
    */
    step_flip_single_to_value(flipped) {
        wasm.grid_step_flip_single_to_value(this.__wbg_ptr, flipped);
    }
    /**
    * @returns {number}
    */
    width() {
        const ret = wasm.grid_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height() {
        const ret = wasm.grid_height(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const TransformMatrixFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transformmatrix_free(ptr >>> 0, 1));
/**
*/
export class TransformMatrix {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransformMatrix.prototype);
        obj.__wbg_ptr = ptr;
        TransformMatrixFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransformMatrixFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transformmatrix_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get a() {
        const ret = wasm.__wbg_get_transformmatrix_a(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set a(arg0) {
        wasm.__wbg_set_transformmatrix_a(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get b() {
        const ret = wasm.__wbg_get_transformmatrix_b(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set b(arg0) {
        wasm.__wbg_set_transformmatrix_b(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get c() {
        const ret = wasm.__wbg_get_transformmatrix_c(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set c(arg0) {
        wasm.__wbg_set_transformmatrix_c(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get d() {
        const ret = wasm.__wbg_get_transformmatrix_d(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set d(arg0) {
        wasm.__wbg_set_transformmatrix_d(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get e() {
        const ret = wasm.__wbg_get_transformmatrix_e(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set e(arg0) {
        wasm.__wbg_set_transformmatrix_e(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get f() {
        const ret = wasm.__wbg_get_transformmatrix_f(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set f(arg0) {
        wasm.__wbg_set_transformmatrix_f(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {TransformMatrix}
    */
    static new() {
        const ret = wasm.transformmatrix_new();
        return TransformMatrix.__wrap(ret);
    }
    /**
    * @param {TransformMatrix} other
    * @returns {TransformMatrix}
    */
    multiply(other) {
        _assertClass(other, TransformMatrix);
        const ret = wasm.transformmatrix_multiply(this.__wbg_ptr, other.__wbg_ptr);
        return TransformMatrix.__wrap(ret);
    }
    /**
    * @param {number} tx
    * @param {number} ty
    * @returns {TransformMatrix}
    */
    translate(tx, ty) {
        const ret = wasm.transformmatrix_translate(this.__wbg_ptr, tx, ty);
        return TransformMatrix.__wrap(ret);
    }
    /**
    * @param {number} angle_deg
    * @returns {TransformMatrix}
    */
    rotate(angle_deg) {
        const ret = wasm.transformmatrix_rotate(this.__wbg_ptr, angle_deg);
        return TransformMatrix.__wrap(ret);
    }
    /**
    * @param {number} sx
    * @param {number} sy
    * @returns {TransformMatrix}
    */
    scale(sx, sy) {
        const ret = wasm.transformmatrix_scale(this.__wbg_ptr, sx, sy);
        return TransformMatrix.__wrap(ret);
    }
    /**
    * @param {number} mouse_x
    * @param {number} mouse_y
    * @param {number} x
    * @param {number} y
    * @param {number} flip_progress
    * @returns {TransformMatrix}
    */
    apply_transformations(mouse_x, mouse_y, x, y, flip_progress) {
        const ret = wasm.transformmatrix_apply_transformations(this.__wbg_ptr, mouse_x, mouse_y, x, y, flip_progress);
        return TransformMatrix.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;



    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('landing_page_test_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
