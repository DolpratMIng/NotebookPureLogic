package models

import (
	"time"

	"gorm.io/gorm"
)

type Note struct {
	ID        int            `json:"id" gorm:"primarykey;autoIncrement"`
	Title     string         `json:"title"`
	Content   string         `json:"content"`
	UserId    string         `json:"userId"`
	User      User           `json:"user"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
