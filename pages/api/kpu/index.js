import KPUService from "../../../services/kpu";

export default async function handler(req, res) {
    try {
        const id = req.query.id;
        if (!id) throw new Error('id is required')
        const data = await KPUService.getTpsOnCities(id)

        if (req.method === "GET") {
            res.status(200).json({ success: true, data, message: "succesfully get data" });
        } else {
            res.status(405).json({ success: false, message: "Method Not Allowed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "internal server error" });
    }
}