import { IsString, IsUrl, Length, IsNotEmpty, Min } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Min(1)
  price: number;

  @Length(1, 1024)
  @IsString()
  description?: string;
}
