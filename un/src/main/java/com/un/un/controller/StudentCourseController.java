package com.un.un.controller;

import org.hibernate.mapping.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.un.un.Models.Course;
import com.un.un.Models.Student;
import com.un.un.Models.StudentCourse;
import com.un.un.repository.StudentCourseRepository;
import com.un.un.services.CourseService;
import com.un.un.services.StudentCourseService;
import com.un.un.services.StudentService;

@RestController
@RequestMapping("/api")
public class StudentCourseController {

  @Autowired
  private StudentCourseService studentCourseService;
  
  @Autowired
  private CourseService courseService;

  @Autowired
  private StudentService studentService;

  @PostMapping("/enrollstudent")
  public String enrollstudent(@RequestParam int studentId, @RequestParam int courseId) {

    try {

      return studentCourseService.enrollStudentCourse(studentId, courseId);
    } catch (Exception e) {
      e.printStackTrace();
      return e.getMessage();
    }

  }

  @GetMapping("/getAllCourseStudents")
  public Object getAllCourseStudents(@RequestParam int courseId) {
    try {

      return studentCourseService.getAllCourseStudents(courseId);

    } catch (Exception e) {
      return e.getMessage();
    }

  }

  @GetMapping("/getAllStudentCourses")
  public Object getAllStudentCourses(@RequestParam int studentId) {
    try {
      return studentCourseService.getAllStudentCourses(studentId);
    } catch (Exception e) {
      return e.getMessage();
    }

  }

  @PostMapping("/setStudentCourseGrade")
  public String setStudentCourseGrade(@RequestParam int studentId, @RequestParam int courseId,
      @RequestParam Double grade) {
    try {

      return studentCourseService.setStudentCourseGrade(studentId, courseId, grade);
    } catch (Exception e) {
      e.printStackTrace();
      return e.getMessage();

    }

  }

  // testing for better developing

  @GetMapping("/getallstudentgrade")
  public Iterable<StudentCourse> getAllStudentGrade() {

    return studentCourseService.getAllStudentGrade();
  }

  //get grade

  @GetMapping("/getstudentcoursegrade")
  public String getStudentCourseGrade(@RequestParam int studentId, @RequestParam int courseId) {

    try {
      
      return studentCourseService.getStudentCourseGrade(studentId, courseId);
    } catch (Exception e) {
      e.printStackTrace();
      return e.getMessage();
    }

  }

}
