package com.example.demo.controller;

import com.example.demo.model.Item;
import com.example.demo.service.DynamoDbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class DynamoDbController {

    private final DynamoDbService dynamoDbService;

    public DynamoDbController(DynamoDbService dynamoDbService) {
        this.dynamoDbService = dynamoDbService;
    }

    @PostMapping
    public ResponseEntity<Item> create(@RequestBody Map<String, String> body) {
        Item item = dynamoDbService.createItem(body.get("name"), body.get("description"));
        return ResponseEntity.ok(item);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> get(@PathVariable String id) {
        Item item = dynamoDbService.getItem(id);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<List<Item>> list() {
        return ResponseEntity.ok(dynamoDbService.listItems());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        dynamoDbService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
