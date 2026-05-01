package com.un.un.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.un.un.Models.Course;
import com.un.un.Models.Student;
import com.un.un.repository.CourseCrudRepository;
import com.un.un.repository.CourseRepository;

import jakarta.el.ELException;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  public List<Course> getAllCourse() {
    List<Course> courseList = new ArrayList<>();

    courseRepository.findAll().forEach(course1 -> courseList.add(course1));
    return courseList;
  }

  public List<Course> getCourse(int corId) {
    List<Course> courseList = new ArrayList<>();
    try {
      Course course = courseRepository.findById(corId).get();
      courseList.add(course);
    } catch (NoSuchElementException e) {

    }

    return courseList;
  }

  public String SaveCourse(Course course) {
    int id = course.getCourseId();
    if (isExist(id)) {
      return "Course is found";
    }
    try {

      courseRepository.save(course);

    } catch (Exception e) {
      return " Error in save course";
    }

    return "Course #" + id + " is saved or updated!";
  }

  public String deleteCourse(int id) {

    if (!isExist(id)) {
      return "Course is not found";
    }
    try {
      courseRepository.deleteById(id);
    } catch (Exception e) {
      return "Error in delete course";
    }
    return "Course #" + id + " is deleted";
  }

  public String updateCourse(Course course) {
    int id = course.getCourseId();
    if (!isExist(id)) {
      return "Course is not found";
    }
    try {
      courseRepository.save(course);

    } catch (Exception e) {
      return "Error in delete course";
    }
    return "Course #" + id + " is updated";
  }

  public boolean isExist(int courseId) {
    try {

      Course course = getCourse(courseId).get(0);

      if (course.equals(null)) {
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
