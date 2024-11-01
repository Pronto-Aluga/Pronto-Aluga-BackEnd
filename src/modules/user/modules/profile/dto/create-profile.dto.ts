import {
  IsBoolean,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class CreateProfileDto {
  @ApiProperty({ description: 'Name of the profile' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Document number of the profile' })
  @IsNumberString()
  document: string;

  @ApiProperty({
    description: 'Type of the document',
    enum: DocumentType,
    example: 'CPF | CNPJ',
  })
  @IsEnum(DocumentType, {
    message: 'Type must be a valid document type value, values input CPF CNPJ',
  })
  document_type: DocumentType;

  @ApiProperty({ description: 'URL of the profile image', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Indicates if the user is subscribed to the newsletter',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  newsletter: boolean;

  @ApiProperty({
    description: 'The phone number associated with the address',
    example: '1234567890',
  })
  @IsNumberString()
  phone_number: string;
}
