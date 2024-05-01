import type { VocanaSDK } from "@vocana/sdk";
import fetch from "node-fetch"
import {load} from "cheerio"

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ url: string; maxResponse?: number; cookie: string }>;
type Outputs = Readonly<{  urls: string[]; }>;



export default async function(inputs: Inputs, context: Context) {
  const url = inputs.url;
  let urls: string[] = [];

  let mangaTitle: string | undefined;
  const content = await fetch(inputs.url, {
    headers: {
      Cookie: inputs.cookie , 
      "User-Agent":
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  }).then(r => r.text());
  const $ = load(content)
  for (const el of $("#chapter-items a.comics-chapters__item")) {
    urls.push(`https://www.baozimh.com${el.attribs["href"]}`);
  }

  if (typeof inputs.maxResponse === "number") {
    urls = urls.slice(inputs.maxResponse);
  }
  await context.output(urls, "urls", true);
};