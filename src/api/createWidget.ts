import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

export const createWidget = (templateId: string, templateProps: string) : Promise<string> => {
    const url = API_URL + "/widgets/create";

    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно создать виджет неавторизованным");

    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
        body: JSON.stringify({templateId, templateProps})
    }).then((response) => response.text());
};
