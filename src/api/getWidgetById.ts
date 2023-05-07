import {API_URL} from "../constants";

type GetWidgetByIdResponse = {
    sbpMerchantId: string,
    templateId: string,
    templateProps: string
}

export function getWidgetById (widgetId: string): Promise<GetWidgetByIdResponse> {
    const url = API_URL + "/widgets/get/" + widgetId;

    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    }).then(response => response.json());
    // if (widgetId !== "a") return Promise.resolve({
    //     sbpMerchantId: "MA977181",
    //     templateId: "first",
    //     templateProps: JSON.stringify({title: "Фонд Хабенского",
    //         mainColor: "#64458E"})
    //     // templateProps: JSON.stringify({title: "Название фонда",
    //     //     mainColor: "#FDDB00"})
    // })
    //
    // return Promise.resolve({
    //     sbpMerchantId: "MA977181",
    //     templateId: "second",
    //     templateProps: JSON.stringify({title: "Фонд помощи уставшим студентам",
    //         snackbarText: "Спасибо! Мы Вас не забудем"})
    // })
}