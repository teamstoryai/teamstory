import { OAuthToken, Project, ProjectMember, User } from '@/models'

export type SuccessResponse = {
  success: boolean
}

export type ErrorResponse = {
  error: {
    message: string
    resend: boolean
  }
}

export type SignInResponse = {
  user?: User
  token?: string
}

export type OAuthSignInResponse = SignInResponse & {
  profile: any
}

export type ItemsResponse<T> = {
  items: T[]
}

export type ItemResponse<T> = {
  item: T
}

export type ProjectsResponse = {
  projects: Project[]
  user: User
}

export type ProjectWithMembersResponse = ItemsResponse<Project> & {
  members: ProjectMember[]
}
