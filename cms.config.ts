import { defineConfig, defineCollection } from '@webhouse/cms';

export default defineConfig({
  collections: [
    defineCollection({
      name: "pages",
      label: "Pages",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "content", type: "richtext" },
      ],
    }),
  ],
  storage: {
    adapter: "github",
    github: {
      owner: "cbroberg",
      repo: "sproutlake",
      branch: "main",
      contentDir: "content",
      token: "oauth",
    },
  },
});
