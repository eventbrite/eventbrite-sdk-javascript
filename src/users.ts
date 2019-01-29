import {BaseApi} from './baseApi';

export interface Email {
    email?: string;
    primary?: boolean;
}

export interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    imageId?: string;
    email?: Email[];
}

/**
 * API for working with Users
 */
export class UserApi extends BaseApi<User> {
    /**
     * Get the logged in users info
     */
    me() {
        return this.request('/users/me/');
    }

    /**
     * Get user by ID
     * @param id {string}
     */
    get(id: string) {
        return this.request(`/users/${id}/`);
    }
}
