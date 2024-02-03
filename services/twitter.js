const Axios = require("axios");

const guestAuthToken = `AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA`

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

const getGtFromTwitter = async () => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.twitter.com/1.1/guest/activate.json',
        headers: {
            'authorization': `Bearer ${guestAuthToken}`,
        }
    };

    const resp = await Axios.request(config);
    return resp?.data?.guest_token;
}


const getPosts = async (userId) => {
    try {
        const gt = await getGtFromTwitter(),
            count = 100
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.twitter.com/graphql/kfCWRG0roHHybC2Z9TwrOQ/UserTweets?variables=%7B%22userId%22%3A%22${userId}%22%2C%22count%22%3A${count}%2C%22includePromotedContent%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
            headers: {
                'authority': 'api.twitter.com',
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.7',
                'authorization': `Bearer ${guestAuthToken}`,
                'content-type': 'application/json',
                'origin': 'https://twitter.com',
                'referer': 'https://twitter.com/',
                'sec-ch-ua': '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'sec-gpc': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'x-twitter-active-user': 'yes',
                'x-twitter-client-language': 'en',
                'X-Client-Transaction-Id':
                    generateRandomString(64),
                'X-Guest-Token': gt ||
                    '1753723707636249080'
            }
        };

        const resp = await Axios.request(config)
        const data = (resp?.data?.data?.user?.result?.timeline_v2?.timeline?.instructions?.[1]?.entries || []).map(x => {
            const legacy = x.content?.itemContent?.tweet_results?.result?.legacy;
            const text = legacy?.full_text?.split('\nhttps')?.[0]?.trim();
            const urls = (legacy?.entities?.urls || []).map(u => u.expanded_url);
            return {
                text,
                urls
            }

        })
        return data
    } catch (error) {
        console.log(error.response.data);
        throw error
    }
}

const getLinks = async (userId) => {
    const posts = await getPosts(userId);
    let urls = [];
    (posts || []).map(x => {
        urls = [...urls, ...x.urls]
    });
    return urls;
}
const userId = `778187867516309504`

const TwitterService = {
    getLinks: async () => {
        return getLinks(userId);
    },
    getRandomLink: async () => {
        const links = await TwitterService.getLinks();
        return links[Math.floor(Math.random() * links.length)];
    }
}
export default TwitterService

// getLinks(userId).then(console.log)
// getPosts()
// getGtFromTwitter()