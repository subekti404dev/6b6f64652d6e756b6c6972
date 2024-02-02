import Axios from "axios";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})
let lastFetchCategories = 0, categories = [];

const caches = []

function isValidCategoriesCache(timestamp1, timestamp2) {
    const timeDifference = timestamp2 - timestamp1;
    const timeDifferenceInMinutes = timeDifference / 60000;
    return timeDifferenceInMinutes <= 5;
}

const getQueries = async () => {
    const currentTimestampInSeconds = new Date().getTime();
    const isValidCache = isValidCategoriesCache(lastFetchCategories, currentTimestampInSeconds)
    if (isValidCache) return categories;

    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM crot_categories`, (err, res) => {
            if (err) {
                return resolve([]);
            }
            const cats = (res.rows || []).map(x => x.name);
            categories = cats;
            lastFetchCategories = currentTimestampInSeconds;
            resolve(cats)
        });
    })

}

const CrotService = {
    getLinks: async () => {
        const queries = await getQueries();
        const query = queries[Math.floor(Math.random() * queries.length)];
        const res = await Axios.get(`https://doodstream.pro/search/?q=${query}`);
        const regex = /https:\/\/doodstream\.pro\/\/video\/(\w+)/g;
        let matches = ((res.data || "").match(regex) || [])
            .map((s) => s.replace("https://doodstream.pro//video/", "https://doods.pro/e/"));

        if (matches.length > 0) {
            matches.map((m) => {
                if (!caches.includes(m)) {
                    caches.push(m);
                }
            })
        } else {
            return matches;
        }

        return matches || []
    },
    getRandomLink: async () => {
        const links = await CrotService.getLinks();
        return links[Math.floor(Math.random() * links.length)];
    }
}

export default CrotService;