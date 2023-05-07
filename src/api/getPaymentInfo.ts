import {API_URL} from "../constants";

export default function (qrId: string): Promise<"NEW" | "PAID"> {
    const url = API_URL + "/payments/info/" + qrId;
    // @ts-ignore
    return fetch(url, {method: "GET"})
        .then((response) => response.text());
}