import { encryptWahyuWay } from "../../../utils/enc";
import CrotService from "../../../services/crot";
import TwitterService from "../../../services/twitter";

export default async function handler(req, res) {
    try {
        const key = req.query.key || "bagiBwang";
        const [link1, link2] = await Promise.all([CrotService.getRandomLink(), TwitterService.getRandomLink()]);
        if (!link1 || !link2) throw new Error("failed to get link");
        const link = `${link1}\n${link2}`
        const encLink = await encryptWahyuWay(link, key);
        if (!encLink) throw new Error("failed to encrypt link");

        if (req.method === "GET") {
            res.status(200).json({ success: true, message: "succesfully get data", data: encLink });
        } else {
            res.status(405).json({ success: false, message: "Method Not Allowed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "internal server error" });
    }
}