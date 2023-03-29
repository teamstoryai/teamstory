export class IssueTracker {
  public id: string = ''

  public name: string = ''

  public identifier: string = ''

  public base_url?: string

  public service: string = ''

  public deleted_at?: string | null

  public static fromJSON(obj: Object): IssueTracker {
    let item: IssueTracker = Object.assign(new IssueTracker(), obj)
    return item
  }
}
