import { Handler } from '@netlify/functions'
import { jwtVerify } from 'jose'

const { TOKEN_SECRET } = process.env

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};


const handleError = (message: string, status = 400) => {
  return {
    statusCode: status,
    body: JSON.stringify({
      message, 
      status
    }),
    headers: {
      'content-type': "application/json",
      ...corsHeaders
    }
  }
}
const handleCors = (event) => {
  
  if (event.httpMethod == 'OPTIONS') {
      // To enable CORS
      return {
        statusCode: 200, // <-- Important!
        headers: corsHeaders,
        body: 'Options Callback'
      };
   }
}

export const handler: Handler = async (event, context) => {
  const corsResponse = handleCors(event);
  if (corsResponse) {
    return corsResponse
  }
  const { sessionToken } =  JSON.parse(event.body)
  if (!sessionToken) {
    return handleError('no token provided')
  }

  try {
    const { payload } = await jwtVerify(sessionToken, Buffer.from(TOKEN_SECRET), {
      algorithms: ['HS256']
    })
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
      headers: {
        'content-type': "application/json",
        ...corsHeaders
      }
    }
  } catch (error) {
    return handleError('the provided token is invalid', 401)
    
  }
}
