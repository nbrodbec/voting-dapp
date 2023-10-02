import { addPoll, getAddressFromCode, getOwnedPolls } from '@/services/MongoDB';
import GenerateCode from '@/util/GenerateCode';

export async function GET(req) {
  const query = req.nextUrl.searchParams;
  const type = query.get('type');
  if (type === 'owner') {
    let polls = await getOwnedPolls(query.get('owner'));
    return new Response(JSON.stringify(polls));
  } else if (type === 'code') {
    let address = await getAddressFromCode(query.get('code'));
    return new Response(JSON.stringify(address));
  } else {
    return new Response(JSON.stringify(false));
  }
}

export async function POST(req) {
  const addresses = await req.json();
  let code = GenerateCode();

  while (!addPoll(code, addresses.contractAddress, addresses.signerAddress)) {
    code = GenerateCode();
  }

  return new Response(JSON.stringify(code));
}
