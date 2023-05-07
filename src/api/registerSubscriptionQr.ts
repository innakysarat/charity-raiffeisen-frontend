import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

type RegisterSubscriptionQrResponse = {
    subscriptionId: string,
    qrUrl: string
}

export default function (sbpMerchantId: string): Promise<RegisterSubscriptionQrResponse> {
    const url = API_URL + "/subscriptions/getQr";
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
            sbpMerchantId,
            subscriptionPurpose: "somePurpose"
        })
    }).then((response) => response.json());
}