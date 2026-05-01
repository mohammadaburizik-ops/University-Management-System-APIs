package com.un.un.controller;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.un.un.Models.Course;
import com.un.un.Models.Student;
import com.un.un.services.StudentService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/getallstudent")
    public Iterable<Student> GetAllStudent() {
        return studentService.getAllStudent();
    }

    @GetMapping("/getStudent")
    public Object getStudent(@RequestParam String stdId) {
        if (stdId == null || stdId.isEmpty()) {

            return studentService.getAllStudent();

        }

        else {
            List stuList = studentService.getStudent(Integer.parseInt(stdId));

            if (stuList.size() == 0) {
                return "Student not found";
            }
            return stuList;
        }

    }

    @PostMapping("/saveStudent")
    public String saveStudent(@RequestBody Student student) {

        return studentService.saveStudent(student);

    }

    @DeleteMapping("/deleteStudent")
    public String deleteStudent(@RequestParam int studentId) {

        
        return studentService.deleteStudent(studentId);

    }

    @PutMapping("/updateStudent")
    public String updateStudent(@RequestBody Student student) {
        return studentService.updateStudent(student);

    }

}
