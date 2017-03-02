const required = value => value
    ? undefined
    : 'Required'
const maxLength = max => value => value && value.length > max
    ? `Must be ${max} characters or less`
    : undefined
const maxLength15 = maxLength(15)
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

const minLength = min => value => value && value.length < min
    ? `Seems this is too short at ${min} characters`
    : undefined
const minLength2 = minLength(2)
const fileType = type => ['schematic', 'layout', 'photo', 'other'].includes(type)
    ? undefined
    : `Unknown file type ${type}`

export const validators = [
  required,
  maxLength,
  email,
  maxLength15,
  minLength,
  minLength2,
  fileType
]
export default validators
