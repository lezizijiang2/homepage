/**
 * Alas - AzurLaneAutoScript
 *
 * Alas is an automation tool for Azur Lane game.
 * It uses PyWebIO for its web interface, which runs on a configurable port (default 22267).
 *
 * Since Alas's web UI is WebSocket-based (PyWebIO), traditional REST API integration
 * is not available. The widget embeds the Alas WebUI via iframe.
 *
 * Widget configuration example:
 * - alas:
 *     src: http://alas-host:22267
 *     widget:
 *       type: alas
 *       src: http://alas-host:22267
 *       allowScrolling: no
 *       refreshInterval: 300000
 */

const widget = {};

export default widget;
