import PostsList from './_components/PostsList';
import { cookies } from 'next/headers';
import { getPosts } from '@/src/services/posts';
import FloatingWriteButton from '@/components/common/FloatingWriteButton';

interface Props {
  searchParams: {
    page?: string;
    type?: string;
    keyword?: string;
    sort?: string;
  };
}

const cookieStore = await cookies();

const cookie = cookieStore
  .getAll()
  .map((v) => `${v.name}=${v.value}`)
  .join('; ');

export const metadata = {
  title: '홈',
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const posts = await getPosts(params, cookie);

  console.log('server posts: ', posts);

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      {/* <PostForm /> */}
      {/* <div className="sticky top-21 flex justify-center items-start w-full max-w-60 h-60 border border-border rounded-lg">
        사이드 메뉴
      </div> */}
      <PostsList initialData={posts} />

      <FloatingWriteButton />
    </main>
  );
}

// 일단 로그인을 하고 유저 정보 요청 API 버튼을 생성을 했음
// 로그인을 하면서 유저 정보를 전역에 저장할 수 있게 API 요청을 미리 보내야 하는데 소셔로그인은 어떻게 해야할지 모르겠음
// 로컬 로그인은 로그인 버튼 클릭으로 fetch 하면 되는데 소셜 로그인은 window.location.href로 이동을 해서 로그인을 하니
// 리다이렉트 하면서 user 정보를 요청해야 한가?
//
//

// 로그아웃은 로컬 로그아웃, 소셜 자체 로그아웃을 구현
// 로그인 시 useEffect로 유저 정보 요청을 하면 약간의 딜레이가 생겨
// RSC로 서버에서 유저 정보를 받아 데이터가 들어간 상태의 페이지로 렌더링 함
// Header 컴포넌트로 props 넘겨 미구현이지만 Tanstack Query로 유저 정보를 전역으로 관리할 예정
//
//

// 이전 페이지로 redirect 하기
// 1. 프론트에서 로그인이 필요한 페이지 접근 시 강제 이동은 middleware로 구현
// 2. 여기서 헤더의 로그인 버튼 클릭 이동 또는 강제 이동 시 이전 페이지를 쿼리스트링에 저장
//    로그인 클릭은 usePathname()으로 Link 태그에 href로 ?sate= 형식으로 이동을 했고
//    강제 이동은 middleware에서 pathname을 통해 거르고 있음
//
//

// 회원가입 페이지 구현 90% 완료
// 1. 회원가입 시 소셜, 로컬 가입 시 이메일을 확인을 하여 중복된 이메일 회원가입 방지
// 2. 닉네임 중복 확인을 통해 중복된 닉네임 방지
//
//

// 게시글 등록, 조회 구현 완료
// 1. UI, UX 구현하고 최적화는 이후에 구현하기 (이미지 선택 시 API 요청가지 않고 업로드 시 이미지 저장 후 게시글 저장)
// 2. 백 API 요청에 next.js Image 태그 사용 시 최적화를 위해 next 서버로 이동을 하고 백의 이미지 서버로 이동을 함
//    그러다 보니 url이 변경이 되어 가져오질 못함 그래서 최적화 사용하지 않는 unoptimized 옵션을 통해 해결
//    즉 8001번으로 요청을 하고 이미지 최적화를 위해 next 서버인 3000번으로 가져오니 오류가 뜸
//    S3, storage를 사용해야 최적화 될려나? => 말로는 된다함
//
//

// 게시글 좋아요 구현 완
// 1. 게시글에서 사용자 로그인 user.id를 받아 json 데이터에 boolean으로 데이터 반환하는 방법 사용을 했다가
//    이후 좋아요 1,000개 이상 많아지면 계산이 오래 걸려 사용하지 않음
// 2. 그래서 게시글은 게시글 정보 + 좋아요 수 만 가져오고 이후 따로 로그인 한 사용자가 좋아요 누른 게시글 id를
//    가져오는 API를 만들어 비교 후 좋아요 표시를 함 그러니 수정 과정 및 계산이 편린하고 빨라짐
// - 서버컴포넌트에서 posts를 받아오고 있는데 이걸 react query로 저장을 해서 상세 게시글 페이지 이동 시
//   보여주는 방식을 해야하나? 그리고 댓글만 추가 API 요청하는 방식으로 가는게 맞나?
//   아직 댓글 API 생성 및 테이블은 없어서 최후에 추가하는 걸로
//
//

// 검색 시스템 완
// 1. 게시글 좋아요 카운트 게시글 id : 좋아요 count 형식으로 state에 저장을 해서 react query mutation을 통해 같이 수정
//    정확하게 어떻게 했는지 모름;; gpt good
// 2. h-screen 삭제
// - 로그인 후 내 정보 드랍 메뉴 옵션 추가하기 (현 로그아웃만 됨)
//   내 정보 페이지 간단하게 만들기
// - 팔로우 팔로윙 구현하기
//
//

// 게시글 작성 페이지 완성하기
// 파일 이미지 로컬 url로 이미지 띄우고 등록할 때 이미지 랑 같이 등록하기
// 태그 UI 구성하기
//
//

// 게시글 작성 페이지 완
// 이미지 1개만 선택이 되어서 이후 고민
// 수정 페이지 작성하기 + 게시글 삭제
//
//

// 상세 페이지 마무리 하기
// 팔로우, 팔로윙 구현하기
// 댓글 추가?
//
//

// 팔로우 추가 함
// 1. 언팔 추가하기
// 2. 로그인 유저 및 게시글 작성자 팔로우 팔로윙 인원 수 및 유저 정보 추가하기
// 3. 나머지 게시글 수정, 삭제, 닉네임 변경 등등..
//
//

// 언팔 추가 완, 팔로우, 팔로윙 유저 API 추가 완
// 1. 내정보 페이지 구현하기 팔로우, 팔로윙 정보 불러왔음
//    - 탭을 통해 기본 정보, follow 및 내 정보
//    - 프로필 사진 변경 추가하기?
//    - 닉네임, 비밀번호 변경 추가하기
// 2. 게시글 수정, 삭제 API 완료했으나 페이지 및 구현 해야함
// 3. 댓글
// 4. 무한 스크롤..
//
//

// 게시글 수정 페이지 일부 구현
// 1. 게시글 태그 수정이 안됨 - 데이터는 불러옴
// 2. 내용의 기본 값이 없는 상태로 되어 있음
// 3. 로컬 이미지로 띄우고 있어 db에서 가져온 이미지는 띄우지 못함
// 4. 게시글 수정 클릭 시 수정은 되는데 API 에러가 뜸
// 5. 이미지 기존 이미지와 동일하면 이미지 저장 API가 호출이 되는지 확인 할 것.
//
//

// 게시글 수정 페이지 완
// 1. 마이 페이지 구현하기
//    - 기본 정보 (유저 정보 + follow 정보)
// 2. follow 유저 정보 목록 표기하기 + 언팔 추가
//    - 쿼리스트링을 통해 탭 보이기
// 3. 탭에 내가 작성한, 좋아요 클릭한 목록 추가
// 4. 탭에 닉네임, 비번 변경 추가
//
//

// 프로필 API 구조 변경 완
// - 로그인 기준 상대 팔로워, 팔로잉 목록에 자신도 팔로워 한 사람인지 검증 후 isFollowing 추가
//   - 기존 내 프로필 기준으로 했어서 상대 프로필 조회 시 해당 상대 프로필 기준 팔로우 보여줌
// - 로그인 기준 post, followers, followings count 조회
// 1. 조회 userId에 따라 작성한 게시글 목록 조회 API 추가하기
// 2. 다른 사람 프로필 조회 추가하기 + 내정보 게시글 목록 추가하기(내가 작성한)
// 3. 댓글, 실시간 채팅 구현?
//
//

// 내정보 페이지 내가 작성한 게시글 목록 구현 완
//   - 모바일 환경 UI 구현하기
// 상대 프로필 정보 구현하기 (내정보 요청 API 동일)
//
//

// 프로필 페이지 구현 완료
// 메타데이터 추가 완료
// 1. 프로필 이미지 추가?
// 2. 댓글 추가?
// 3. 실시간 채팅 추가?
// 4. 성능 최적화
