const required = {
  supabaseUrl: "NEXT_PUBLIC_SUPABASE_URL",
  supabaseAnonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  supabaseServiceRoleKey: "SUPABASE_SERVICE_ROLE_KEY",
  databaseUrl: "DATABASE_URL",
  directUrl: "DIRECT_URL",
  stripeSecretKey: "STRIPE_SECRET_KEY",
  stripePublishableKey: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  upstashRedisRestUrl: "UPSTASH_REDIS_REST_URL",
  upstashRedisRestToken: "UPSTASH_REDIS_REST_TOKEN",
} as const;

function read(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return read(required.supabaseUrl);
  },
  get supabaseAnonKey() {
    return read(required.supabaseAnonKey);
  },
  get supabaseServiceRoleKey() {
    return read(required.supabaseServiceRoleKey);
  },
  get stripeSecretKey() {
    return read(required.stripeSecretKey);
  },
  get stripePublishableKey() {
    return read(required.stripePublishableKey);
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET || "";
  },
  get stripeProPriceId() {
    return process.env.STRIPE_PRO_PRICE_ID || "";
  },
  get stripeMaxPriceId() {
    return process.env.STRIPE_MAX_PRICE_ID || "";
  },
  get upstashRedisRestUrl() {
    return read(required.upstashRedisRestUrl);
  },
  get upstashRedisRestToken() {
    return read(required.upstashRedisRestToken);
  },
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL || "";
  },
};
