
const epsilon = 0.01;
// a very large number (TM) that is surely a distance we'll never deal with.
// I don't want to use maxnum, as there'll potentially be overflow issues.
const INFDIST = 1e9;

// for populating the bounds array, indicating whether there's a bounding
// box adjacent in that cardinal direction (so we can ignore them)
const northColIndex = 4;
const eastColIndex = 5;
const southColIndex = 6;
const westColIndex = 7;

function pointInRect(pX, pY, rX, rY, rW, rH) {
    return (pX >= rX && pX <= rX + rW &&
        pY >= rY && pY <= rY + rH);
}

function rectsIntersect(r1, r2) {
    return r1[0] < r2[0]+r2[2] && r1[0]+r1[2] > r2[0] && r1[1] < r2[1]+r2[3] && r1[1]+r1[3] > r2[1];
}

// if bounds are available, use them, otherwise use the default height/width
// and x,y positions
// TODO: should we populate this when loading the scene? may improve performance
function getBounds(obj) {
    var bounds = null;
    if (obj["bounds"]) { 
        bounds = obj["bounds"];
    } else {
        let objX = obj["pos"][0];
        let objY = obj["pos"][1];
        bounds = [objX, objY, obj["width"], obj["height"]];
    }

    return bounds;
}

function isZero(x, eps=epsilon) {
    return Math.abs(x) <= eps;
}

function isEq(a, b, tolerance=0.1) {
    return Math.abs(a-b) <= tolerance;
}

function colToRgbaStr(col) {
    return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3] + ')';
}

function isCollidable(obj) {
    return obj && 'oncollide' in obj;
}
