package com.tripthread.trip_planner.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.*;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "TripThread",
                        email = "tripthread@mail.com"
                ),
                description = "OpenApi documentation",
                title = "OpenApi specification - TripThread",
                version = "1.0",
                license = @License(
                        name = "License name",
                        url = "https://some-ur.com"
                ),
                termsOfService = "Terms of service"
        ),
        servers = {
                @Server(
                        description = "Local",
                        url = "http://localhost:8088/api/v1"
                ),
                @Server(
                        description = "PROD",
                        url = "https://some-ur.com"
                )
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.OAUTH2,
        flows = @OAuthFlows(
                clientCredentials =
                @OAuthFlow(
                        tokenUrl = "http://localhost:9090/realms/trip-thread/protocol/openid-connect/token"
                )
        ),
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
