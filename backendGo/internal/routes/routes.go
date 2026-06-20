package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRoute(r *gin.Engine) {
	SetupNoteRoutes(r)
}
