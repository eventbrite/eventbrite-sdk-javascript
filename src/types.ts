export interface SdkConfig {
    token?: string;
    baseUrl?: string;
}
export interface Sdk {
    request: (apiPath: string, options?: RequestInit) => Promise<{}>;
}

export interface ArgumentErrors {
    [key: string]: [string];
}
export interface ParsedResponseError {
    error: string;
    description: string;
    argumentErrors: ArgumentErrors;
}
export interface JSONResponseData {
    error?: string;
    error_description?: string;
    error_detail?: {
        ARGUMENTS_ERROR?: ArgumentErrors;
        [propName: string]: any;
    };
}
