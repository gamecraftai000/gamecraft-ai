// next.config.js - GÜNCELLENMİŞ VERSİYON
/** @type {import('next').NextConfig} */
module.exports = {
  // Mevcut environment variables'larınızı koruyun
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Yeni eklenen ayarlar:
  reactStrictMode: true,
  swcMinify: true,
  
  // GÖRSEL OPTIMIZASYONU - AI generated görseller için KRİTİK!
  images: {
    domains: [
      'cdn.stablediffusionapi.com',
      'stablediffusionapi.com',
      'images.unsplash.com'
    ],
    unoptimized: true // AI generated görseller için gerekli
  },
  
  // CORS AYARLARI - API route'ları için
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}
