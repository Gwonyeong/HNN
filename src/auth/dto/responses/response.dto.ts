import { ApiProperty } from '@nestjs/swagger';
import { ResponseDTO } from '@common/dtos/response.dto';

export class responseAppTokenDTO extends ResponseDTO {
  @ApiProperty({
    description: '액세스 토큰',
    required: true,
    properties: {
      appToken: {
        type: 'string',
      },
    },
  })
  data: {
    appToken: string;
  };
}
