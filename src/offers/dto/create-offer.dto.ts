import { IsOptional, Min,  IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  itemId: number;
}
