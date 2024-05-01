import type { VocanaSDK } from "@vocana/sdk";
import fetch from 'node-fetch'
import {load}from 'cheerio'

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ urls: string[]; cookie: string; }>;
type Outputs = Readonly<{ page: Page; }>;

type Page = {
  imageURLs: string[];
  title?: string;
};

export default async function(inputs: Inputs, context: Context) {


  const pages: Page[] = [];

for (const url of inputs.urls) {
  const content = await fetch(url, {
    headers: {
      Cookie: inputs.cookie,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  }).then(r => r.text());
  const $ = load(content)

  const title = ($("span.title")[0].children[0] as Record<string, any>).data;
        const imageURLs: string[] = [];    
        const selectedImages = $("amp-img").filter((_, el) => /^chapter\-img\-/.test(el.attribs["id"])).map((_, el) => el.attribs["src"]);

        for (const imageURL of selectedImages) {
          imageURLs.push(imageURL);
        }
        const pageItem: Page = { imageURLs };
        if (title) {
          pageItem.title = title;
        }
        pages.push(pageItem);
}

  console.log(pages, "hello")
  for (const page of pages) {
    context.output(page, "page", false);
  }
  await context.done();
};