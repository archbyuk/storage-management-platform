import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "images.rawpixel.com",
        ]
    }, 
    experimental: {
        serverActions: {
            bodySizeLimit: "50MB",
        }
    }
};

export default nextConfig;
