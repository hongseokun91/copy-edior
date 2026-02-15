
import { generateAndRefine } from "../src/lib/copy/engine";
import { FlyerInputs } from "../src/types/flyer";
import fs from "fs";
import path from "path";

const TEST_CASES = [
    { cat: "식당/카페", tone: "friendly", name: "엄마손맛집", offer: "음료수 서비스", goal: "단골 유치" },
    { cat: "뷰티/헬스", tone: "premium", name: "럭셔리헤어", offer: "첫방문 30%", goal: "신규 모집" },
    { cat: "학원/교육", tone: "direct", name: "서울대수학", offer: "무료 레벨테스트", goal: "원생 모집" },
    { cat: "부동산", tone: "premium", name: "성실공인", offer: "중개수수료 할인", goal: "매물 접수" },
    { cat: "쇼핑몰", tone: "friendly", name: "데일리룩", offer: "전상품 무료배송", goal: "매출 증대" },
    { cat: "행사", tone: "direct", name: "지역축제", offer: "선착순 입장", goal: "참가 유도" },
    { cat: "기업", tone: "premium", name: "테크솔루션", offer: "무료 컨설팅", goal: "B2B 영업" },
    { cat: "기타", tone: "friendly", name: "동네세탁소", offer: "이불빨래 1+1", goal: "홍보" },
    { cat: "식당/카페", tone: "direct", name: "불타는곱창", offer: "소주 1병 공짜", goal: "회식 유치" },
    { cat: "뷰티/헬스", tone: "friendly", name: "튼튼헬스", offer: "PT 1회 무료", goal: "회원권 판매" },
] as const;

async function run() {
    console.log("Measuring V1 Baseline (10 Cases)...");
    const results = [];

    for (const t of TEST_CASES) {
        const inputs: FlyerInputs = {
            category: t.cat,
            name: t.name,
            offer: t.offer,
            goal: t.goal,
            period: "기간한정",
            contactType: "phone",
            contactValue: "010-0000-0000"
        };

        console.log(`Generating for ${t.name}...`);
        try {
            // Check A variant as rep
            const res = await generateAndRefine(t.cat, t.tone as any, inputs, 'A');
            results.push({
                input: t,
                output: res
            });
        } catch (e) {
            console.error(`Failed ${t.name}`, e);
        }
    }

    const outPath = path.join(process.cwd(), "V1_Baseline_Samples.json");
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`Saved baseline to ${outPath}`);
}

run();
