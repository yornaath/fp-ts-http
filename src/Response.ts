import { Option } from "fp-ts/lib/Option";

export type TResponse<RT> = Readonly<{
  status: number
  headers: Option<Record<string, string>>
  body: RT
}>