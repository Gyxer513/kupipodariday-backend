import { IsOptional, Min, IsBoolean, IsInt } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
  @IsInt()
  itemId: number;
}
