import type {Readable} from "svelte/store";
import {derived} from "svelte/store";
import registerQr from "../api/registerQr";
import sleep from "../util/sleep";
import registerPaymentSubscriptionQr from "../api/registerPaymentSubscriptionQr";
import getPaymentInfo from "../api/getPaymentInfo";
import getSubscriptionInfo from "../api/getSubscriptionInfo";


type QrState = {
    url: string | null,
    loading: boolean,
    isPaid: boolean
};

export default function qrStore(sbpMerchantId: string, amount: Readable<number>, isSubscription: Readable<boolean>) {
    return derived(
        [isSubscription, amount],
        function ([$isSubscription, $amount], set) {

            set({url: null, loading: true, isPaid: false});

            let actual = true;

            (async () => {
                if (!$isSubscription) {
                    const data = await registerQr(sbpMerchantId, $amount);

                    if (!actual) return;

                    set({url: data.qrUrl, loading: false, isPaid: false});

                    while (actual) {
                        const status = await getPaymentInfo(data.qrId);

                        if (!actual) return;
                        if (status === "PAID") {
                            set({
                                url: data.qrUrl,
                                loading: false,
                                isPaid: true
                            });
                            return;
                        }

                        await sleep(5000);
                    }
                } else {
                    const data = await registerPaymentSubscriptionQr(sbpMerchantId, $amount);

                    if (!actual) return;

                    set({url: data.qrUrl, loading: false, isPaid: false});
                    while (actual) {
                        const status = await getSubscriptionInfo(data.subscriptionId);
                        //const status = await getPaymentInfo(data.qrId);
                        if (!actual) return;
                        if (status === "SUBSCRIBED") {
                            set({
                                url: data.qrUrl,
                                loading: false,
                                isPaid: true
                            });
                            return;
                        }

                        await sleep(5000);
                    }
                }
            })()

            return function calledBeforeNewValueGot() {
                actual = false;
            }
        }) as Readable<QrState>;
}
