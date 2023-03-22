export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export type ProjectMeta = {
  // onboarded?
  ob?: number
}

export class Project {
  public id: string = ''

  public name: string = ''

  public archived_at?: string | null

  public deleted_at?: string | null

  public members?: ProjectMember[]

  public meta?: ProjectMeta

  public static fromJSON(obj: Object): Project {
    let item: Project = Object.assign(new Project(), obj)
    return item
  }

  public static meta(p: Project | null | undefined): ProjectMeta {
    return p?.meta || {}
  }
}

export type ProjectMember = {
  id?: string
  name?: string
  email?: string
  role: ProjectRole
}
