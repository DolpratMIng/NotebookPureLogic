package migrations

import (
	"ming/configs"
	"ming/internal/models"
)

func InitDB() {
	configs.DB.AutoMigrate(&models.User{}, &models.Note{})
}
