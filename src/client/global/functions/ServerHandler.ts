import { REST_ADDRESS } from "../../utils/app.config";

interface Fetcher {
  endpoint: string;
  headers?: object;
  method?: string;
  body?: object;
  id?: string;
  waitFor?: string;
}
const ServerHandler = async (data: string | Fetcher | Fetcher[]) => {
  /*   return fetch(url, {
    method: method,
  })
    .then((res) => {
      console.log("almost there");
      console.log("res: ", res);
      return res.json();
    })
    .then((resJson: any) => {
      console.log("resJosn: ", resJson);
      return resJson;
    });
}; */

  // only GET, POST, PATCH and DELETE are support.
  const serverAddress = REST_ADDRESS;
  if (!serverAddress)
    return {
      log: "No server provided in app.config.",
    };
  //   console.log(data);
  //   const data = {
  //     endpoint: "node/article",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //        Authorization: "Bearer jjjsijjisjis",
  //     },
  //     body: {},
  //     method: "get",
  //     id: "req1",
  //     waitFor: "", // will be available once the dependency feature of async calls have been implemented.
  //   };

  //case 1; check if input data is a single object
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data !== null
  ) {
    //convert imported headers toLowerCase to compare and avoid duplicates with defaults.
    let importedHeaders = {};
    if (data.headers && Object.keys(data.headers).length > 0) {
      let importedHeadersKeys = Object.keys(data.headers);
      importedHeadersKeys.forEach((key: string) => {
        let keyValue: string = data.headers![key as keyof typeof data.headers];
        if (keyValue) {
          importedHeaders = {
            ...importedHeaders,
            [key.toLowerCase()]: keyValue.toLowerCase(),
          };
        }
      });
    }

    let headers: any = {
      accept: "application/vnd.api+json",
      "content-type": "application/vnd.api+json",
      ...importedHeaders,
    };
    if (
      headers["content-type"] &&
      headers["content-type"].includes("form-data")
    ) {
      delete headers["content-type"];
    }
    let body = data.body
      ? headers["content-type"] && headers["content-type"].includes("json")
        ? JSON.stringify(data.body)
        : data.body
      : null;

    const getMethod = {
      method: "GET",
      headers: headers,
    };
    const postMethod = {
      method: "POST",
      headers: headers,
      body: body,
    };
    const patchMethod = {
      method: "PATCH",
      headers: headers,
      body: body,
    };
    const deleteMethod = {
      method: "DELETE",
      headers: headers,
      //body: body,
    };

    const methodCall =
      data.method && data.method.toLowerCase() === "post"
        ? postMethod
        : data.method && data.method.toLowerCase() === "patch"
        ? patchMethod
        : data.method && data.method.toLowerCase() === "delete"
        ? deleteMethod
        : getMethod;

    return fetch(
      serverAddress + (data.endpoint ? data.endpoint : ""),
      methodCall
    )
      .then((res: any) => {
        //console.log("res", res);
        if (!data.endpoint) {
          return { log: "No endpoint specified." };
        } else {
          if (res.status === 200) {
            if (res.headers.get("content-type")?.includes("application/json"))
              return res.json();
            return null;
          } else {
            return {
              status: res.status,
              statusText: res.statusText ? res.statusText : null,
            };
          }
        }
      })
      .then((resjson) => {
        //console.log("resjson", resjson);
        return resjson;
      });
  }
  //case 2; check if imported data is an array of multiple objects
  else if (data && Array.isArray(data) && typeof data !== "string") {
    //case 2... allow to wait for dependent async to be implemented later;
    let promises: any[] = [];
    let promisesId: any[] = [];
    data.forEach((thisCall: Fetcher) => {
      let importedHeaders = {};
      if (thisCall.headers && Object.keys(thisCall.headers).length > 0) {
        let importedHeadersKeys = Object.keys(thisCall.headers);
        importedHeadersKeys.forEach((key: string) => {
          let keyValue: string =
            thisCall.headers![key as keyof typeof thisCall.headers];
          if (keyValue) {
            importedHeaders = {
              ...importedHeaders,
              [key.toLowerCase()]: keyValue.toLowerCase(),
            };
          }
        });
      }

      let headers = {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
        ...importedHeaders,
      };
      let body = thisCall.body ? JSON.stringify(thisCall.body) : null;

      const getMethod = {
        method: "GET",
        headers: headers,
      };
      const postMethod = {
        method: "POST",
        headers: headers,
        body: body,
      };
      const patchMethod = {
        method: "PATCH",
        headers: headers,
        body: body,
      };
      const deleteMethod = {
        method: "DELETE",
        headers: headers,
        //body: body,
      };

      const methodCall =
        thisCall.method && thisCall.method.toLowerCase() === "post"
          ? postMethod
          : thisCall.method && thisCall.method.toLowerCase() === "patch"
          ? patchMethod
          : thisCall.method && thisCall.method.toLowerCase() === "delete"
          ? deleteMethod
          : getMethod;

      let promiseCall = () =>
        new Promise(function (resolve) {
          resolve(fetch(serverAddress + thisCall.endpoint, methodCall));
        });
      promises.push(
        promiseCall().then((res: any) => {
          if (res && res.status) {
            if (res.status === 200) {
              if (res.headers.get("content-type")?.includes("application/json"))
                return res.json();
              return null;
            } else {
              return {
                status: res.status,
                statusText: res.statusText ? res.statusText : null,
              };
            }
          } else {
            return {
              status: 500,
              statusText: "Error: Something went wrong!",
            };
          }
        })
      );
      if (thisCall.id) {
        promisesId.push(thisCall.id);
      } else {
        promisesId.push(promisesId.length + 1);
      }
    });
    let getPromises = async () => {
      const reservedPromisesId = promisesId;
      promisesId = await Promise.all(promises);
      let requestedData = {};
      for (let i = 0; i < promisesId.length; i++) {
        requestedData = {
          [reservedPromisesId[i]]: promisesId[i],
          ...requestedData,
        };
      }
      return requestedData;
    };
    return getPromises();
  }
  //case 3; check if imported data is just an endpoint uri string
  else if (data) {
    return fetch(serverAddress + data, {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
    })
      .then((res: any) => {
        if (res.status === 200) {
          if (res.headers.get("content-type")?.includes("application/json"))
            return res.json();
          return null;
        } else {
          return {
            status: res.status,
            statusText: res.statusText ? res.statusText : null,
          };
        }
      })
      .then((resjson) => {
        return resjson;
      })
      .catch(() => {
        return {
          log: "Endpoint not found.",
        };
      });
  }
  //case 4; export base /jsonapi endpoint if empty data
  else {
    return fetch(serverAddress!, {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
    })
      .then((res) => {
        if (res.headers.get("content-type")?.includes("application/json"))
          return res.json();
        return null;
      })
      .then((resjson) => {
        return resjson;
      });
  }
};

export { ServerHandler };
