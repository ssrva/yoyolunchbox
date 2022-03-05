const environments = {
    dev: {
        cashFreeAppId: "924989d1ebeeaf3afe3c26a9c89429",
        cashFreeEnv: "TEST",
        amplitudeApiKey: "b44c704741b0612222e9791302c40894",
        baseUrl: "https://baqg6112pd.execute-api.us-east-1.amazonaws.com/production"
    },
    production: {
        cashFreeAppId: "140167899dad3f999080d3ff3b761041",
        cashFreeEnv: "PROD",
        amplitudeApiKey: "5a597bc88401f8636ba7402669507433",
        baseUrl: "https://baqg6112pd.execute-api.us-east-1.amazonaws.com/production"
    },
    common: {}
}

const getEnvironmentVariables = () => {
    if (__DEV__) {
        return { ...environments.common, ...environments.dev };
    }
    return { ...environments.common, ...environments.production };
}

const isProduction = () => {
    return !__DEV__;
}

export default getEnvironmentVariables