import type { VocanaSDK } from "@vocana/sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ cookie: string }>;
type Outputs = Readonly<{ cookie: string }>;

export default async function(inputs: Inputs, context: Context) {
  void context.output(inputs.cookie, "cookie", true);
};