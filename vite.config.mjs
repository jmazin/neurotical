import fs from "node:fs";
import path from "node:path";

// Match vercel.json in dev: "/" goes to /mushrooms/, and a lesson folder without a
// trailing slash ("/battery-1") redirects to "/battery-1/" so "./app.js" resolves inside it.
function vercelRoutes() {
  return {
    name: "vercel-routes",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, query = ""] = req.url.split("?");
        const search = query ? `?${query}` : "";

        let location;
        if (pathname === "/") {
          location = "/mushrooms/";
        } else if (!pathname.endsWith("/") && !path.extname(pathname)) {
          const index = path.join(server.config.root, pathname, "index.html");
          if (fs.existsSync(index)) location = `${pathname}/`;
        }

        if (!location) return next();
        res.statusCode = 301;
        res.setHeader("Location", location + search);
        res.end();
      });
    },
  };
}

export default {
  plugins: [vercelRoutes()],
};
