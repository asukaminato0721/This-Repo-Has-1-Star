export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/example-path") {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      let payload;
      try {
        payload = await request.json();
      } catch (error) {
        return new Response('Invalid JSON', { status: 400 });
      }

      const repository = payload.repository;
      const repositoryUrl = repository.url;
      const stars = repository.stargazers_count;

      const newName = `This-Repo-Has-${stars}-Star${stars !== 1 ? 's' : ''}`;

      const headers = {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'User-Agent': 'Cloudflare-Worker',
        'Accept': 'application/vnd.github.v3+json',
      };

      const data = {
        name: newName,
      };

      try {
        const response = await fetch(repositoryUrl, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify(data),
        });

        return new Response("OK", { status: response.status });
      } catch (error) {
        return new Response('Failed to update repository', { status: 500 });
      }
    } else {
      return new Response("", { status: 404 });
    }
  },
};
