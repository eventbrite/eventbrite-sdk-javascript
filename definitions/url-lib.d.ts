declare module "url-lib" {
  export function formatQuery(queryParams: {}): string;
  export function formatQuery(queryParamsList: Array<{}>): string;

  export function formatUrl(urlPath: string, queryParams: {}): string;
  export function formatUrl(
    urlPath: string,
    queryParamsList: Array<{}>
  ): string;

  export function parseQuery(serializedQuery: string): {};
}
