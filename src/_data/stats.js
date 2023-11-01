const EleventyFetch = require('@11ty/eleventy-fetch');
require('dotenv').config();


const siteId = 'ginger.wtf';
const token = process.env.AUTHORIZATION;
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

const plausibleStart = '2022-11-01';

// toISOString returns something like this: 2023-11-01T21:21:26.654Z
// so we split on the `T` for the date only
const plausibleEnd = new Date().toISOString().split('T')[0]

module.exports = async function() {
    
    const requestUrl = `${endpoint}?site_id=${siteId}&period=custom&date=${plausibleStart},${plausibleEnd}&metrics=pageviews`;

    const fetchObj = await EleventyFetch(requestUrl, {
        type: 'json',
        duration: '1d',
        fetchOptions: {
            headers: {
                Authorization: 'Bearer '+token,
            }
        }
    });

    return fetchObj.results
}