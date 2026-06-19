declare global {
  var __mockGeminiApi: boolean | undefined;
  var __carbonosStorageOverridden: boolean | undefined;
  var window: Window;
  var localStorage: Storage;
}
export {};
