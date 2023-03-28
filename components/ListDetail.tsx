import * as React from 'react'

import {UserTest} from '../interfaces'

type ListDetailProps = {
  item: UserTest
}

const ListDetail = ({ item: user }: ListDetailProps) => (
  <div>
    <h1>Detail for {user.username}</h1>
    <p>ID: {user._id}</p>
  </div>
)

export default ListDetail
