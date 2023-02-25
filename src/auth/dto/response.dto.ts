import { ApiProperty } from '@nestjs/swagger';

export class responseAppTokenDTO {
  @ApiProperty({
    example: 'token',
    description: '액세스 토큰',
    required: true,
  })
  appToken: string;
}
