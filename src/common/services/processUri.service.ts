import { Injectable } from '@nestjs/common';
import { parseUrl } from 'url-lib';

@Injectable()
export class ProcessUriService {
  private youtubeSeperateQuery(query) {
    type queryType = {
      v;
    };
    const result: queryType = { v: null };
    query.split('&').forEach((element) => {
      const sep_element = element.split('=');
      result[sep_element[0]] = sep_element[1];
    });
    return { v: result.v };
  }

  public findDomain(uri: string) {
    const uriObj = parseUrl(uri);
    const query = this.youtubeSeperateQuery(uriObj.query);
    return {
      youtubeUri: uriObj.fullDomain + `?v=` + query.v,
      host: uriObj.host,
      query,
    };
  }
}
