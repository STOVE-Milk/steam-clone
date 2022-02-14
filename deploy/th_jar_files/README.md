### amazon corretto 11 다운로드 및 설치 진행
- [설치 링크](link: https://corretto.aws/downloads/latest/amazon-corretto-11-x64-macos-jdk.pkg)
- 이후 환경변수에 Java Path 설정
  - 자바 기본 경로 - /Library/Java/JavaVirtualMachines
  - 임시 설정 - 터미널에 아래 명령어 입력
    - export JAVA_HOME=/Library/Java/JavaVirtualMachines/amazon-corretto-11.jdk/Contents/Home
  - 영구 설정 - 아래 과정 진행
    - \[open|vi|vim\] ~/.bash_profile
    - 파일에 아래 명령어 작성
        - export JAVA_HOME=/Library/Java/JavaVirtualMachines/amazon-corretto-11.jdk/Contents/Home
        - export PATH=${PATH}:${JAVA_HOME}/bin:
    - 파일 저장 및 종료
    - 터미널에 환경변수 갱신
        - source ~/.bash_profile
  - 자바 버전 확인
    - java --version
  - 터미널 재접속 OR 재부팅

### JAVA 실행 방법
- jar 실행 방법
  - JDK 11 설치
  - jar 폴더 접근
  - Command 입력
    - java -jar ./jar_file_name.jar
    - 포트 변경 방법 (환경 주입)
      - java -jar ./jar_file_name --server.port=8080
      