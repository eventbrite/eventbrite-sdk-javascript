import {BaseApi} from './baseApi';

enum OrganizationVertical {
    Default,
    Music,
}

export interface Organization {
    id: string;
    name: string;
    imageId: string;
    locale?: string;
    vertical?: OrganizationVertical;
}

export interface PaginatedOrganizationResponse {
    pagination: {
        object_count: number;
        page_number: number;
        page_size: number;
        page_count: number;
        continuation: string;
        has_more_items: boolean;
    };
    organizations: Organization[];
}

/**
 * API for working with Organizations
 */
export class OrganizationsApi extends BaseApi<PaginatedOrganizationResponse> {
    getByUser(userId: string) {
        return this.request(`/users/${userId}/organizations/`);
    }
}
