const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "ygmpo";

const nextConfig = {
  transpilePackages: ["@ygmpo/shared"],
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined
};

export default nextConfig;