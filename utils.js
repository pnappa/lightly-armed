

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
