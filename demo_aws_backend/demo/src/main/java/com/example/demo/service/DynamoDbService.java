package com.example.demo.service;

import com.example.demo.model.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DynamoDbService {

    private final DynamoDbTable<Item> table;

    public DynamoDbService(DynamoDbEnhancedClient enhancedClient,
                           @Value("${aws.dynamodb.table:demo_items}") String tableName) {
        this.table = enhancedClient.table(tableName, TableSchema.fromBean(Item.class));
    }

    public Item createItem(String name, String description) {
        Item item = new Item();
        item.setId(UUID.randomUUID().toString());
        item.setName(name);
        item.setDescription(description);
        item.setCreatedAt(System.currentTimeMillis());
        table.putItem(item);
        return item;
    }

    public Item getItem(String id) {
        return table.getItem(Key.builder().partitionValue(id).build());
    }

    public List<Item> listItems() {
        List<Item> items = new ArrayList<>();
        table.scan().items().forEach(items::add);
        return items;
    }

    public void deleteItem(String id) {
        table.deleteItem(Key.builder().partitionValue(id).build());
    }
}
