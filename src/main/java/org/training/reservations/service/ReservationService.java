package org.training.reservations.service;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.training.reservations.model.Reservation;
import org.training.reservations.service.exception.ReservationException;

/**
 * Reservation service is responsible for placing reservations on resources and ensuring that two overlapping
 * reservation can not happen on the same resource.
 */
public interface ReservationService {

    /**
     * Places a reservation on the specified resource for the time period.
     * 
     * @param resourceId
     *            the identifier of the resource to be reserved
     * @param from
     *            starting date of the reservation period (inclusive)
     * @param to
     *            ending date of the reservation period (inclusive)
     * @param owner
     *            the identifier of the owner of the reservation
     * @return the Reservation object, containing the related reservation id.
     * @throws ReservationException
     *             if the reservation request overlaps with an existing reservation or the parameters are invalid
     */
    Reservation makeReservation(long resourceId, @NotNull Date from, @NotNull Date to, @NotNull String owner)
        throws ReservationException;
}
