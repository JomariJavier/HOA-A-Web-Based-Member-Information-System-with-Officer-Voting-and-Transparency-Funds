package com.hoa.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // JpaRepository gives us save(), findAll(), findById(), and delete() for free!
}