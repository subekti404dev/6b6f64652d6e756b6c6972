
const axios = require("axios");
const qs = require("qs");

const url = `https://encode-decode.com/aes256-encrypt-online/`;
const sessid = `71f43ca63a478afb1349ef9575409484`;

export const encrypt = async (text, key) => {
    const resp1 = await axios.request({
            method: "get",
            maxBodyLength: Infinity,
            url,
            headers: { 
                "authority": "encode-decode.com", 
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", 
                "accept-language": "en-US,en;q=0.6", 
                "sec-ch-ua": `"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"`, 
                "sec-ch-ua-mobile": "?0", 
                "sec-ch-ua-platform": `"macOS"`, 
                "sec-fetch-dest": "document", 
                "sec-fetch-mode": "navigate", 
                "sec-fetch-site": "none", 
                "sec-fetch-user": "?1", 
                "sec-gpc": "1", 
                "upgrade-insecure-requests": "1", 
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", 
                "Cookie": `PHPSESSID=${sessid}`
            }
        })

    const phpSesssion = (resp1?.headers?.["set-cookie"]?.[0] || "").split(";")?.[0]    
    
    
    const resp2 = await axios.request( {
        method: "post",
        maxBodyLength: Infinity,
        url,
        headers: { 
          "content-type": "application/x-www-form-urlencoded", 
          "cookie": phpSesssion || `PHPSESSID=${sessid}`,
          "origin": "https://encode-decode.com", 
          "referer": "https://encode-decode.com/aes256-encrypt-online/",     
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        data : qs.stringify({
          "encryption[algorithm]": "aes256",
          "encryption[sourceText]": text,
          "encryption[destinationText]": "",
          "encryption[secret]": key,
          "encryption[encrypt]": "",
          "encryption[_token]": "pPE384Gm-PPeKrlGGJ06RpxgHsKmQd93xE_9vfTBx2g" 
        })
      })    
  
    const extractedText = (resp2.data || "").split(`<textarea id="encryption_destinationText"`)?.[1]?.split("</textarea>")?.[0]?.split(">")?.[1];

    return extractedText
    
    
}
export const encryptWahyuWay = async (text, key) =>{
    return encrypt(Buffer.from(text).toString("base64"), key)
}

