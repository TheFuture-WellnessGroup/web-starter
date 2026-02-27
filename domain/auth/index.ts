// Auth server instance (서버 코드에서만 사용)
export { auth } from "./auth";

// Auth client (클라이언트 컴포넌트에서 사용)
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
} from "./auth-client";
