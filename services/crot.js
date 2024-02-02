import Axios from "axios"

const queries = ["cantik", "hijab", "toket", "toge"]
const caches = []

const CrotService = {
    getLinks: async () => {
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