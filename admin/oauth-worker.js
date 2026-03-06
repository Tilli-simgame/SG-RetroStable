/**
 * GitHub OAuth Proxy for Decap CMS
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Initial auth request
    if (url.pathname === "/auth") {
      const provider = "github";
      const scope = "repo,user";
      const redirect_uri = `${url.origin}/callback`;
      
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=${scope}&redirect_uri=${redirect_uri}`;
      return Response.redirect(authUrl, 302);
    }

    // 2. Callback from GitHub
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await response.json();
      
      // Decap CMS expects a message back to the opener window
      const content = `
        <script>
          const receiveMessage = (message) => {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: data.access_token,
                provider: "github",
              })}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        </script>
      `;

      return new Response(content, {
        headers: { "content-type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
