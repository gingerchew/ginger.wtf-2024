const EleventyFetch = require('@11ty/eleventy-fetch');
require('dotenv').config();

const siteId = 'ginger.wtf';
const token = process.env.PLAUSIBLE_AUTH_TOKEN;
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

const plausibleStart = '2022-11-01';

// toISOString returns something like this: 2023-11-01T21:21:26.654Z
// so we split on the `T` for the date only
const plausibleEnd = new Date().toISOString().split('T')[0]

module.exports = async function() {
    
    const requestUrl = `${endpoint}?site_id=${siteId}&period=custom&date=${encodeURIComponent(plausibleStart + ',' + plausibleEnd)}&metrics=pageviews`;
    console.log(requestUrl);
    const eleventyFetchOptions = {
        type: 'json',
        duration: '0s',
        fetchOptions: {
            headers: {
                Authorization: 'Bearer '+token
            }
        }
    };
    let fetchObj = {
        results: {
            pageviews: {
                value: ':('
            }
        }
    }
    try {
        fetchObj = await EleventyFetch(requestUrl, eleventyFetchOptions);
    } catch(e) {
        console.error('Error getting Plausible Stats: ', e.message);
    } finally {
        return fetchObj.results
    }

}