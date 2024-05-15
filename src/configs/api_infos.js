const VTICKET_API_SERVICE_INFOS = {
    account: {
        staging: {
            domain: "https://vticket-account-service.onrender.com/apis/doris-account-service/v1"
        },
        production: {
            domain: "https://vticket-account-service.onrender.com/apis/doris-account-service/v1"
        },
        local: {
            domain: "https://vticket-account-service.onrender.com/apis/doris-account-service/v1"
        }
    },
    event: {
        staging: {
            domain: "https://vticket-event-service.onrender.com/apis/doris-event-service/v1"
        },
        production: {
            domain: "https://vticket-event-service.onrender.com/apis/doris-event-service/v1"
        },
        local: {
            domain: "https://vticket-event-service.onrender.com/apis/doris-event-service/v1"
        }
    },
    logging: {
        staging: {
            domain: "https://vticket-account-service.onrender.com/apis"
        },
        production: {
            domain: "https://vticket-account-service.onrender.com/apis"
        },
        local: {
            domain: "https://vticket-account-service.onrender.com/apis"
        }
    },
    payment: {
        staging: {
            domain: "https://vticket-account-service.onrender.com/apis"
        },
        production: {
            domain: "https://vticket-account-service.onrender.com/apis"
        },
        local: {
            domain: "https://vticket-account-service.onrender.com/apis"
        }
    },
}

module.exports = VTICKET_API_SERVICE_INFOS