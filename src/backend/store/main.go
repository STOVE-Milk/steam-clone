package main

func main() {

	err := Server().Run()
	if err != nil {
		panic(err)
	}
}
