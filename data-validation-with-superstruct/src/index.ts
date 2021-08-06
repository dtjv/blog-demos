import * as ss from 'superstruct'

//-----------------------------------------------------------------------------
// constants
//-----------------------------------------------------------------------------
enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

//-----------------------------------------------------------------------------
// schemas
//-----------------------------------------------------------------------------
const alphanum = () => ss.pattern(ss.string(), /[a-zA-Z0-9]/)
const password = () => ss.pattern(ss.string(), /^[a-zA-Z0-9*:?]{3,6}$/)

const BaseSchema = ss.object({
  name: ss.defaulted(ss.size(alphanum(), 3, 30), 'admin'),
  role: ss.defaulted(ss.enums([Roles.USER, Roles.ADMIN]), Roles.ADMIN),
  token: ss.optional(ss.union([ss.number(), ss.string()])),
  password: ss.optional(password()),
  repeatPassword: ss.optional(password()),
})

const PersonSchema = ss.intersection([
  ss.refine(BaseSchema, 'PasswordOrToken', (schema) =>
    schema.password || schema.repeatPassword
      ? schema.token
        ? false
        : true
      : !!schema.token
  ),
  ss.refine(
    BaseSchema,
    'PasswordMatch',
    (schema) => schema.password === schema.repeatPassword
  ),
])

//-----------------------------------------------------------------------------
// types and data
//-----------------------------------------------------------------------------
type Person = ss.Infer<typeof PersonSchema>

const person: Partial<Person> = {
  token: 4,
}

//-----------------------------------------------------------------------------
// driver
//-----------------------------------------------------------------------------
const [error, admin] = ss.validate(person, PersonSchema, { coerce: true })

if (error) {
  switch (error.refinement) {
    case 'PasswordOrToken':
      console.error(`Please provide a 'password' or 'token'; not both`)
      process.exit(1)
    case 'PasswordMatch':
      console.error(`Passwords must match`)
      process.exit(1)
    default:
      throw error
  }
}

console.log(`admin:`, admin)
