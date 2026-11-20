const express = require("express");
const app = express(); // create express app
const { createProxyMiddleware } = require("http-proxy-middleware");

const qbitHost = process.env.QBIT_HOST || "http://localhost:8080";

// qBittorrent decides if a client must log in by the source address it sees, so a
// LAN whitelist never matches requests coming through this proxy (they all arrive
// from the container/host address). QBIT_FORWARD_CLIENT_IP=true forwards the real
// browser address with X-Forwarded-For instead. Requires qBittorrent 5.x with
// "Reverse proxy support" enabled and this host listed in WebUI/TrustedReverseProxiesList.
const forwardClientIp = process.env.QBIT_FORWARD_CLIENT_IP === "true";

app.use(express.static("../release/public"));

app.use(
  "/api",
  createProxyMiddleware({
    target: qbitHost,
    changeOrigin: true,
    xfwd: forwardClientIp,
    // With reverse proxy support qBittorrent validates the origin against
    // X-Forwarded-Host, so the browser's own Referer/Origin has to pass through.
    // Without it, the forced Referer is what keeps the Host header check happy.
    ...(forwardClientIp ? {} : { headers: { referer: qbitHost } }),
  })
);

app.listen(parseInt(process.env.STANDALONE_SERVER_PORT || '8081'), () => {
  console.log(`server started on port ${process.env.STANDALONE_SERVER_PORT || '8081'}`);
});
