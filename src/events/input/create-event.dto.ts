import { IsDateString, IsEmail, Length } from 'class-validator'

export class CreateEventDto {
  @Length(5, 255, { message: 'Name should be at least 5 characters' })
  name: string
  @Length(5, 255)
  description: string
  @IsDateString()
  date: string
  @Length(5, 255, { groups: ['create'] })
  @Length(10, 20, { groups: ['update'] })
  address: string
  @IsEmail()
  email: string
}
