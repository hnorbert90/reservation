package org.training.reservations.service.impl;

import java.util.Date;

import javax.inject.Inject;
import javax.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.training.reservations.model.Reservation;
import org.training.reservations.repository.ReservationRepository;
import org.training.reservations.service.ReservationService;
import org.training.reservations.service.exception.ReservationDateOrderException;
import org.training.reservations.service.exception.ReservationException;
import org.training.reservations.service.exception.ResourceUnavailableException;

@Service
@Validated
public class ReservationServiceImpl implements ReservationService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Inject
    private ReservationRepository reservationRepository;

    @Transactional
    public Reservation makeReservation(long resourceId, @NotNull Date from, @NotNull Date to, @NotNull String owner)
        throws ReservationException {

        logger.debug("Reservation attempt for {}, from:{}, to:{}, initiated-by:{}", resourceId, from, to, owner);

        assertFromToDateOrder(from, to);

        Long overlaps = reservationRepository.countNumberOfOverlapingReservationsOfPeriod(resourceId, from, to);

        if (overlaps == 0) {
            org.training.reservations.model.Reservation r = new Reservation();
            r.setResourceId(resourceId);
            r.setStartDate(from);
            r.setEndDate(to);
            r.setOwner(owner);
            reservationRepository.save(r);

            logger.info("Successful reservation for {}, from:{}, to:{}, initiated-by:{}", resourceId, from, to, owner);

            return r;
        } else {
            throw new ResourceUnavailableException("Resource already reserved for the time period");
        }

    }

    private void assertFromToDateOrder(Date from, Date to) throws ReservationDateOrderException {
        if (from.compareTo(to) > 0) {
            throw new ReservationDateOrderException("From-date must preceed the To-date");
        }
    }

}
