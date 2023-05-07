import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

type RegisterSubscriptionQrResponse = {
    qrId: string,

    qrStatus: string,
    qrUrl: string,
    subscriptionId: string
}

export default function (sbpMerchantId: string, amount: number): Promise<RegisterSubscriptionQrResponse> {
    const url = API_URL + "/qrs/getSubscriptionQr";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно зарегистрировать QR неавторизованным");
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
        body: JSON.stringify({
            amount,
            sbpMerchantId,
            subscription: {
                subscriptionPurpose: "somePurpose"
            }
        })
    }).then((response) => response.json());
}
