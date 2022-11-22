import { ServerHandler } from "./ServerHandler";

const AppSignOut = () => {
  ServerHandler({
    endpoint: "/auth/account/sign-out",
    method: "get",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  }).then((res) => {
    console.log("res signing out", res);
    if (res.status === 200) return window.location.replace("/");
  });
};
export { AppSignOut };
