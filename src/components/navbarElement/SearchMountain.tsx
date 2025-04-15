import { User } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import SearchInput from './SearchInput'

const SearchMountain = ({currentUser}:{currentUser:User|null}) => {
    if(!currentUser) return redirect("/login")
  return (
    <SearchInput userId={currentUser.id}/>
  )
}

export default SearchMountain