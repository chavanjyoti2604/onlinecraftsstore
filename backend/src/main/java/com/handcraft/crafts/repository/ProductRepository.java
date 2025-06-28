package com.handcraft.crafts.repository;

import com.handcraft.crafts.dto.ProductWithShopDTO;
import com.handcraft.crafts.entity.Product;
import com.handcraft.crafts.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByShop(Shop shop);
    List<Product> findByShopIn(List<Shop> shops);
    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT new com.handcraft.crafts.dto.ProductWithShopDTO(" +
            "p.id, p.name, p.description, p.price, s.id, s.shopName, s.location, p.imageUrl, p.upiId) " +
            "FROM Product p JOIN p.shop s")
    List<ProductWithShopDTO> findAllProductsWithShopInfo();

    default List<ProductWithShopDTO> findAllWithShops() {
        return findAllProductsWithShopInfo();
    }
}
