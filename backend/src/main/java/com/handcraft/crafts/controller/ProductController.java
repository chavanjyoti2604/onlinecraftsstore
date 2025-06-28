package com.handcraft.crafts.controller;

import com.handcraft.crafts.dto.ProductWithShopDTO;
import com.handcraft.crafts.entity.Product;
import com.handcraft.crafts.service.ProductService;
import com.handcraft.crafts.service.UserInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;
    private final UserInfoService userInfoService;

    public ProductController(ProductService productService, UserInfoService userInfoService) {
        this.productService = productService;
        this.userInfoService = userInfoService;
    }

    // ✅ Add product (only if shop is approved)
    @PostMapping("/add/{shopId}")
    public ResponseEntity<?> addProduct(@PathVariable int shopId,
                                        @RequestBody Product product,
                                        Authentication authentication) {
        try {
            return ResponseEntity.ok(productService.addProduct(shopId, product));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all products for a specific shop
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<?> getProductsByShop(@PathVariable int shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    // ✅ Get products added by logged-in seller
    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts(Authentication authentication) {
        String email = authentication.getName(); // extracted from JWT
        return ResponseEntity.ok(productService.getProductsBySeller(email));
    }

    // ✅ Get all products with shop info (used in ProductList)
    @GetMapping("/all-with-shops")
    public ResponseEntity<List<ProductWithShopDTO>> getAllProductsWithShops() {
        return ResponseEntity.ok(productService.getAllProductsWithShops());
    }
}
