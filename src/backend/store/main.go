package main

// 상점 서버를 실행합니다.
func main() {
	err := Run()
	if err != nil {
		panic(err)
	}
}
