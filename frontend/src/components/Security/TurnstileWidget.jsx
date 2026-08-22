import React from "react";
import { Turnstile } from "@marsidev/react-turnstile";

// Cloudflare Turnstile Official Demo/Testing Site Key (Always Passes & shows success checkmark)
const CLOUDFLARE_DEMO_SITE_KEY = "1x00000000000000000000AA";

const TurnstileWidget = ({ onSuccess, onError, onExpire, theme = "dark" }) => {
  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || CLOUDFLARE_DEMO_SITE_KEY;

  return (
    <div className="my-1.5 flex justify-center w-full">
      <div className="border border-white/60 rounded-md p-0 overflow-hidden flex justify-center items-center h-[65px] w-[300px]">
        <Turnstile
          siteKey={siteKey}
          onSuccess={(token) => {
            if (onSuccess) onSuccess(token);
          }}
          onError={(err) => {
            console.error("Turnstile Widget Error:", err);
            if (onError) onError(err);
          }}
          onExpire={() => {
            if (onExpire) onExpire();
          }}
          options={{
            theme: theme, // 'dark' | 'light' | 'auto'
            size: "normal",
          }}
        />
      </div>
    </div>
  );
};

export default TurnstileWidget;
