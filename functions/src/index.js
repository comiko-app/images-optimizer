"use strict";
exports.__esModule = true;
var functions = require("firebase-functions");
var axios_1 = require("axios");
var urlOfImage = "https://firebasestorage.googleapis.com/v0/b/comiko-3916d.appspot.com/o/photos%2FGuillaume%20Wagner.jpg?alt=media&token=aac4acaf-6b27-4f19-8451-3901d2990578";
var key = "8QvKLKSn67Llb3wcGzAWYzG0Y2-uLh3c";
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
var sampleImages = [
    { 'id': '12312', 'url': urlOfImage },
    { 'id': '12313', 'url': urlOfImage }
];
compressMultipleImages(sampleImages).then(function (data) { return console.log(data); });
exports.optimizeImages = functions.https.onRequest(function (request, response) {
    if (request.method === "POST") {
        var images = request.body;
        console.log("Some logging! " + JSON.stringify(images));
        compressMultipleImages(images).then(function (data) { return response.json(data); });
    }
});
