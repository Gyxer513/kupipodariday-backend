import { IsString, Length, IsArray, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @MaxLength(1500)
  @IsOptional()
  description: string;

  @IsArray()
  itemsId: number[];
}