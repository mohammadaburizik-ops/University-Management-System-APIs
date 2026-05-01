package com.un.un.Models;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "std-cor-table")
@NamedQuery(name = "StudentCourse.findStudentCourse", query = "SELECT u FROM StudentCourse u where u.id=?1 and u.grade is null or u.grade >0")
public class StudentCourse {
  @EmbeddedId

  StudentCourseKey studentCourseId;

  @Column(name = "Grade", columnDefinition = "double precision default 0.0")
  @ColumnDefault("0.0")
  Double grade = 0.0;

  @Column(name = "Description")
  String description;
  

}
