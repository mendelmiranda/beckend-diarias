import { registerAs } from '@nestjs/config';

export default registerAs('tceApi', () => ({
  graphqlUrl:
    process.env.TCE_API_GRAPHQL_URL?.trim() ||
    'https://api.tce.ap.gov.br/graphql',
  tokenUrl:
    process.env.TCE_API_TOKEN_URL?.trim() ||
    'https://auth.tce.ap.gov.br/realms/intranet/protocol/openid-connect/token',
  clientId: process.env.TCE_API_CLIENT_ID?.trim() ?? '',
  clientSecret: process.env.TCE_API_CLIENT_SECRET?.trim() ?? '',
}));
