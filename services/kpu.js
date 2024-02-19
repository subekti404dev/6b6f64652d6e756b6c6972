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
        const arr = cityId.split('');
        const provinceId = arr[0] + arr[1];
        // console.log(provinceId);
        let tps = [];
        const districts = await KPUService.getDistrict(provinceId, cityId);
        let subdistricts = []

        const promisesSubDistrict = [];
        const promiseTps = [];

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
        // const tpsDetails = (await Promise.all(tps.map(t => KPUService.getTpsDetail(t.kode))))
        return { districts, subdistricts, tps, 
            // tpsDetails
         };
    }
}

export default KPUService;

KPUService.getTpsOnCities('3309').then(console.log)