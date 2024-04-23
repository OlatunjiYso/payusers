import axios from 'axios';
import * as fs from 'fs';

export async function saveAvatar(url: string, userId: string): Promise<string> {
  const resp = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      Accept: 'image/jpg',
    },
  });
  const avatarHash = userId;
  const avatarPath = `${process.cwd()}/src/avatars/${avatarHash}`;
  fs.writeFileSync(avatarPath, resp.data);
  return avatarHash;
}
