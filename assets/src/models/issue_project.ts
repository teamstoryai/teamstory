export class IssueProject {
  public id: string = ''

  public name: string = ''

  public identifier: string = ''

  public base_url?: string

  public service: string = ''

  public static fromJSON(obj: Object): IssueProject {
    let item: IssueProject = Object.assign(new IssueProject(), obj)
    return item
  }
}
