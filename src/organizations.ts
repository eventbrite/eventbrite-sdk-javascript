import {BaseApi} from './baseApi';
import {PaginatedResponse} from './types';

export interface Organization {
    id: string;
    name: string;
    imageId: string;
    locale?: string;
    vertical?: 'Default' | 'Music';
}

/**
 * API for working with Organizations
 */
export class OrganizationsApi extends BaseApi<PaginatedResponse<Organization>> {
    getByUser(userId: string) {
        return this.request(`/users/${userId}/organizations/`);
    }
}
