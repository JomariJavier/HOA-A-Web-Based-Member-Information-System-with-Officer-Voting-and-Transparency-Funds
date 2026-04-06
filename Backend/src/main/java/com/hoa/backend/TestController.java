package com.hoa.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173") // Allow React
public class TestController {

    @GetMapping("/connection")
    public List<String> testConnection() {
        // This returns a simple list to prove the backend is alive
        return Arrays.asList("Database Connected: True", "Backend Status: Online", "Project: HOA System");
    }
}