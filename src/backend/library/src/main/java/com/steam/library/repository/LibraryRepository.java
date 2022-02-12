package com.steam.library.repository;

import com.steam.library.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Integer> {
    List<Library> findAllByUserIdAndGameIdIn(Integer userId, List<Integer> gameIds);
}
