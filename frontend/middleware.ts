import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 공개 페이지 - /post, /post/[postId] (보안, 공개가 섞인 라우트에서 예외 공개 페이지)
  const publicPatterns = [/^\/post$/, /^\/post\/\d+$/];

  const isPublic = publicPatterns.some((pattern) => pattern.test(pathname));

  // 보안 페이지 - 로그인 후 접속 가능
  const protectedPaths = ['/post', '/cart', '/profile'];

  const isProtected =
    protectedPaths.some((path) => pathname.startsWith(path)) && !isPublic;

  const accessToken = req.cookies.get('connect.sid');
  const isLogin = !!accessToken;

  // 로그인 안 된 상태
  if (isProtected && !isLogin) {
    // 1. /login 이라는 새 URL 생성
    const loginUrl = new URL('/login', req.url);

    // 2. 위의 /login에 ?state=/profile 이전 페이지의 url를 붙임
    loginUrl.searchParams.set('state', pathname);

    // 바로 searchParams.set("state", pathname)을 사용해도 되지만
    // loginUrl을 통해 사용한 이유는 안정성과 확장성 때문이다.
    // 다른 쿼리 파라미터가 추가한다면 loginUrl.searchParams.set("A", "B") 이렇게
    // /login?state=/profile&A=B 이렇게 추가할 수 있다.

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
