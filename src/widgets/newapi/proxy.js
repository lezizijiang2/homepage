import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import { httpProxy } from "utils/proxy/http";

const logger = createLogger("newapiProxyHandler");

function aggregate(records) {
  let quota = 0;
  let tokenUsed = 0;
  let count = 0;
  for (const r of records) {
    quota += r.quota || 0;
    tokenUsed += r.token_used || 0;
    count += r.count || 0;
  }
  return { quota, tokenUsed, count };
}

export default async function newapiProxyHandler(req, res) {
  const { group, service, index } = req.query;

  if (!group || !service) {
    logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service, index);
  if (!widget) {
    logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${widget.key}`,
  };
  if (widget.userId) {
    headers["New-Api-User"] = `${widget.userId}`;
  }

  const now = Math.floor(Date.now() / 1000);
  const d = new Date();
  const monthStart = Math.floor(new Date(d.getUTCFullYear(), d.getUTCMonth(), 1).getTime() / 1000);
  const todayStart = now - (now % 86400);

  const apiCall = (url) => httpProxy(new URL(url), { method: "GET", headers });

  const [
    [dataStatus, , dataRaw],
    [userStatus, , userRaw],
  ] = await Promise.all([
    apiCall(`${widget.url}/api/data/?username=&start_timestamp=${monthStart}&end_timestamp=${now}&default_time=day`),
    apiCall(`${widget.url}/api/user/self`),
  ]);

  if (dataStatus !== 200 || userStatus !== 200) {
    logger.error("New API error: data=%d user=%d", dataStatus, userStatus);
    return res.status(500).json({ error: "Failed to fetch New API data" });
  }

  let data;
  let user;
  try {
    data = JSON.parse(dataRaw.toString());
    user = JSON.parse(userRaw.toString());
  } catch (e) {
    logger.error("Failed to parse New API response: %s", e);
    return res.status(500).json({ error: "Invalid response from New API" });
  }

  if (!data.success || !user.success) {
    return res.status(500).json({ error: data.message || user.message || "API error" });
  }

  const records = data.data || [];
  const todayRecords = records.filter((r) => r.created_at >= todayStart);

  const todayAgg = aggregate(todayRecords);
  const monthAgg = aggregate(records);

  const quotaPerUnit = widget.quotaPerUnit || 500000;
  const exchangeRate = widget.exchangeRate || 1;
  const currencySymbol = widget.currencySymbol || "¥";

  const toAmount = (quota) => (quota / quotaPerUnit) * exchangeRate;

  return res.status(200).json({
    todayQuota: toAmount(todayAgg.quota),
    todayTokens: todayAgg.tokenUsed,
    todayRequests: todayAgg.count,
    monthQuota: toAmount(monthAgg.quota),
    monthTokens: monthAgg.tokenUsed,
    monthRequests: monthAgg.count,
    totalRequests: user.data.request_count,
    currencySymbol,
  });
}
