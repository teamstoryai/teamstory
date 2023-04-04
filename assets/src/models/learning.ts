export type LearningKey = {
  type: string
  start_date: string
  end_date: string
}

export class Learning {
  public key: LearningKey = {
    type: '',
    start_date: '',
    end_date: '',
  }

  public is_you: boolean = true
  public user_id: string = ''
  public user_name: string = ''
  public content: string = ''
  public private: boolean = false

  public static fromJSON(obj: Object): Learning {
    const { type, start_date, end_date, ...rest } = obj as any
    let item: Learning = { ...rest, key: { type, start_date, end_date } }
    return item
  }
}
