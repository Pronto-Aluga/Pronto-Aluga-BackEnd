import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsArray, Min, Max } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  dailyRate: number;

  @IsNotEmpty()
  @Min(1)
  @Max(365)
  minRentalDays: number;

  @IsNotEmpty()
  @Min(1)
  @Max(365)
  maxRentalDays: number;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  number: string;
}
