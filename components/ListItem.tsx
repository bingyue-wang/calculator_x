import React from 'react'
import Link from 'next/link'

import {UserTest} from '../interfaces'

type Props = {
  data: UserTest
}

const ListItem = ({ data }: Props) => (
  <Link href="/users/[id]" as={`/users/${data._id}`}>
    {data._id}:{data.username}
  </Link>
)

export default ListItem
