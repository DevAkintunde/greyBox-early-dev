import React, { useState, useEffect, useMemo, createContext } from "react";
import PropTypes from "prop-types";
import {
  REST_ADDRESS,
  authenticationMethod,
  saveTokenToLocalStorage,
} from "../utils/app.config";
import { ServerHandler } from "./functions/ServerHandler";

export const Auth = createContext({
  isAuth: false,
  setIsAuth: () => {},
});
export const Profile = createContext({
  profile: {},
  setProfile: () => {},
});
export const Token = createContext({
  token: "",
  setToken: () => {},
});

const Authoriser = ({ app }: any) => {
  //console.log(window.localStorage.getItem("sessionToken"));
  let localSessionToken; /* localStorage
    ? localStorage.getItem("sessionToken")
    : ""; */
  const sessionToken: { type: string; key: string } | null = localSessionToken
    ? JSON.parse(localSessionToken)
    : null;
  //sessionToken is used for all types of authentication
  //session token is set as 'session' while 'access_token' is used for authenticated users.
  const [token, setToken]: any = useState({
    type:
      sessionToken && sessionToken.type ? sessionToken.type : "anon_session",
    key: sessionToken && sessionToken.key ? sessionToken.key : "",
  });
  const userToken = useMemo(() => ({ token, setToken }), [token]);

  const [isAuth, setIsAuth]: any = useState(false);
  const thisAuthentication = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);

  const [profile, setProfile]: object | any = useState({
    isAuth: false,
    uuid: "",
    display_name: "",
    mail: "",
    name: "",
  });
  const thisUserProfile = useMemo(() => ({ profile, setProfile }), [profile]);

  useEffect(() => {
    const getUserUUId = async () => {
      ServerHandler({
        endpoint: "account",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          //Authorization: "Bearer " + token.key,
        },
      }).then((response) => {
        //console.log("getUserUUId", response);
        if (response.status === 200)
          setProfile({
            isAuth: true,
            uuid: response.data.id,
            display_name: response.data.attributes.display_name,
            name: response.data.attributes.name,
            mail: response.data.attributes.mail,
          });
      });
    };
    //if (isAuth) {
    getUserUUId();
    //}
  }, [token]);

  // console.log(profile);

  useEffect(() => {
    const bearerHeader = {
      "Content-type": "application/json",
      //Authorization: "Bearer " + (token && token.key ? token.key : ""),
    };
    const checkLoggedInStatus = async () => {
      ServerHandler({
        headers: bearerHeader,
        endpoint: "account/login_status",
      }).then((response) => {
        // console.log(outputData);
        if (response !== 1) {
          setProfile({});
          if (token.type !== "anon_session" || !token.key) {
            getAnonymousSession();
          }
        } else {
          setIsAuth(true);
        }
      });
    };

    if (!isAuth) {
      checkLoggedInStatus();
    } else if (!token || !token.key) {
      setIsAuth(false);
    }

    function getAnonymousSession() {
      ServerHandler({
        endpoint: "session/token",
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then((response) => {
        setToken({
          type: "anon_session",
          key: response,
        });
        if (saveTokenToLocalStorage) {
          localStorage.setItem(
            "sessionToken",
            JSON.stringify({
              type: "anon_session",
              key: response,
            })
          );
        }
      });
    }
  }, [token, isAuth]);

  return (
    <Token.Provider value={userToken}>
      <Auth.Provider value={thisAuthentication}>
        <Profile.Provider value={thisUserProfile}>{app}</Profile.Provider>
      </Auth.Provider>
    </Token.Provider>
  );
};
export default Authoriser;

Authoriser.propTypes = {
  app: PropTypes.element,
};
