package routes

import (
	handler "ming/internal/handlers"

	"ming/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupNoteRoutes(r *gin.Engine) {
	notes := r.Group("notes")
	notes.GET("", middleware.AuthMiddleware, handler.GetNotes)
	notes.GET("", middleware.AuthMiddleware, handler.GetNote)
	notes.POST("", middle.AuthMiddleware, handler.CreateNote)
	notes.PUT("/:id", middle.AuthMiddleware, handler.UpdateNote)
	notes.DELETE("/:id", middle.AuthMiddleware, handler.Delete)
}
