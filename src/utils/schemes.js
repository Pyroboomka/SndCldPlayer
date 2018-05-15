import { schema } from 'normalizr'

const userSchema = new schema.Entity('users')
export const songSchema = new schema.Entity('songs', {
  user: userSchema,
})
