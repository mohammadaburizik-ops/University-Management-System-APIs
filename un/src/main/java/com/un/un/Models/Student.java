package com.un.un.Models;

import java.util.*;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import org.springframework.data.jpa.repository.Query;

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
@Table(name = "st-table")
@Data
@NoArgsConstructor
@AllArgsConstructor

@NamedQuery(name = "Student.findStudent", query = "SELECT u FROM Student u where u.id=?1")
public class Student {

    @Id
    @Column(name = "ST-ID")
    private int studentId;

    @Column(name = "ST-FName")
    private String fName;

    @Column(name = "ST-LName")
    private String lName;

    @Column(name = "ST-Addre")
    private String addres;

    @Column(name = "ST-Mobile")
    private String mobile;

    @Column(name = "ST-NatID")
    private int natId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "std-cor-table", joinColumns = @JoinColumn(name = "STD-ID"), inverseJoinColumns = @JoinColumn(name = "COR-ID"))

    @JsonIgnore
    private List<Course> courses;

    @Override
    public String toString() {
        return "Student [studentId=" + studentId + ", fName=" + fName + ", lName=" + lName + ", addres=" + addres
                + ", mobile=" + mobile + ", natId=" + natId + "]";
    }

}
