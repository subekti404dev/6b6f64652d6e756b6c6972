// import Axios from "axios";
const Axios = require("axios");

const baseUrl = `https://sirekap-obj-data.kpu.go.id`;
const KPUService = {
    getProvinces: async () => {
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/0.json`);
        return res.data || []
    },
    getCities: async (provinceId) => {
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/${provinceId}.json`);
        return res.data || []
    },
    getDistrict: async (provinceId, cityId) => {
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/${provinceId}/${cityId}.json`);
        return res.data || []
    },
    getSubDistrict: async (provinceId, cityId, districtId) => {
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/${provinceId}/${cityId}/${districtId}.json`);
        return res.data || []
    },
    getTps: async (provinceId, cityId, districtId, subDistrictId) => {
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/${provinceId}/${cityId}/${districtId}/${subDistrictId}.json`);
        return res.data || []
    },
    getTpsDetail: async (tpsId) => {
        const provinceId = tpsId.slice(0, 2);
        const cityId = tpsId.slice(0, 4);
        const districtId = tpsId.slice(0, 6);
        const subDistrictId = tpsId.slice(0, 10);
        const res = await Axios.get(`${baseUrl}/wilayah/pemilu/ppwp/${provinceId}/${cityId}/${districtId}/${subDistrictId}/${tpsId}.json`);
        return res.data;
    },
    getTpsOnCities: async (cityId) => {
        const provinceId = cityId.slice(0, 2);
        const [provinces, cities] = await Promise.all([KPUService.getProvinces(), KPUService.getCities(provinceId)]);

        const province = provinces?.find(p => p.kode === provinceId);
        const city = cities?.find(c => c.kode === cityId);
        let tps = [];
        const districts = await KPUService.getDistrict(provinceId, cityId);
        let subdistricts = []

        const promisesSubDistrict = [];
        const promiseTps = [];
        const promiseTpsDetails = [];


        for (const d of districts) {
            promisesSubDistrict.push(KPUService.getSubDistrict(provinceId, cityId, d.kode))
        }
        (await Promise.all(promisesSubDistrict)).map((res, i) => {
            subdistricts = [...subdistricts, ...(res).map(x => ({ ...x, districtId: districts?.[i]?.['kode'] }))]
        });

        for (const sd of subdistricts) {
            promiseTps.push(KPUService.getTps(provinceId, cityId, sd.districtId, sd.kode))
        }
        (await Promise.all(promiseTps)).map((res, i) => {
            tps = [...tps, ...(res || [])]
        });
        const result = tps.map((t) => {
            const cityId = t.kode?.slice(0, 4);
            const districtId = t.kode?.slice(0, 6);
            const district = districts?.find(d => d.kode === districtId)
            const subDistrictId = t.kode?.slice(0, 10);
            const subDistrict = subdistricts?.find(d => d.kode === subDistrictId)
            return {
                id: t.id,
                name: t.nama,
                code: t.kode,
                subDistrict: {
                    id: subDistrict.id,
                    name: subDistrict.nama,
                    code: subDistrict.kode
                },
                district: {
                    id: district.id,
                    name: district.nama,
                    code: district.kode
                },
                city: {
                    id: city.id,
                    name: city.nama,
                    code: city.kode
                },
                province: {
                    id: province.id,
                    name: province.nama,
                    code: province.kode
                },
            }
        })

        return result;
    }
}

export default KPUService;
