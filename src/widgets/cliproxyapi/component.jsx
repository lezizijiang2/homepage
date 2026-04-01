import classNames from "classnames";
import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import useWidgetAPI from "utils/proxy/use-widget-api";

/**
 * CLIProxyAPI widget component
 *
 * Displays usage statistics from the CLIProxyAPI proxy service.
 * CLIProxyAPI provides OpenAI/Gemini/Claude/Codex compatible API interfaces.
 *
 * Management API returns:
 * {
 *   "usage": {
 *     "total_requests": 24,
 *     "success_count": 22,
 *     "failure_count": 2,
 *     "total_tokens": 13890,
 *     ...
 *   },
 *   "failed_requests": 2
 * }
 */
export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;
  const { refreshInterval = 10000 } = widget;

  const { data, error } = useWidgetAPI(widget, null, {
    refreshInterval: Math.max(1000, refreshInterval),
  });

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!data) {
    return (
      <Container service={service}>
        <Block label="Total Requests" value="-" />
        <Block label="Success" value="-" />
        <Block label="Failed" value="-" />
        <Block label="Tokens" value="-" />
      </Container>
    );
  }

  const usage = data?.usage || {};
  const totalRequests = usage.total_requests || 0;
  const successCount = usage.success_count || 0;
  const failureCount = usage.failure_count || 0;
  const totalTokens = usage.total_tokens || 0;

  return (
    <Container service={service}>
      <Block label="Total Requests" value={t("common.number", { value: totalRequests })} />
      <Block label="Success" value={t("common.number", { value: successCount })} />
      <Block label="Failed" value={t("common.number", { value: failureCount })} />
      <Block label="Tokens" value={t("common.number", { value: totalTokens })} />
    </Container>
  );
}
