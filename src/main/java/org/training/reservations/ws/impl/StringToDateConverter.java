package org.training.reservations.ws.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToDateConverter implements Converter<String, Date> {

    public Date convert(String source) {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        try {
            return sdf.parse(source);
        } catch (ParseException e) {
            throw new DateParseException();
        }
    }
}

class DateParseException extends RuntimeException {
    public DateParseException() {
        super("Please check the date format, it should be YYYY-MM-DD");
    }
}