import { encryptWahyuWay } from '../../../utils/enc';
import CrotService from '../../../services/crot'

export default async function handler(req, res) {
    try {
        const key = req.query.key || 'bagiBwang';
        const link = await CrotService.getRandomLink();
        if (!link) throw new Error('failed to get link');
        const encLink = await encryptWahyuWay(link, key);
        if (!encLink) throw new Error('failed to encrypt link');

        if (req.method === 'GET') {
            res.status(200).json({ success: true, message: 'succesfully get data', data: encLink });
        } else {
            res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'internal server error' });
    }
}