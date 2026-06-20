package main

import (
	"ming/internal/routes"

	"ming/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	middleware.Cor(router)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "working fine",
		})
	})

	routes.SetupRoute(router)

	router.Run(":8080")
}
