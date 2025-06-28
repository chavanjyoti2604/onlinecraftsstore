package com.handcraft.crafts.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded images (product and screenshot)
        Path uploadDir = Paths.get(System.getProperty("user.dir")).toAbsolutePath();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(
                        uploadDir.resolve("uploads/screenshots/").toUri().toString(),
                        uploadDir.resolve("uploads/products/").toUri().toString()
                );

        // You can add other mappings here if needed
    }
}
