package com.un.un.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.un.un.Models.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    Iterable<Student> findStudent(String stdId);
}
