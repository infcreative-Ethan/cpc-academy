import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cpcacademy.app",
  appName: "CPC Academy",
  webDir: "out",
  android: {
    allowMixedContent: false,
  },
};

export default config;
