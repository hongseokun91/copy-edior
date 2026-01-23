import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://copy-editor.vercel.app/sitemap.xml', // 배포 URL에 맞춰 수정 필요
    };
}
