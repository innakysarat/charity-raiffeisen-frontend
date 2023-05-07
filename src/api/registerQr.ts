import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

type RegisterQrResponse = {
    qrId: string,
    qrUrl: string
}

export default function (sbpMerchantId: string, amount: number): Promise<RegisterQrResponse> {
    const url = API_URL + "/qrs/getQr";

    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно зарегистрировать QR неавторизованным");

    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
            //'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJNQTYyMjk3NiIsImp0aSI6ImM5MTBjNGU4LTRhZmMtNDBlMS04ZGU3LWVlODg2N2JiOGU3NCJ9.rnPFEsixy9Wr4GhxT9D9s8dlBg5dRKWMLPfxl48oHAo"
        },
        body: JSON.stringify({
            amount,
            sbpMerchantId
        })
    }).then((response) => response.json());
}
