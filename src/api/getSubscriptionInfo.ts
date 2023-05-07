import {API_URL} from "../constants";

type GetSubscriptionInfoResponse = {
    status: "NEW" | "PAID"
}
type SubscriptionInfoResponse = {
    status: "INACTIVE" | "SUBSCRIBED"
}
export default function (subscriptionId: string): Promise<"INACTIVE" | "SUBSCRIBED"> {
// export default function (subscriptionId: string): Promise<SubscriptionInfoResponse> {
     //const url = API_URL + "/qrs/subscriptionInfo/{subscriptionId}" + subscriptionId;
    const url = API_URL + "/subscriptions/info/" + subscriptionId;
    //const url = API_URL + "/subscriptions/getQr" + subscriptionId;
    // return fetch(url, {
    //     method: "GET",
    //     headers: {
    //         'Accept': 'application/json'
    //     }
    // }).then((response) => response.json());

    // @ts-ignore
    return fetch(url, {method: "GET"})
        .then((response) => response.text());
}
