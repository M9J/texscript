export async function load() {
  const splash = await import("./lib/splash.js");
  await splash.loadSplash();
}