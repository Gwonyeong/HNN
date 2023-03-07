import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty({
    example: '성공!',
  })
  message?: string = '성공!';

  @ApiProperty({
    example: true,
  })
  success?: boolean = true;
}
