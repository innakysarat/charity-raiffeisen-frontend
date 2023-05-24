import {API_URL} from "../constants";

type GetSubscriptionInfoResponse = {
    status: "NEW" | "PAID"
}
type SubscriptionInfoResponse = {
    status: "INACTIVE" | "SUBSCRIBED"
}
export default function (subscriptionId: string): Promise<"INACTIVE" | "SUBSCRIBED"> {
    const url = API_URL + "/subscriptions/info/" + subscriptionId;

    // @ts-ignore
    return fetch(url, {method: "GET"})
        .then((response) => response.text());
}
