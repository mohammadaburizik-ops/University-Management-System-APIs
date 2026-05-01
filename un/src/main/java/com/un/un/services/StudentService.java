package com.un.un.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.un.un.Models.Student;
import com.un.un.repository.StudentCRUDRepository;
import com.un.un.repository.StudentRepository;

import jakarta.el.ELException;

@Service
public class StudentService {

  @Autowired
  private StudentRepository studentRepository;

  public List<Student> getAllStudent() {
    List<Student> studentList = new ArrayList<>();

    studentRepository.findAll().forEach(student1 -> studentList.add(student1));
    return studentList;
  }

  public List<Student> getStudent(int stdId) {
    List<Student> studentList = new ArrayList<>();
    try {
      Student student = studentRepository.findById(stdId).get();
      studentList.add(student);

    } catch (NoSuchElementException e) {
      return studentList;
    }

    return studentList;
  }

  public String saveStudent(Student student) {
    int id = student.getStudentId();

    if (isExist(id)) {
      return "Student is found";
    }
    try {
      studentRepository.save(student);

    } catch (Exception exception) {
      return "Student is not saved";
    }

    return "Student #" + id + " is saved or updated";

  }

  public String deleteStudent(int id) {

    if (!isExist(id)) {
      return "Student not found";

    }
    try {
      studentRepository.deleteById(id);
    } catch (Exception e) {
      return "Student is not deleted";
    }
    return "Student #" + id + " is deleted";
  }

  public String updateStudent(Student student) {
    int id = student.getStudentId();
    if (!isExist(id)) {
      return "Student not found";

    }
    try {
      studentRepository.save(student);
    } catch (Exception e) {
      return "Student is not updated";
    }
    return "Student #" + id + " is updated";

  }

  public boolean isExist(int studentId) {
    try {
      Student student = getStudent(studentId).get(0);

      if (student.equals(null)) {
        return false;
      }

    } catch (IndexOutOfBoundsException e) {
      return false;

    } catch (Exception e) {
      return false;
    }
    return true;
  }
}
