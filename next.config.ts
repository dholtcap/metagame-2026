import type { NextConfig } from "next";
import { validateEnv } from "./src/env";

// Warn (don't fail) on missing required env vars at build / dev start.
validateEnv();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
