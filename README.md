# 📱 SNS 커뮤니티 서비스

> **사용자가 게시글을 작성하고 다른 사용자를 팔로우하며 소통할 수 있는 SNS 커뮤니티 서비스입니다.**
> 단순히 UI 구현에 그치지 않고, **Next.js 기반 SSR 환경과 Express API 서버, MySQL 데이터베이스를 직접 설계 및 구축**하여 프론트엔드와 백엔드 전반의 개발 경험을 쌓는 것을 목표로 진행한 프로젝트입니다.


## 📅 개발 기간
`2026.05 ~ 진행 중`


## 🛠 기술 스택

### **Frontend**
*   **Framework**: <u>Next.js (App Router)</u>
*   **Language**: TypeScript
*   **State Management**: React Query
*   **Styling**: Tailwind CSS

### **Backend**
*   **Framework**: <u>Express</u>
*   **ORM**: Sequelize

### **Database**
*   **RDBMS**: <u>MySQL</u>

---

## 🚀 주요 기능

### 1. 회원 기능
<ol>
  <li><strong>회원가입</strong>: 사용자 계정 생성 및 보안 처리</li>
  <li><strong>로그인/로그아웃</strong>: Passport 기반 Session 인증 구현</li>
  <li><strong>소셜 로그인</strong>: 간편 로그인 구현</li>
  <li><strong>프로필 조회</strong>: 사용자 정보 확인 및 관리</li>
</ol>

### 2. 게시글 기능
<ol>
  <li><strong>CRUD</strong>: 게시글 작성, 상세 조회, 수정, 삭제</li>
  <li><strong>게시글 검색</strong>: 키워드 기반의 검색 기능</li>
</ol>

### 3. 소셜 기능
<ol>
  <li><strong>팔로우/언팔로우</strong>: 사용자 간 관계 형성</li>
  <li><strong>관계 목록</strong>: 팔로워 및 팔로잉 목록 조회</li>
</ol>

### 4. 사용자 경험 (UX)
<ol>
  <li><strong>SSR</strong>: Next.js를 활용한 초기 데이터 렌더링 성능 최적화</li>
  <li><strong>서버 상태 관리</strong>: React Query를 활용한 효율적인 데이터 페칭</li>
  <li><strong>반응형 UI</strong>: Tailwind CSS 기반의 다양한 디바이스 대응</li>
</ol>

---

## 📊 데이터베이스 설계 (ERD)
<img src="https://github.com/user-attachments/assets/c11d870e-6441-4cb0-beee-2fb40d8e78b9" alt="ERD" width="800" />

---

## 💡 트러블 슈팅

### <u>문제: Next.js 서버 컴포넌트 API 요청 시 쿠키 전달 누락</u>

*   **발생 현상**: 클라이언트 브라우저의 쿠키 설정이 Next.js 서버 컴포넌트에서 API 서버로 요청을 보낼 때 자동으로 전달되지 않아, 인증이 필요한 API 호출이 실패하는 문제 발생.
*   **해결 방법**:
    *   Next.js의 <u>`cookies()` API</u>를 활용하여 서버 컴포넌트에서 쿠키를 추출.
    *   API 호출 시 헤더에 해당 쿠키를 명시적으로 삽입하여 요청을 전달하도록 로직 수정.
*   **결과**: SSR 환경에서도 사용자 인증 상태가 올바르게 유지되며, 게시글 목록 및 좋아요 기능 등이 정상적으로 동작함.

---

## 🖥️ 주요 화면 구성 (UI/UX)

각 페이지는 **웹(Desktop)**과 **앱(Responsive Mobile)** 환경 모두에서 최적화된 사용자 경험을 제공합니다.

<details>
<summary>👉 여기를 눌러 웹(Web) 화면(8장) 보기</summary>
<br>

| 메인 페이지 | 게시글 상세 | 프로필 |
| :---: | :---: | :---: |
| <img width="300" alt="web_main" src="https://github.com/user-attachments/assets/7b9069c1-d1e9-421b-b928-d7884512b2e4" /> | <img width="300" alt="web_post" src="https://github.com/user-attachments/assets/8009f08b-1219-4e5e-b08b-61c40469c467" /> | <img width="300" alt="web_profile" src="https://github.com/user-attachments/assets/e51b04ea-5db8-42eb-9bd0-f56994604bde" />


| **로그인** | **회원가입** |
| :---: | :---: |
| <img width="600" alt="web_login" src="https://github.com/user-attachments/assets/e1b179d4-1758-46f6-af4e-6806412ac560" /> | <img width="600" alt="web_signup" src="https://github.com/user-attachments/assets/4a5b94ae-3316-4914-aa66-46dd47c9019f" />


| **내 정보(게시글)** | **내 정보(팔로워)** | **내 정보(팔로잉)** |
| :---: | :---: | :---: |
| <img width="300" alt="web_mypage(1)" src="https://github.com/user-attachments/assets/22e5144b-9646-485e-8975-4c8abba92ffb" /> | <img width="300" alt="web_mypage(2)" src="https://github.com/user-attachments/assets/97dfceed-270d-4e73-9924-911dc1c05189" /> | <img width="300" alt="web_mypage(3)" src="https://github.com/user-attachments/assets/f5bcefdc-0e1d-4cb4-8064-f4927dd56fbc" />

</details>

<br>

<details>
<summary>👉 여기를 눌러 앱(App) 화면(3장) 보기</summary>
<br>

| 메인 페이지 | 로그인 | 프로필 |
| :---: | :---: | :---: |
| <img width="903" height="2315" alt="app_main" src="https://github.com/user-attachments/assets/538d18e2-ef19-450f-83a7-a28be5b0e146" /> | <img width="903" height="2315" alt="app_login" src="https://github.com/user-attachments/assets/2763bc3e-357d-4035-92cd-e230373dfb4b" /> | <img width="903" height="2315" alt="app_profile" src="https://github.com/user-attachments/assets/b02ca24b-680c-45ca-9a16-dede66223aed" /> |

</details>

---
