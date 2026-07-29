// Minimal typings for the Google Identity Services (GIS) ID-token flow.
// Loaded at runtime from https://accounts.google.com/gsi/client — this only
// describes the subset of `window.google.accounts.id` we call.
// Docs: https://developers.google.com/identity/gsi/web/reference/js-reference

interface GoogleCredentialResponse {
  /** The ID token (a JWT) to send to our backend for verification. */
  credential: string;
  select_by?: string;
}

interface GoogleIdInitializeConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface GoogleIdButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdInitializeConfig): void;
  renderButton(parent: HTMLElement, options: GoogleIdButtonOptions): void;
  prompt(): void;
  cancel(): void;
  disableAutoSelect(): void;
}

interface Window {
  google?: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}
