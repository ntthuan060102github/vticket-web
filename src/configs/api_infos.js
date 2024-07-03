const VTICKET_API_SERVICE_INFOS = {
    account: {
        staging: {
            domain: "https://vticket-account-service.onrender.com/apis/vticket-account-service/v1"
        },
        production: {
            domain: "https://vticket-account-service.onrender.com/apis/vticket-account-service/v1"
        },
        local: {
            domain: "https://vticket-account-service.onrender.com/apis/vticket-account-service/v1"
        }
    },
    event: {
        staging: {
            domain: "https://vticket-event-service.onrender.com/apis/vticket-event-service/v1"
        },
        production: {
            domain: "https://vticket-event-service.onrender.com/apis/vticket-event-service/v1"
        },
        local: {
            domain: "https://vticket-event-service.onrender.com/apis/vticket-event-service/v1"
        }
    },
    logging: {
        staging: {
            domain: "https://vticket-logging-service.onrender.com/apis/vticket-logging-service/v1"
        },
        production: {
            domain: "https://vticket-logging-service.onrender.com/apis/vticket-logging-service/v1"
        },
        local: {
            domain: "https://vticket-logging-service.onrender.com/apis/vticket-logging-service/v1"
        }
    },
    payment: {
        staging: {
            domain: "https://vticket-payment-service.onrender.com/apis/vticket-payment-service/v1"
        },
        production: {
            domain: "https://vticket-payment-service.onrender.com/apis/vticket-payment-service/v1"
        },
        local: {
            domain: "https://vticket-payment-service.onrender.com/apis/vticket-payment-service/v1"
        }
    },
}

module.exports = VTICKET_API_SERVICE_INFOS
