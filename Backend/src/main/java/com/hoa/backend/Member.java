package com.hoa.backend;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "members")
@Data // Lombok: auto-generates getters/setters
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String status;
}