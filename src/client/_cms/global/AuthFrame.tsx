import React, { useState, useEffect, useMemo, createContext } from "react";
import PropTypes from "prop-types";
import { ServerHandler } from "./functions/ServerHandler";

export const Profile = createContext({
  profile: {},
  setProfile: () => {},
});
export const Token = createContext({
  token: "",
  setToken: () => {},
});

//required when authorization is important to app functionality
const AuthFrame = ({ app }: any) => {
  const [token, setToken]: any = useState({});
  const thisToken = useMemo(() => ({ token, setToken }), [token]);
  useEffect(() => {
    let isMounted = true;
    const getLocalStorage = localStorage
      ? localStorage.getItem("authToken")
      : null;
    if (getLocalStorage && isMounted) setToken(JSON.parse(getLocalStorage));

    return () => {
      isMounted = false;
    };
  }, []);

  const [profile, setProfile]: any = useState({});
  const thisUserProfile = useMemo(() => ({ profile, setProfile }), [profile]);

  useEffect(() => {
    const checkUserStatus = async () => {
      ServerHandler({
        endpoint: "/auth/user",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "x-requesttoken": "session",
          //Authorization: token ? "Bearer " + token : "",
        },
      }).then((response) => {
        if (response.status === 200) {
          setProfile(response.profile);
        } else {
          setProfile({ status: false });
        }
      });
    };
    checkUserStatus();
  }, [token]);
  // console.log(profile);

  return (
    <Token.Provider value={thisToken}>
      <Profile.Provider value={thisUserProfile}>{app}</Profile.Provider>
    </Token.Provider>
  );
};
export default AuthFrame;

AuthFrame.propTypes = {
  app: PropTypes.element,
};
