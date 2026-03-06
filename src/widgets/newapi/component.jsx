import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: statData, error: statError } = useWidgetAPI(widget, "stat");

  if (statError) {
    return <Container service={service} error={statError} />;
  }

  if (!statData) {
    return (
      <Container service={service}>
        <Block label="newapi.todayQuota" />
        <Block label="newapi.todayTokens" />
        <Block label="newapi.todayRequests" />
      </Container>
    );
  }

  const symbol = statData.currencySymbol;

  return (
    <Container service={service}>
      <Block
        label="newapi.todayQuota"
        value={`${symbol}${t("common.number", { value: statData.todayQuota, maximumFractionDigits: 2 })}`}
      />
      <Block label="newapi.todayTokens" value={t("common.number", { value: statData.todayTokens })} />
      <Block label="newapi.todayRequests" value={t("common.number", { value: statData.todayRequests })} />
    </Container>
  );
}
