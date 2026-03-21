import type { ReactNode } from "react";

// next-intl이 [locale]/layout.tsx에서 html/body를 렌더링하므로
// 루트 레이아웃은 children만 패스스루
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
