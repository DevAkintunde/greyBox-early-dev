import { Cms } from "./_cms/Cms";
import App from "./app/App";
import { Route, Routes } from "react-router-dom";
import AuthFrame from "./_cms/global/AuthFrame";

const ClientRouter = () => {
  return (
    <div className="client-container">
      <Routes>
        <Route path="/*" index element={<App />} />
        <Route path="admin/*" element={<Cms />} />
      </Routes>
    </div>
  );
};
 
export const ClientBundle = () => {
  return (
    <>
      <AuthFrame
        app={
          <div id="client" className="relative scrollbar">
           <ClientRouter />
          </div>
        }
      />
    </>
  );
};
