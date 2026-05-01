package com.un.un.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import com.un.un.Models.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Iterable<Course> findCourse(String corId);

}
