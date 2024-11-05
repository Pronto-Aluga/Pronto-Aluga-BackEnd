import { IsOptional, IsString, IsNumber, IsUrl, IsArray, Min, Max } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @Min(1)
  @Max(365)
  minRentalDays?: number;

  @IsOptional()
  @Min(1)
  @Max(365)
  maxRentalDays?: number;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
  
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  number?: string;
}
