package com.un.un.repository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.baeldung.springsoap.gen.Country;

import jakarta.annotation.PostConstruct;

@Component
public class CountryRepository {

    private static final Map<String, Country> countries = new HashMap<>();

    @PostConstruct
    public void initData() {
        // initialize countries map
    }

    public Country findCountry(String name) {
        return countries.get(name);
    }
}