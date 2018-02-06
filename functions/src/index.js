"use strict";
exports.__esModule = true;
var functions = require("firebase-functions");
var axios_1 = require("axios");
var cors = require('cors')({ origin: true });
var key = functions.config().api.key;
function compressImage(url) {
    var options = {
        url: '/shrink',
        method: 'post',
        baseURL: 'https://api.tinify.com',
        data: {
            'source': { 'url': url }
        },
        auth: {
            username: 'api',
            password: key
        },
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json'
    };
    return axios_1["default"].request(options).then(function (response) {
        return response.data.output.url;
    });
}
function compressMultipleImages(images) {
    return Promise.all(images.map(function (data) { return compressImage(data.url)
        .then(function (url) {
        return {
            id: data.id,
            'url': url
        };
    })["catch"](function (e) { return console.log(e); }); }));
}
exports.optimizeImages = functions.https.onRequest(function (request, response) {
    cors(request, response, function () {
        if (request.method === 'POST') {
            var images = request.body;
            compressMultipleImages(images).then(function (data) { return response.json(data); });
        }
    });
});
