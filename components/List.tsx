import * as React from 'react'
import ListItem from './ListItem'
import {UserTest} from '../interfaces'

type Props = {
  items: UserTest[]
}

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item._id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
)

export default List
