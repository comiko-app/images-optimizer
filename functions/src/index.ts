import * as functions from 'firebase-functions';
import axios from 'axios';

const cors = require('cors')({origin: true});
const key = functions.config().api.key;

function compressImage(url: string) {
    const options =
        {
            url: '/shrink',
            method: 'post', // default
            baseURL: 'https://api.tinify.com',

            data: {
                'source': {'url': url}
            },

            auth: {
                username: 'api',
                password: key
            },
            headers: {'Content-Type': 'application/json'},
            responseType: 'json', // default
        };

    return axios.request(options).then(function (response) {
        return response.data.output.url;
    });
}

function compressMultipleImages(images) {
    return Promise.all(images.map(data => compressImage(data.url)
            .then(url => {
                return {
                    id: data.id,
                    'url': url
                };
            })
            .catch(e => console.log(e))
        )
    )
}

export const optimizeImages = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (request.method === 'POST') {
            const images = request.body;
            compressMultipleImages(images).then(data => response.json(data));
        }
    });
});
