import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ClientApp } from "./ClientApp";
import "./index.css";

export function render(url: string | Partial<Location>) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <ClientApp />
    </StaticRouter>
  );
}
