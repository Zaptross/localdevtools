type RequestFnParams = {
  path: string;
  query?: Record<string, string>;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
};

type RequestParams = RequestFnParams & { method: string };

async function request({ method, path, query, body, headers }: RequestParams) {
  const url =
    "http://localhost:5678" +
    path +
    (query ? "?" + new URLSearchParams(query).toString() : "");

  const strBody = body ? JSON.stringify(body) : undefined;

  // console.log({ method, path, query, body, headers, url, strBody });

  return await fetch(url, {
    method,
    headers,
    body: strBody,
  });
}

const requests = {
  get: (params: RequestFnParams) => request({ ...params, method: "GET" }),
  post: (params: RequestFnParams) => request({ ...params, method: "POST" }),
  delete: (params: RequestFnParams) => request({ ...params, method: "DELETE" }),
};

export default requests;
