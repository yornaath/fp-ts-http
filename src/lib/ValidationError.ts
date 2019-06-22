import { Option } from "fp-ts/lib/Option";

export default class ValidationError {
  constructor(
    public readonly message: string,
    public readonly data: Option<object>
  ){}
}