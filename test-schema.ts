import { flyerFormSchema } from './src/lib/schemas';

try {
    console.log('Schema:', flyerFormSchema);
    console.log('Keys:', Object.keys(flyerFormSchema.shape));
    const result = flyerFormSchema.safeParse({
        category: '식당/카페',
        goal: '오픈',
        name: '테스트',
        contactType: 'phone',
    });
    console.log('Parse result:', result.success);
} catch (e) {
    console.error('Schema error:', e);
}
