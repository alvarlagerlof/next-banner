![Logo](banner.png)

# Next Opengraph Image

Generate opengraph images (og:image) at build using Puppeteer.

## What is an opengraph image?

Open Graph is a protocol for structured metadata for websites. Part of that is a specification for preview images referred to as "og:image". When using that, your website gets a nice preview in social media and messaging apps. For an example, check out [ogimage.gallery](https://www.ogimage.gallery/).

## Why this library?

You might think you can design an images in Figma. This is entirely doable, but quickly becomes tedious if you have a lot of pages (like blog posts) or want to change the design. Generating images is much more effective.

Most currently existing solutions run on-demand either in a serverless function or in a service. This is wasteful and could be expensive if demand is high. For example, cold starting puppeteer to take a screenshot of the page can take 8s per visitor. To counteract this, a CDN can be used, which further increases the amount of things needing setup.

With next-banner, none of that is needed. In true Jamstack fashion, this library generates images at build, using existing infrastructure that you already have.

## Features

- **Speed.** It uses Puppeteer to render pages, but only on instance, meaning there is only one cold start. On an M1, 100 pages are rendered and captured in 18s.
- **Simple setup.** Does not require you to touch puppeteer, CDNs, or serverless functions.
- **Render using React.** Your images are captured pages that you code in React just like you are used to. No SVGs or special template languages.
- **Multuple layouts.** You could have one layout for a start page and another for blog posts.
- **Pass any data.** Page title and meta description is passed to the layout pages by default, but you can include any data in any structure you want.

## Usage

### Installation

Use npm or yarn

```bash
npm install next-banner
yarn add next-banner
```

Add this to your scripts in package.json

```json
"postbuild": "next-banner",
```

### Configuration

The config file is called `next-banner.json` and may be placed at the root of your directory. You do not need it unless you want to change any of the options.

```json
{
  "sourceDir": ".next",
  "excludePages": [],
  "width": 1200,
  "height": 630
}
```

### Setup on pages

First, you need to import and use the `useOgImage` hook on every page. If you have many, I recommend making a wrapper around that takes in your desired data and uses the hook.

The base url is needed because some social media platforms prefix the domain to the url and fail to load the og:image.

You may also want to add `<meta name="twitter:card" content="summary_large_image">` in your `_document` or `_app` to make the image larger in the preview.

```jsx
// Step 1
import { useOgImage } from "next-banner";

export default function Home() {
  // Step 2
  const ogImage = useOgImage({
    baseUrl: "https://example.com"
  });

  return (
    <div>
      <Head>
        <title>...</title>
        <meta name="description" content="..." />
        <link rel="icon" href="/favicon.ico" />

        // Step 3
        <meta {...ogImage} />
      </Head>
      ...
  )
}
```

By default, the page title and meta description tag will be picked up, included, and sent as data to the layout pages. If you want to include custom data, use the hook like this.

```jsx
const ogImage = useOgImage({
  baseUrl: "https://example.com",
  data: {
    /* anything here */
  },
});
```

You can also specify a custom layout like this.

```jsx
const ogImage = useOgImage({
  baseUrl: "https://example.com",
  layout: "blogpost",
});
```

### Layout files

Create a folder called `_banner` in your `/pages` folder. Then create a file called `default.js` there.

An example of a layout file looks like this. Notice the fixed CSS position and size. If you have styles in your `_app` (which affects all pages) you may need something like this.

The placeholder is used in development and should match what is returned from the hook. In production, it returns whatever data was extracted from the actual or the useOgImage hook data.

```jsx
export default function Default() {
  const { title, description } = useData({
    placeholder: {
      title: "Placeholder title",
      description: "Placeholder description",
    },
  });

  return (
    <div
      style={{
        padding: "100px",
        background: "#ededed",
        width: "1200px",
        height: "630px",
        position: "fixed",
        top: "0",
        left: "0",
      }}
    >
      <img src="/vercel.svg" alt="" style={{ marginBottom: "70px" }} />

      <div>
        <h1 style={{ fontSize: "5em" }}>{title}</h1>
        <h2 style={{ fontSize: "2em" }}>{description}</h2>
      </div>
    </div>
  );
}
```

## Example

There is an example showcasing usage [here](/example)

## License

[MIT](LICENSE)

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## Feedback

If you have any feedback, please [create an issue](https://github.com/alvarlagerlof/next-banner/issues/new) reach me on [twitter](https://twitter.com/alvarlagerlof).
