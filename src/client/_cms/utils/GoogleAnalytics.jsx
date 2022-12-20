import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GoogleAnalytics = () => {
  const location = useLocation();
  const measurementID =
    process.env.NODE_ENV && process.env.NODE_ENV === "development"
      ? ""
      : "G-2PR3YSKDFW";
  if (measurementID) {
    ReactGA.initialize(measurementID);
    ReactGA.send({ hitType: "pageview", page: location.pathname });
    // console.log(location.pathname);
  }
  return null;
};
export default GoogleAnalytics;
