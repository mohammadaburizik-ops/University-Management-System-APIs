package com.un.un.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.baeldung.springsoap.gen.GetAllStudentResponse;
import com.baeldung.springsoap.gen.GetCountryRequest;
import com.baeldung.springsoap.gen.GetCountryResponse;
import com.baeldung.springsoap.gen.StudentList;
import com.baeldung.springsoap.gen.StudentType;
import com.un.un.Models.Student;
import com.un.un.repository.CountryRepository;
import com.un.un.repository.StudentRepository;
import com.un.un.services.StudentService;

@Endpoint
public class StudentEndpoint {

  private static final String NAMESPACE_URI = "http://www.baeldung.com/springsoap/gen";

  private StudentService studentService;

  @Autowired
  public StudentEndpoint(StudentService studentService) {
    this.studentService = studentService;
  }

  @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllStudentRequest")
  @ResponsePayload
  public GetAllStudentResponse getAllStudent() {

    StudentList studentNewList = new StudentList();

    List<Student> studentList = studentService.getAllStudent();
    for (Student student : studentList) {
      StudentType studentType = new StudentType();

      studentType.setId(student.getStudentId());
      studentType.setFirstName(student.getFName());
      studentType.setLastName(student.getLName());
      studentType.setAddress(student.getAddres());
      studentType.setNatId(student.getNatId());

      studentNewList.getStudentList().add(studentType);

    }
    GetAllStudentResponse getAllStudentResponse = new GetAllStudentResponse();
    getAllStudentResponse.setStudentList(studentNewList);

    return getAllStudentResponse;
  }

}
