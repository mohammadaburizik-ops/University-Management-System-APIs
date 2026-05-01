package com.un.un.Models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class StudentCourseKey implements Serializable {

    @Column(name = "STD-ID")
    private int studentId;

    @Column(name = "COR-ID")
    private int courseId;
}
