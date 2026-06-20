package services

import (
	"ming/internal/models"
)

func GetNotes() {
	var note models.Note
	userData, exists := c.Get("user")
	if !exists {
		panic("no exist")
	}

	user := userData.(struct{ UserID string })
	result := configs.DB.Where("id = ?", user.UserID).Find(&note)

	if result.Error != nil {
		fmt.Print("database error: ", result.Error)
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func GetNote(c *gin.Context) {
var note models.Note

id c.BindUri("")
}

func CreateNote() {

}

func UpdateNote() {

}

func DeleteNote() {

}
