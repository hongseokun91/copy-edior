
const CATEGORY_EMOJIS: Record<string, string[]> = {
    "식당/카페": ["🍕", "🍔", "☕", "🍺", "🥢", "🥗", "🍰", "🍳"],
    "뷰티/헬스": ["💅", "💄", "💇‍♀️", "🧘‍♂️", "✨", "💖", "🌿", "💪"],
    "학원/교육": ["📚", "✏️", "🎓", "💯", "🏫", "📝", "💡", "🧠"],
    "default": ["📢", "🎉", "✨", "🎁", "🔥", "✅", "📍"]
};

export function getEmojiForCategory(category: string): string {
    let key = "default";
    const cat = category.replace(" ", "");

    if (['식당', '카페', '베이커리', '식당/카페'].some(k => cat.includes(k))) key = "식당/카페";
    else if (['뷰티', '헬스', '미용', '네일', '헤어', '운동', '뷰티/헬스'].some(k => cat.includes(k))) key = "뷰티/헬스";
    else if (['학원', '교육', '공부', '과외', '클래스', '학원/교육'].some(k => cat.includes(k))) key = "학원/교육";

    const emojis = CATEGORY_EMOJIS[key];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

export function enhanceExpression(slots: Record<string, any>, category: string): Record<string, any> {
    const newSlots = { ...slots };

    // Add Emoji to Headline if not present
    const mainEmoji = getEmojiForCategory(category);

    if (typeof newSlots.HEADLINE === 'string') {
        newSlots.HEADLINE = `${mainEmoji} ${newSlots.HEADLINE}`;
    }

    // Add Bullet point decoration (replace standard bullets if we wanted, but here just ensure they look good)
    // For now, just Headline decoration is high impact.

    return newSlots;
}
