import { QualityOS } from "../src/index.js";

async function main() {
  const os = await QualityOS.create({ configDir: new URL("../config/", import.meta.url) });

  const res = os.run({
    moduleKey: "CORE_SERVICE",
    industryKey: "PRINT_PRODUCTION",
    draft: "정성 가득한 프리미엄 원스톱 서비스로 최고의 결과를 보장합니다. 문의/예약 주세요!",
    brandStyle: {
      tone: "차분/전문",
      formality: "합니다",
      ctaDefault: "상담으로 확인해보세요.",
      blacklist: ["최고","100%","보장","무조건","부작용 없음"]
    },
    proofPack: {
      process: ["요청 확인", "사양/옵션 확정", "시안/교정", "제작", "검수/출고"],
      policy: ["작업 시작 전 최종 견적 확정", "예외: 긴급 제작/추가 공정은 별도 안내"]
    },
    maxPasses: 3
  });

  console.log("=== FINAL COPY ===");
  console.log(res.finalCopy);
  console.log("\n=== SCORECARD ===");
  console.log(JSON.stringify(res.scorecard, null, 2));
  console.log("\n=== DEBUG ===");
  console.log(JSON.stringify(res.debug, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
