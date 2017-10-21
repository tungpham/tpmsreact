/**
 * Convert query string to object
 * @param str
 */
export function parseQueryStringToObject(str) {
  return JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
}