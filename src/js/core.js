/**
 * Created by USER on 10.07.2015.
 */
var resources = require("./resources.js");
var Sprite = require("./sprite.js");

//resources
function loadResources(urls) {
    "use strict";
    resources.load(urls);
}

function getResource(url) {
    "use strict";
    return resources.get(url);
}

function onResourcesReady(func) {
    "use strict";
    resources.onReady(func);
}

//sprite
function createSprite(url, pos, size, speed, frames, dir, once) {
    "use strict";
    return new Sprite(url, pos, size, speed, frames, dir, once);
}

module.exports = {
    loadResources: loadResources,
    getResource: getResource,
    onResourcesReady: onResourcesReady
};

