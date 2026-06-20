package repositories

import (
	"ming/configs"
	"ming/models"
)

func GetNotes(user models.User) (models.Note, error) {
	var note models.Note
	result := configs.DB.Where("id = ?", user.ID).Find(&note)
	if result.Error != nil {
		return nil, result.Error
	}

	return result, nil
}

func GetNote(user models.User, id int) (models.Note, error) {
	var note models.Note
	result := configs.DB.Where("id = ?", user.ID).First(&note)
	if result.Error != nil {
		return nil, result.Error
	}

	return result, nil
}
