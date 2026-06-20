package models

import "time"

type User struct {
	ID       string    `json:"id" gorm:"primaryKey;autoIncrement"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Notes    []Note    `json:"notes"`
	CreateAt time.Time `json:"CreateAt"`
}
