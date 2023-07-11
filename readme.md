## 프로젝트 소개 

Reminiscene은 여러분의 좋아하는 책, 게임 등을 업로드하여 사람들과 공유할 수 있는 웹 어플리케이션입니다.


## 프로젝트 구조

다음과 같은 MVC 구조로 프로젝트를 만들었습니다. 

```js
- models/... // 모델
- controllers/... // 컨트롤러
- views
    - games
        - index.ejs // 목록 보기
        - new.ejs   // 새로 만들기
        - edit.ejs  // 수정하기
        - show.ejs  // 세부 정보 보기
   -  books
        - index.ejs // 목록 보기
        - new.ejs   // 새로 만들기
        - edit.ejs  // 수정하기
        - show.ejs  // 세부 정보 보기
        ..
        ..
        ..
- data
   - seedBooks.js // 몽고 DB에 데이터를 채우는 데 사용되는 데이터
   - seedGames.js
   - seedUsers.js 
```

## 실행 방법

1. vscode에서 터미널을 열어 'npm install' 을 입력합니다. 이 명령어는 프로젝트에 필요한 npm 모듈을 다운로드 받습니다.
2. 모듈이 다운로드가 되었다면 'npm start' 를 입력해 프로젝트를 실행합니다.
3. 프로젝트가 실행되면 http://localhost:3000 주소를 브라우저에 입력합니다. 이제 사용하실 수 있습니다. 

