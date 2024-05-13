import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script type="application/javascript" dangerouslySetInnerHTML={{__html: `
          (function(d,k,u) {
            var sc="https://cdn.partnerjam.com/sdk/pj.umd.js",
            h=d.getElementsByTagName('head')[0],s=d.createElement('script');
            s.async=true;s.charset='utf-8';s.type='text/javascript';
            s.onload=function(){PJ.init(k,u)};s.src=sc;h.appendChild(s);
          })(document, 123456789); // <-- Shopify APP_ID
        `}}/>
      </body>
    </html>
  );
}
