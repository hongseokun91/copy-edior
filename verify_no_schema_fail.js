
const TARGET_URL = 'http://localhost:3000/api/generate';
const TOTAL_RUNS = 30;

const MOCK_INPUT = {
    type: 'flyer',
    tone: 'friendly',
    styleId: 'mock-style',
    inputs: {
        category: '음식점',
        goal: '신메뉴 홍보',
        name: '맛있는 식당',
        offer: '신메뉴 20% 할인',
        period: '1월 한달간',
        contactType: 'phone',
        contactValue: '010-1234-5678'
    }
};

async function runTest() {
    console.log(`[STRESS TEST] Starting ${TOTAL_RUNS} runs for schema stability...`);
    let fails = 0;
    let success = 0;

    for (let i = 1; i <= TOTAL_RUNS; i++) {
        try {
            const start = Date.now();
            const response = await fetch(TARGET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(MOCK_INPUT)
            });
            const duration = Date.now() - start;
            const data = await response.json();

            if (response.status === 200 && data.variants?.A?.HEADLINE) {
                success++;
                process.stdout.write(`.`);
            } else {
                fails++;
                console.error(`\n[FAIL] Run ${i}: Status ${response.status}`, data);
            }
        } catch (e) {
            fails++;
            console.error(`\n[FAIL] Run ${i}: ${e.message}`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n\n[RESULT] Total: ${TOTAL_RUNS}, Success: ${success}, Fails: ${fails}`);
    if (fails > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTest();
