
export type TResponse<RT> = Readonly<{
  status: number
  headers: Record<string, string>
  body: RT
}>