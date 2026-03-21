import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 로케일 프리픽스가 필요한 경로만 매칭
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
