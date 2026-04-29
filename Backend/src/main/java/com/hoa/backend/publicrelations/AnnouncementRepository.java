package com.hoa.backend.publicrelations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    @Query("SELECT a FROM Announcement a WHERE a.archived = false ORDER BY a.pinned DESC, a.publishedAt DESC")
    List<Announcement> findAllActiveOrderByPinnedAndDate();
}
