export type CommonModuleProps = {
  title: string
  module: string
  [key: string]: any
}

export default abstract class BaseModule<Props, Output> {
  constructor(public props: Props) {}

  abstract fetchData(clearCache?: boolean): Promise<Output>

  describeData(): Promise<string | undefined> {
    return Promise.resolve(undefined)
  }

  abstract render(): JSX.Element
}

export type AnyBaseModule = BaseModule<CommonModuleProps, any>
