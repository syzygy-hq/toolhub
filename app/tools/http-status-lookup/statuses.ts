export interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: "Informational" | "Success" | "Redirection" | "Client Error" | "Server Error";
}

function categoryFor(code: number): HttpStatus["category"] {
  if (code < 200) return "Informational";
  if (code < 300) return "Success";
  if (code < 400) return "Redirection";
  if (code < 500) return "Client Error";
  return "Server Error";
}

const RAW: [number, string, string][] = [
  [100, "Continue", "The initial part of the request has been received and the client should continue."],
  [101, "Switching Protocols", "The server is switching protocols as requested by the client."],
  [200, "OK", "The request succeeded."],
  [201, "Created", "The request succeeded and a new resource was created."],
  [202, "Accepted", "The request has been accepted for processing, but isn't complete yet."],
  [204, "No Content", "The request succeeded but there's no content to return."],
  [206, "Partial Content", "Only part of the resource is being returned, as requested via a Range header."],
  [301, "Moved Permanently", "The resource has permanently moved to a new URL."],
  [302, "Found", "The resource temporarily resides at a different URL."],
  [303, "See Other", "The response can be found at a different URL using a GET request."],
  [304, "Not Modified", "The resource hasn't changed since the last request — use the cached version."],
  [307, "Temporary Redirect", "The resource temporarily resides at a different URL; method must not change."],
  [308, "Permanent Redirect", "The resource permanently resides at a different URL; method must not change."],
  [400, "Bad Request", "The server couldn't understand the request due to invalid syntax."],
  [401, "Unauthorized", "Authentication is required and has failed or not been provided."],
  [403, "Forbidden", "The server understood the request but refuses to authorize it."],
  [404, "Not Found", "The server can't find the requested resource."],
  [405, "Method Not Allowed", "The request method isn't supported for this resource."],
  [408, "Request Timeout", "The server timed out waiting for the request."],
  [409, "Conflict", "The request conflicts with the current state of the resource."],
  [410, "Gone", "The resource is no longer available and won't be available again."],
  [413, "Payload Too Large", "The request body is larger than the server is willing to process."],
  [414, "URI Too Long", "The requested URI is longer than the server is willing to interpret."],
  [415, "Unsupported Media Type", "The media format of the request isn't supported."],
  [418, "I'm a Teapot", "The server refuses to brew coffee because it is, permanently, a teapot."],
  [422, "Unprocessable Entity", "The request was well-formed but contains semantic errors."],
  [429, "Too Many Requests", "The client has sent too many requests in a given time."],
  [500, "Internal Server Error", "The server encountered an unexpected condition."],
  [501, "Not Implemented", "The server doesn't support the functionality required."],
  [502, "Bad Gateway", "The server, acting as a gateway, got an invalid response upstream."],
  [503, "Service Unavailable", "The server isn't ready to handle the request, often due to overload."],
  [504, "Gateway Timeout", "The server, acting as a gateway, didn't get a timely response upstream."],
];

export const statuses: HttpStatus[] = RAW.map(([code, name, description]) => ({
  code,
  name,
  description,
  category: categoryFor(code),
}));
