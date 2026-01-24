import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许内网穿透访问 _next/* 资源
  // 格式：协议://IP或域名:端口
  // 如果内网穿透IP会变化，可以添加多个origin或使用固定域名
  // 例如：allowedDevOrigins: ['http://115.190.245.37:3001', 'https://your-tunnel-domain.com']
  allowedDevOrigins: [
    'http://115.190.245.37:3001',
    'https://115.190.245.37:3001',
    // 如果使用内网穿透域名，取消下面的注释并替换为你的域名
    // 'https://your-tunnel-domain.com',
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  // 开发环境下允许跨域
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
