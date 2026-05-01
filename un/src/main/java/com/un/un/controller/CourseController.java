package com.un.un.controller;

import org.springframework.web.bind.annotation.RestController;

import com.un.un.Models.Course;
import com.un.un.Models.Student;
import com.un.un.services.CourseService;

import jakarta.el.ELException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/getallcourse")
    public Iterable<Course> GetAllCourse() {
        return courseService.getAllCourse();
    }

    @GetMapping("/getCourse")
    public Object getCourse(@RequestParam String corId) {
        if (corId == null || corId.isEmpty()) {
            return courseService.getAllCourse();

        } else {

            List couList = courseService.getCourse(Integer.parseInt(corId));

            if (couList.size() == 0) {
                return "Course not found";
            }
            return couList;
        }
    }

    @PostMapping("/saveCourse")
    public String savecourse(@RequestBody Course course) {

        return courseService.SaveCourse(course);

    }

    @DeleteMapping("/deleteCourse")
    public String deleteCourse(@RequestParam int courseID) {

        return courseService.deleteCourse(courseID);

    }

    @PutMapping("/updateCourse")
    public String updateCourse(@RequestBody Course course) {

        return courseService.updateCourse(course);

    }

}