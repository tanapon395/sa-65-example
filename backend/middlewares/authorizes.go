package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-65-example/service"
)

// validates token
func Authorizes() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("Authorization")
		if clientToken == "" {
			c.AbortWithStatus(http.StatusForbidden)
		}

		extractedToken := strings.Split(clientToken, "Bearer ")

		if len(extractedToken) == 2 {
			clientToken = strings.TrimSpace(extractedToken[1])
		} else {
			c.AbortWithStatus(http.StatusBadRequest)
		}

		jwtWrapper := service.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:    "AuthService",
		}

		_, err := jwtWrapper.ValidateToken(clientToken)
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		// c.Set("email", claims.Email)
		// c.Next()
	}
}
