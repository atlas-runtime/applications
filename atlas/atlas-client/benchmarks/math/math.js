function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function mult(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}

let math = {};
math.add = add;
math.sub = sub;
math.mult = mult;
math.div = div;
export {math};
