
package com.un.un.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.un.un.Models.Student;
import com.un.un.Models.StudentCourse;
import com.un.un.Models.StudentCourseKey;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, StudentCourseKey> {

    Iterable<StudentCourse> findStudentCourse(String stdId, String corId);
}
