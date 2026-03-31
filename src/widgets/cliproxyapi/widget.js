/**
 * CLIProxyAPI - Proxy server for OpenAI/Gemini/Claude/Codex CLI interfaces
 *
 * CLIProxyAPI provides OpenAI/Gemini/Claude/Codex compatible API interfaces for CLI tools.
 *
 * Management API Endpoints (Base: http://localhost:8317/v0/management):
 * - GET /usage - Retrieve aggregated request metrics
 * - GET /debug - Get debug state
 * - GET /config - Get full config
 *
 * Documentation: https://github.com/router-for-me/CLIProxyAPI
 * Management API Docs: https://help.router-for.me/management/api
 *
 * Widget configuration example:
 * - cliproxyapi:
 *     src: http://192.168.31.35:8317
 *     widget:
 *       type: cliproxyapi
 *       url: http://192.168.31.35:8317
 *       key: your-management-key
 */

import genericProxyHandler from "utils/proxy/handlers/generic";

const widget = {
  api: "{url}/v0/management/usage",
  proxyHandler: genericProxyHandler,
};

export default widget;
