export class Org {
  public id?: string

  public name?: string

  public domain?: string

  public domains?: string

  public static fromJSON(obj: Object): Org {
    let item: Org = Object.assign(new Org(), obj)
    return item
  }
}
