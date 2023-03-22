import axios from 'axios'

import { LinearClient } from '@linear/sdk'

class Linear {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }
}

export default new Linear()
