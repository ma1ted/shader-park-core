// Numbers represent type - 
// 1:float 2:vec2 3:vec3 4:vec4

export const geometryFunctions = {
    sphere: { args: [1] },
    octahedron: { args: [1] },
    pyramid: { args: [1] },
    line: { args: [3,3,1] },
    torusSegment: { args: [2, 1, 1] },
    link: { args: [1, 1, 1] },
    // box: { args: [1,1,1] },
    // torus: { args: [1,1] },
    // cylinder: { args: [1,1] },
    cone: { args: [1, 1, 1] },
    roundCone: { args: [3,3,1,1] },
    plane: { args: [1,1,1,1] },
};

export const mathFunctions = {
    nsin: { args: [1], ret:1 },
    ncos: { args: [1], ret:1 },
    round: { args: [1], ret:1 },
    hsv2rgb: { args: [3], ret:3 },
    rgb2hsv: { args: [3], ret:3 },
    toSpherical: { args: [3], ret:3 },
    fromSpherical: { args: [3], ret:3 },
    getRayDirection: { args: [], ret:3 },
    osc: { args: [1], ret:1 },
    _hash33: { args: [3], ret:1 },
    noise: { args: [3], ret:1 },
    fractalNoise: { args: [3], ret:1 },
    sphericalDistribution: { args: [3,1], ret:4 },
};

// these all have a single input/output and are overloaded for 
// all types so a list of names is all we need to generate them
export const glslBuiltInOneToOne = [
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "exp",
    "log",
    "exp2",
    "log2",
    "sqrt",
    "inversesqrt",
    "abs",
    "sign",
    "floor",
    "ceil",
    "fract",
];

// need better overloading system
export const glslBuiltInOther = {
    // overload pow somehow?
    pow: { args:[1,1], ret:1 },
    mod: { args: [1,1], ret:1 },
    min: { args: [1,1], ret:1 },
    max: { args: [1,1], ret:1 },
    atan: { args: [1,1], ret:1 },
    clamp: { args: [1,1,1], ret:1 },
    mix: { args: [1,1,1], ret:1 },
    step: { args: [1, 1], ret: 1 },
    smoothstep: { args: [1,1,1], ret:1 },
    // also overload length for vec3 and vec2?
    length: { args: [3], ret: 1 },
    distance: { args: [3,3], ret:1 },
    dot: { args: [3,3], ret: 1 },
    cross: { args: [3,3], ret:3 },
    normalize: { args: [3], ret:3 },
    reflect: { args: [3,3], ret:3 },
    refract: { args: [3,3], ret:3 },
};


let generatedJSPrimitives = '';
for (let [funcName, body] of Object.entries(geometryFunctions)) {
    let argList = [];
    let dims = body['args'];
    for (let i = 0; i < dims.length; i++) {
        argList.push(`arg_${i}`);
    }
    let args = argList.join(', ');

    //only ensureScalar on elements that are dim 1
    let ensureScaler = argList.filter((el, index) => (arg, i) => dims[i] === 1)
    .map((arg, i) => `	ensureScalar('${funcName}', ${arg});`)
    .join('\n');

    let collapsedString = argList.map(arg => ` + collapseToString(${arg}) + `).join(`', '`);
    generatedJSPrimitives +=
`
function ${funcName} (${args}) {
${ensureScaler}
    applyMode('${funcName}('+getCurrentState().p+', '${collapsedString}')');
}
`;
}

export const primitivesJS = () => generatedJSPrimitives;
