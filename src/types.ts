import {UserApi} from './users';
import {OrganizationsApi} from './organizations';

export interface SdkConfig {
    token?: string;
    baseUrl?: string;
}

export type JSONRequest<T = {}> = (
    apiPath: string,
    options?: RequestInit
) => Promise<T>;

export interface Sdk {
    request: JSONRequest;
    users: UserApi;
    organizations: OrganizationsApi;
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
        [propName: string]: any;
        ARGUMENTS_ERROR?: ArgumentErrors;
    };
}

export interface Pagination {
    objectCount: number;
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    continuation: string;
    hasMoreItems: boolean;
}

export interface PaginatedResponse<T> {
    [key: string]: T[] | Pagination | undefined;
    pagination?: Pagination;
}
