package main

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Teams struct {
	ID   int    `gorm:"primaryKey"`
	Name string `gorm:"column:name"`
}

type Managers struct {
	TeamID int `gorm:"column:team_id"`
	UserID int `gorm:"column:user_id"`
}

type Users struct {
	ID   int    `gorm:"primaryKey"`
	Name string `gorm:"column:name"`
}

func main() {
	// connect to the database
	dsn := "user1:password1@tcp(127.0.0.1:3306)/example_db?charset=utf8mb4&parseTime=True&loc=Local"

	// open a database connection
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// insert users
	db.Create(&Users{Name: "User A"})
	db.Create(&Users{Name: "User B"})
	db.Create(&Users{Name: "User C"})

	// insert teams
	db.Create(&Teams{Name: "Team A"})
	db.Create(&Teams{Name: "Team B"})
	db.Create(&Teams{Name: "Team C"})

	// insert managers
	db.Create(&Managers{TeamID: 1, UserID: 1})
	db.Create(&Managers{TeamID: 2, UserID: 2})

	// select user ids of managers
	// ERROR  sql: Scan error on column index 0, name "user_id": converting NULL to int is unsupported
	var userIDs []int
	result := db.Table("teams").
		Joins("INNER JOIN managers ON managers.team_id = teams.id").
		Pluck("managers.user_id", &userIDs)
	if result.Error != nil {
		log.Fatal(result.Error)
	}

	// print user ids
	for _, uid := range userIDs {
		fmt.Printf("ID: %d\n", uid)
	}
}
