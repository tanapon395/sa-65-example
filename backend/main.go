package main

import (
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-65-example/controller"
	"github.com/tanapon395/sa-65-example/entity"
	"github.com/tanapon395/sa-65-example/middlewares"
)

const PORT = "8080"

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())
		{
			// User Routes
			router.GET("/users", controller.ListUsers)
			router.GET("/user/:id", controller.GetUser)
			router.PATCH("/users", controller.UpdateUser)
			router.DELETE("/users/:id", controller.DeleteUser)

			// Video Routes
			router.GET("/videos", controller.ListVideos)
			router.GET("/my_videos/:owner_id", controller.ListMyVideos)
			router.GET("/video/:id", controller.GetVideo)
			router.POST("/videos", controller.CreateVideo)
			router.PATCH("/videos", controller.UpdateVideo)
			router.DELETE("/videos/:id", controller.DeleteVideo)

			// Playlist Routes
			router.GET("/playlists", controller.ListPlaylists)
			router.GET("/playlist/:id", controller.GetPlaylist)
			router.GET("/playlist/watched/user/:owner_id", controller.GetPlaylistWatchedByUser)
			router.POST("/playlists", controller.CreatePlaylist)
			router.PATCH("/playlists", controller.UpdatePlaylist)
			router.DELETE("/playlists/:id", controller.DeletePlaylist)

			// Resolution Routes
			router.GET("/resolutions", controller.ListResolutions)
			router.GET("/resolution/:id", controller.GetResolution)
			router.POST("/resolutions", controller.CreateResolution)
			router.PATCH("/resolutions", controller.UpdateResolution)
			router.DELETE("/resolutions/:id", controller.DeleteResolution)

			// WatchVideo Routes
			router.GET("/watch_videos", controller.ListWatchVideos)
			router.GET("/watchvideo/:id", controller.GetWatchVideo)
			router.POST("/watch_videos", controller.CreateWatchVideo)
			router.PATCH("/watch_videos", controller.UpdateWatchVideo)
			router.DELETE("/watchvideors/:id", controller.DeleteWatchVideo)

		}
	}

	// Signup User Route
	r.POST("/signup", controller.CreateUser)
	// login User Route
	r.POST("/login", controller.Login)

	// Run the server go run main.go
	r.Run("localhost: " + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
