package com.un.un.repository;

import org.springframework.data.repository.CrudRepository;

import com.un.un.Models.Student;

public interface StudentCRUDRepository extends CrudRepository<Student, Integer> {

}
