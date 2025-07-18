package com.example.deploy.controllers;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CalTest {
    Cal calculator = new Cal();
    @Test
    public void testAdd() {
        int result = calculator.add(10, 5);
        assertEquals(15, result);
    }
    @Test
    public void testSub() {
        int result = calculator.sub(10, 4);
        assertEquals(6, result);
    }
    @Test
    public void testMul() {
        int result = calculator.mul(3, 7);
        assertEquals(21, result);
    }
    @Test
    public void testDiv() {
        int result = calculator.div(20, 4);
        assertEquals(5, result);
    }
    @Test
    public void testDivideByZero() {
        try {
            calculator.div(10, 0);
        } catch (ArithmeticException e) {
            assertEquals("/ by zero", e.getMessage());
        }
    }
}
