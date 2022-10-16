package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-65-example/entity"
)

// POST /playlists
func CreatePlaylist(c *gin.Context) {
	var playlist entity.Playlist
	if err := c.ShouldBindJSON(&playlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&playlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": playlist})
}

// GET /playlist/:id
func GetPlaylist(c *gin.Context) {
	var playlist entity.Playlist
	id := c.Param("id")
	if err := entity.DB().Preload("Owner").Raw("SELECT * FROM playlists WHERE id = ?", id).Find(&playlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if playlist.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": playlist})
}

// GET /playlist/watched/user/:uid
func GetPlaylistWatchedByUser(c *gin.Context) {
	var playlist entity.Playlist
	owner_id := c.Param("owner_id")
	if err := entity.DB().Preload("Owner").Preload("WatchVideos.Resolution").Preload("WatchVideos").Preload("WatchVideos.Video").Raw("SELECT * FROM playlists WHERE owner_id = ? AND title = ?", owner_id, "Watched").Find(&playlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": playlist})
}

// GET /playlists
func ListPlaylists(c *gin.Context) {
	var playlists []entity.Playlist
	if err := entity.DB().Preload("Owner").Raw("SELECT * FROM playlists").Find(&playlists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": playlists})
}

// DELETE /playlists/:id
func DeletePlaylist(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM playlists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "playlist not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /playlists
func UpdatePlaylist(c *gin.Context) {
	var playlist entity.Playlist
	if err := c.ShouldBindJSON(&playlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", playlist.ID).First(&playlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "playlist not found"})
		return
	}

	if err := entity.DB().Save(&playlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": playlist})
}
