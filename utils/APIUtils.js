class APIUtils {

    constructor(requestContext, requestLoginData) {
        this.requestContext = requestContext;
        this.requestLoginData = requestLoginData;
    }

    async getToken() {
        const requestResponse = await this.requestContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: this.requestLoginData
    });
    const token = (await requestResponse.json()).token;
    console.log("🚀 ~ file: webApiTest1.spec.js:14 ~ test.beforeAll ~ token", token);
    return token;
    }

    async createOrder(placeOrderPayload) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.requestContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
        data: placeOrderPayload,
        headers: {
            'Authorization': response.token,
            'Content-Type': 'application/json'
        }
    });

    const orderResJson = await orderResponse.json();
    console.log("🚀 ~ file: webApiTest1.spec.js:31 ~ test.beforeAll ~ orderResJson", orderResJson);
    response.orderId = orderResJson.orders[0];
    return response;
    }
}

module.exports = { APIUtils };