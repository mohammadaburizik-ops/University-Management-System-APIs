package com.un.un.Models;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cor-table")
@Data
@NoArgsConstructor
@AllArgsConstructor

@NamedQuery(name = "Course.findCourse", query = "SELECT u FROM Course u where u.id=?1")
public class Course {

	@Id
	@Column(name = "COR- ID")
	private int courseId;

	@Column(name = "Cor-Name")
	private String name;

	@Column(name = "Cor-Description")
	private String description;

	@Column(name = "cor-name-app")
	private String nameAppre;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "std-cor-table", joinColumns = @JoinColumn(name = "COR-ID"), inverseJoinColumns = @JoinColumn(name = "STD-ID"))

	@JsonIgnore
	private List<Student> students;

	@Override
	public String toString() {
		return "Course [courseId=" + courseId + ", name=" + name + ", description=" + description + ", nameAppre="
				+ nameAppre + "]";
	}

}
