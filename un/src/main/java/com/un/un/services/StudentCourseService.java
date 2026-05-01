package com.un.un.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.un.un.Models.*;
import com.un.un.repository.CourseRepository;
import com.un.un.repository.StudentCRUDRepository;
import com.un.un.repository.StudentCourseRepository;
import com.un.un.repository.StudentRepository;

@Service
public class StudentCourseService {

  @Autowired
  private CourseService courseService;

  @Autowired
  private StudentService studentService;

  @Autowired
  private StudentCourseRepository studentCourseRepository;

  public List<StudentCourse> getAllStudentCourse() {
    List<StudentCourse> studentCourseList = new ArrayList<>();

    studentCourseRepository.findAll().forEach(studentCourse1 -> studentCourseList.add(studentCourse1));
    return studentCourseList;
  }

  public List<StudentCourse> getStudentCourse(int corId, int stuId) {
    List<StudentCourse> studentCourseList = new ArrayList<>();
    try {
      StudentCourseKey studentCourseKey = new StudentCourseKey();
      studentCourseKey.setCourseId(corId);
      studentCourseKey.setStudentId(stuId);

      StudentCourse studentCourse = studentCourseRepository.findById(studentCourseKey).get();
      studentCourseList.add(studentCourse);
    } catch (NoSuchElementException e) {

    }

    return studentCourseList;
  }

  public boolean isExist(int corId, int stuId) {
    try {

      StudentCourse studentCourse = getStudentCourse(corId, stuId).get(0);

      if (studentCourse.equals(null)) {
        return false;
      }

    } catch (IndexOutOfBoundsException e) {
      return false;

    } catch (Exception e) {
      return false;
    }
    return true;
  }

  public String enrollStudentCourse(int studentId, int courseId) {

    if (!studentService.isExist(studentId)) {
      return "Student  not exist";
    }

    if (!courseService.isExist(courseId)) {
      return "course  not exist";
    }

    Course course = courseService.getCourse(courseId).get(0);
    Student student = studentService.getStudent(studentId).get(0);

    if (isExist(courseId, studentId)) {
      return " Student #" + studentId + " is already enrolled in course#" + courseId;
    }

    try {
      // course.getStudents().add(student);
      // courseService.SaveCourse(course);
      saveStudentCourse(studentId, courseId);

    } catch (Exception e) {
      return " System error pls contact with admin ! " + e.getMessage();

    }

    return "Student #" + studentId + " is enrolled to course #" + courseId + " Successfully";

  }

  public String saveStudentCourse(int studentId, int courseId) {
    if (!studentService.isExist(studentId)) {
      return "Student  not exist";
    }

    if (!courseService.isExist(courseId)) {
      return "Course not exist";
    }

    Course course = courseService.getCourse(courseId).get(0);
    Student student = studentService.getStudent(studentId).get(0);
    if (isExist(courseId, studentId)) {
      return "student enrollment to Course  exist";
    }
    StudentCourseKey studentCourseKey = new StudentCourseKey();
    studentCourseKey.setCourseId(courseId);
    studentCourseKey.setStudentId(studentId);

    StudentCourse studentCourse = new StudentCourse();
    studentCourse.setStudentCourseId(studentCourseKey);

    try {

      studentCourseRepository.save(studentCourse);

    } catch (Exception e) {
      return " Error in save student course";
    }

    return "student course #" + studentCourseKey + " is saved or updated";
  }

  public List getAllCourseStudents(int courseId) {

    Course course = courseService.getCourse(courseId).get(0);

    List<Student> studentList = course.getStudents();

    return studentList;
  }

  public List getAllStudentCourses(int studentId) {

    Student student = studentService.getStudent(studentId).get(0);

    List<Course> courseList = student.getCourses();

    return courseList;
  }

  public String setStudentCourseGrade(int studentId, int courseId, double grade) {

    if (!studentService.isExist(studentId)) {
      return "Student  not exist";
    }

    if (!courseService.isExist(courseId)) {
      return "Course not exist";
    }

    Course course = courseService.getCourse(courseId).get(0);
    Student student = studentService.getStudent(studentId).get(0);

    StudentCourseKey studentCourseKey = new StudentCourseKey();
    studentCourseKey.setCourseId(courseId);
    studentCourseKey.setStudentId(studentId);
    try {
      StudentCourse studentCourse = getStudentCourse(courseId, studentId).get(0);
      if (studentCourse == null) {
        return "student not enrolled in this course";
      }
      studentCourse.setGrade(grade);
      if (grade > 50) {
        studentCourse.setDescription("Pass");
      } else {
        studentCourse.setDescription("Fail");
      }

      return SaveOrUpdateStudentCourse(studentCourse);
    } catch (IndexOutOfBoundsException e) {
      return " student is not enrolled ";
    } catch (Exception e) {
      return "Error during processing call to admin";
    }

  }

  public String SaveOrUpdateStudentCourse(StudentCourse studentCourse) {

    try {
      studentCourseRepository.save(studentCourse);
    } catch (Exception exception) {
      return exception.getMessage();
    }

    return "Student grade is updated";
  }

  // UPDATES
  public List<StudentCourse> getAllStudentGrade() {
    List<StudentCourse> gradeList = new ArrayList<>();

    studentCourseRepository.findAll().forEach(grade1 -> gradeList.add(grade1));
    return gradeList;
  }

  // Get Student grade using student id and course id
  public String getStudentCourseGrade(int studentId, int courseId) {

    if (!studentService.isExist(studentId)) {
      return "Student  not exist";
    }

    if (!courseService.isExist(courseId)) {
      return "Course not exist";
    }

    // Course course = courseService.getCourse(courseId).get(0);
    // Student student = studentService.getStudent(studentId).get(0);

    StudentCourseKey studentCourseKey = new StudentCourseKey();
    studentCourseKey.setCourseId(courseId);
    studentCourseKey.setStudentId(studentId);
    try {
      StudentCourse studentCourse = getStudentCourse(courseId, studentId).get(0);
      if (studentCourse == null) {
        return "student not enrolled in this course ";
      }
      double studentgrade = studentCourse.getGrade();
      String description = studentCourse.getDescription();

      if (description.equals("Fail")) {
        return "Unfortunately Student#"+ studentId+" has fail to pass course#"+ courseId+" and can not show grade!";
      }
      if (description.equals("Pass")) {
        
        return "Congratulations! Student#" + studentId + " grade is " + studentgrade + ", student has " + description
            + " the course#" + courseId + " successfully!!";
      } else {
        return "Student has not finish the course yet";
      }
    } catch (IndexOutOfBoundsException e) {
      return " student is not enrolled ";
    } catch (Exception e) {
      return "Error during processing call to admin";
    }

  }

}
