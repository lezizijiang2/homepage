import classNames from "classnames";
import Container from "components/services/widget/container";
import { useEffect, useState } from "react";

/**
 * Alas widget component
 *
 * Embeds the Alas (AzurLaneAutoScript) WebUI via iframe.
 * Alas uses PyWebIO which is WebSocket-based, so direct API integration
 * is not available. The widget provides seamless integration by embedding
 * the Alas web interface directly.
 */
export default function Component({ service }) {
  const [refreshTimer, setRefreshTimer] = useState(0);

  const { widget } = service;

  useEffect(() => {
    if (widget?.refreshInterval) {
      const interval = widget.refreshInterval < 1000 ? 1000 : widget.refreshInterval;
      const timer = setInterval(() => {
        setRefreshTimer((prev) => prev + 1);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [widget?.refreshInterval]);

  const scrollingDisableStyle =
    widget?.allowScrolling === "no" ? { pointerEvents: "none", overflow: "hidden" } : {};

  const classes = widget?.classes || "h-60 sm:h-60 md:h-60 lg:h-60 xl:h-60 2xl:h-72";

  return (
    <Container service={service}>
      <div
        className={classNames(
          "bg-theme-200/50 dark:bg-theme-900/20 rounded-sm m-1 flex-1 flex flex-col items-center justify-center text-center scheme-light",
          "service-block"
        )}
      >
        <iframe
          src={widget?.src}
          key={`${widget?.name}-${refreshTimer}`}
          name={widget?.name}
          title={widget?.name || "Alas"}
          allow={widget?.allowPolicy || "accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment"}
          allowFullScreen={widget?.allowfullscreen}
          referrerPolicy={widget?.referrerPolicy || "same-origin"}
          loading={widget?.loadingStrategy || "lazy"}
          scrolling={widget?.allowScrolling || "no"}
          style={scrollingDisableStyle}
          className={`rounded-sm w-full ${classes}`}
        />
      </div>
    </Container>
  );
}
