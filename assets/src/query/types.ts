/*
  example linear issue:
  {
    "boardOrder": 0,
    "branchName": "tim/ts-11-report-1-current-work",
    "completedAt": "2023-03-22T17:44:21.706Z",
    "createdAt": "2023-03-21T22:30:14.906Z",
    "customerTicketCount": 0,
    "description": "Show all the issues completed in the last time period.\n\nShow all the pull requests that were created in the last time period.",
    "id": "e742f5e3-3471-48da-8f3c-840f3c1cc152",
    "identifier": "TS-11",
    "number": 11,
    "previousIdentifiers": [],
    "priority": 0,
    "priorityLabel": "No priority",
    "sortOrder": 8,
    "startedAt": "2023-03-21T22:37:53.175Z",
    "title": "Report #1 - current work",
    "updatedAt": "2023-03-22T06:08:26.520Z",
    "url": "https://linear.app/teamstory/issue/TS-11/report-1-current-work",
    "_assignee": {
      "id": "bd8b3199-9ee6-46b7-b206-fe0dea778d37"
    },
    "_creator": {
      "id": "bd8b3199-9ee6-46b7-b206-fe0dea778d37"
    },
    "_state": {
      "id": "955dfe0f-526e-496f-b12d-4d64261b1bc9"
    },
    "_team": {
      "id": "c66ddd7b-b79e-4d5b-996f-c0309fc7501f"
    }
  }
*/

/*
  example linear user:
  {
    "active": true,
    "admin": true,
    "calendarHash": "9d7299d455f57b61",
    "createdAt": "2023-03-20T23:28:14.160Z",
    "createdIssueCount": 8,
    "displayName": "tim",
    "email": "tim@teamstory.ai",
    "guest": false,
    "id": "bd8b3199-9ee6-46b7-b206-fe0dea778d37",
    "inviteHash": "2695ba9f25663733",
    "isMe": true,
    "name": "Tim Su",
    "timezone": "America/Los_Angeles",
    "updatedAt": "2023-03-20T23:28:15.984Z",
    "url": "https://linear.app/teamstory/profiles/tim"
  }
*/

export type QueryUser = {
  id: string
  name: string
  username?: string
  avatar?: string
  email?: string
}

export type QueryLabel = {
  name: string
  color?: string
}

export type QueryIssue = {
  id: string
  identifier: string
  title: string
  description?: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  url: string
  creator?: QueryUser
  assignee?: QueryUser
  priority?: number // 0 = no, 1 = urgent
  priorityLabel?: string
  labels?: QueryLabel[]
}

export type QueryPullRequest = {
  number: number
  title: string
  user: QueryUser
  html_url: string
  updated_at: string
  created_at: string
  merged_at?: string
  closed_at?: string
  repo: string
  comments: number
}
