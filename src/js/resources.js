var imagesCache = {};
var audiosCache = {};
var readyCallbacks = [];
var resourcesLoaded = 0;

function isReady() {
    var ready = true;
    for (var k in imagesCache) {
        if (imagesCache.hasOwnProperty(k) && !imagesCache[k]) {
            ready = false;
        }
    }
    for (var k in audiosCache) {
        if (audiosCache.hasOwnProperty(k) && !audiosCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function _loadImg(url) {
    if (imagesCache[url]) {
        return imagesCache[url];
    } else {
        var img = new Image();
        img.onload = function () {
            imagesCache[url] = img;
            if (isReady()) {
                readyCallbacks.forEach(function (func) {
                    func();
                });
            }
        };
        img.src = url;
        imagesCache[url] = false;
    }
}

function _loadAudio(url) {
    if (audiosCache[url]) {
        return audiosCache[url];
    } else {
        var audio = new Audio();
        audio.addEventListener("canplay", function () {
            if (!audiosCache[url]) {
                if (isReady()) {
                    audiosCache[url] = audio;
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                } else {
                    audiosCache[url] = audio;
                }
            }
        });
        audio.src = url;
        audio.preload = "auto";
        audio.load();
        audiosCache[url] = false;
    }
}
/**
 * Load image and add them to cache
 *@param {(string|string[])} urlOfArr Array of urls
 * @see loadResources
 */
function loadImages(urlOfArr) {
    if (urlOfArr instanceof Array) {
        resourcesLoaded += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadImg(url);
        });
    } else {
        resourcesLoaded += 1;
        _loadImg(urlOfArr);
    }
}

function loadAudios(urlOfArr) {
    if (urlOfArr instanceof Array) {
        resourcesLoaded += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadAudio(url);
        });
    } else {
        resourcesLoaded += 1;
        _loadAudio(urlOfArr);
    }
}
/**
 * Get resource from cache
 * @param {string} url
 * @returns  Image
 * @see getResource
 */
function getImg(url) {
    return imagesCache[url];
}

function getAudio(url) {
    return imagesCache[url];
}
/**
 * Add function to functions which will be called then all resources loaded
 * @param func
 * @see onResourcesReady
 */
function onReady(func) {
    readyCallbacks.push(func);
}

module.exports = {
    loadImages: loadImages,
    loadAudios: loadAudios,
    getImg: getImg,
    getAudio: getAudio,
    onReady: onReady,
    isReady: isReady
};
