package com.hoa.backend.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Get last 5 transactions for the dashboard
    List<Transaction> findTop5ByOrderByDateDesc();

    @Query("SELECT SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END) FROM Transaction t")
    Double calculateTotalBalance();
}
