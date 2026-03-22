/**
 * 공통 환경 변수 로더
 * 모든 파이프라인 스크립트에서 import하여 사용
 */
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ ${key}가 .env.local에 설정되지 않았습니다.`);
    process.exit(1);
  }
  return value;
}
