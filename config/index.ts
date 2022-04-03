const dev = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

// export const server = dev ? "http://localhost:3000" : "http://localhost:3000";

export const server: any = dev
  ? "http://localhost:3000"
  : "https://www.meallocker.com";
