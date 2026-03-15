import { defineConfig, defineCollection } from '@webhouse/cms';

export default defineConfig({
  collections: [
    defineCollection({
      name: "pages",
      label: "Pages",
      urlPrefix: "/",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "heroTitle", type: "text", label: "Hero Title" },
        { name: "heroSubtitle", type: "textarea", label: "Hero Subtitle" },
        { name: "heroImage", type: "image", label: "Hero Image" },
        { name: "content", type: "richtext" },
        { name: "ctaText", type: "text", label: "CTA Text" },
        { name: "ctaLink", type: "text", label: "CTA Link" },
      ],
    }),
    defineCollection({
      name: "features",
      label: "Features",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "icon", type: "text", label: "Icon name" },
        {
          name: "category",
          type: "select",
          label: "Category",
          options: [
            { label: "IoT", value: "iot" },
            { label: "Monitoring", value: "monitoring" },
            { label: "Analytics", value: "analytics" },
            { label: "AI", value: "ai" },
          ],
        },
        { name: "featured", type: "boolean", label: "Featured" },
        { name: "sortOrder", type: "number", label: "Sort Order" },
      ],
    }),
    defineCollection({
      name: "pricing",
      label: "Pricing",
      fields: [
        { name: "planName", type: "text", required: true, label: "Plan Name" },
        { name: "description", type: "textarea" },
        { name: "priceAnnual", type: "text", label: "Annual Price" },
        { name: "currency", type: "text", label: "Currency" },
        { name: "maxSows", type: "text", label: "Max Sows" },
        {
          name: "featuresIncluded",
          type: "array",
          label: "Features Included",
        },
        { name: "highlighted", type: "boolean", label: "Highlighted" },
        {
          name: "addons",
          type: "array",
          label: "Add-ons",
          fields: [
            { name: "name", type: "text", label: "Add-on Name" },
            { name: "price", type: "text", label: "Price" },
          ],
        },
      ],
    }),
    defineCollection({
      name: "infographics",
      label: "Infographics",
      urlPrefix: "/infographics",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        {
          name: "category",
          type: "select",
          label: "Category",
          options: [
            { label: "AI", value: "ai" },
            { label: "Technology", value: "technology" },
            { label: "Features", value: "features" },
          ],
        },
        { name: "content", type: "richtext" },
        { name: "htmlContent", type: "htmldoc", label: "Interactive HTML" },
      ],
    }),
    defineCollection({
      name: "podcasts",
      label: "Podcasts",
      urlPrefix: "/podcasts",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "audioFile", type: "audio", label: "Audio File" },
        { name: "transcript", type: "richtext", label: "Transcript" },
        { name: "date", type: "date", label: "Publish Date" },
        { name: "duration", type: "text", label: "Duration" },
        { name: "tags", type: "tags", label: "Tags" },
      ],
    }),
    defineCollection({
      name: "problems",
      label: "Problems We Solve",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "icon", type: "text", label: "Icon name" },
        { name: "impact", type: "textarea", label: "Business Impact" },
        { name: "sortOrder", type: "number", label: "Sort Order" },
      ],
    }),
    defineCollection({
      name: "posts",
      label: "Blog Posts",
      urlPrefix: "/blog",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "excerpt", type: "textarea", label: "Excerpt" },
        { name: "content", type: "richtext" },
        { name: "date", type: "date", label: "Publish Date" },
        { name: "author", type: "text", label: "Author" },
        { name: "tags", type: "tags", label: "Tags" },
        {
          name: "category",
          type: "select",
          label: "Category",
          options: [
            { label: "Engineering", value: "engineering" },
            { label: "Product", value: "product" },
            { label: "Company", value: "company" },
          ],
        },
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
