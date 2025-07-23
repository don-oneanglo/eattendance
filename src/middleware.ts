import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      
      let decodedAuth: string;
      try {
        decodedAuth = atob(authValue);
      } catch (e) {
        console.error("Failed to decode auth token:", e);
        // Invalid base64, treat as unauthenticated
        return new NextResponse('Authentication required', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
          },
        });
      }

      const [user, pwd] = decodedAuth.split(':');

      const validUser = 'super-it';
      const validPass = 'F!123w@77';

      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
