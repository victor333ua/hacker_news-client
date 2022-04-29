/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // generateEtags: false,
    onDemandEntries: {
        // period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 0,
        pagesBufferLength: 0,
    }
}

export default nextConfig