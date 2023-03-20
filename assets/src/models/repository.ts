export class Repository {
  public id: string = ''

  public name: string = ''

  public avatar_url?: string

  public base_url?: string

  public service: string = ''

  public static fromJSON(obj: Object): Repository {
    let item: Repository = Object.assign(new Repository(), obj)
    return item
  }
}
