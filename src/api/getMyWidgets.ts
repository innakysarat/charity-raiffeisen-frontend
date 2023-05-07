import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

export const getMyWidgets = (): Promise<string[]> => {
    const url = API_URL + "/widgets/widget/my";

    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно создать виджет неавторизованным");

    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    }).then((response) => response.json());
}