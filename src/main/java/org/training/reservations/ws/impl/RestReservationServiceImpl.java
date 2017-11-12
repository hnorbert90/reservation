package org.training.reservations.ws.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.training.reservations.model.Reservation;
import org.training.reservations.repository.ReservationRepository;
import org.training.reservations.service.ReservationService;
import org.training.reservations.service.exception.ReservationDateOrderException;
import org.training.reservations.service.exception.ReservationException;
import org.training.reservations.service.exception.ResourceUnavailableException;

/**
 * Rest Service Endpoint to manage reservations.
 */
@RestController
@RequestMapping("/api/reservations")
public class RestReservationServiceImpl {

    @Autowired
    private ReservationService service;

    @Autowired
    private ReservationRepository repository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public Page<Reservation> list(Pageable paging) {
        return repository.findAll(paging);
    }

    @RequestMapping(value = "/from-{startDate}/to-{endDate}/", method = RequestMethod.GET)
    public Page<Reservation> findByDate(
            @PathVariable Date startDate,
            @PathVariable Date endDate, Pageable paging) {

        return repository.findReservationsOfPeriod(startDate, endDate, paging);
    }
    
    @RequestMapping(value = "/resource/from-{startDate}/to-{endDate}/{resourceId}/", method = RequestMethod.GET)
    public Page<Reservation> findByDateAndResource(@PathVariable Date startDate,
            @PathVariable Date endDate, @PathVariable long resourceId, Pageable paging) {
        return repository.findReservationsOfPeriodBySpecificResourceId(startDate, endDate,resourceId, paging);
    }
    
    @RequestMapping(value = "/resource/{resourceId}/", method = RequestMethod.GET)
    public Page<Reservation> findByResourceId(@PathVariable long resourceId, Pageable paging) {
        return repository.findReservationsOfSpecificResourceId(resourceId, paging);
    }

    @RequestMapping(value = "/{resourceId}/from-{startDate}/to-{endDate}/", method = RequestMethod.POST)
    public ResponseEntity<Void> book(
            @PathVariable("resourceId") Long resourceId,
            @PathVariable("startDate") Date startDate,
            @PathVariable("endDate") Date endDate,
            @RequestParam("owner") String owner) throws ReservationException {

        Reservation r = service.makeReservation(resourceId, startDate, endDate, owner);

        HttpHeaders headers = new HttpHeaders();
        headers.add("reservation-id", String.valueOf(r.getId()));

        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}/", method = RequestMethod.GET)
    public ResponseEntity<Reservation> getById(@PathVariable("id") long id) {
        return new ResponseEntity<Reservation>(retrieveReservation(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        retrieveReservation(id); // ensures, that the reservation exists
        repository.delete(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }

    // just for testing... no business case for this function.
    @RequestMapping(value = "/", method = RequestMethod.DELETE)
    @ResponseStatus(value = HttpStatus.NO_CONTENT, reason = "The reservations have been deleted")
    public ResponseEntity<Void> deleteAll() {
        repository.deleteAll();
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT); // 204
    }

    @ExceptionHandler
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "The specified dates cannot be interpreted. The format should be YYYY-MM-DD")
    public void handle(MethodArgumentTypeMismatchException e) {
    }

    @ExceptionHandler
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "The specified dates range is not correct - the From-date must preceed the To-date")
    public void handle(ReservationDateOrderException e) {
    }

    @ExceptionHandler
    @ResponseStatus(value = HttpStatus.CONFLICT, reason = "Reservation failed: resource already reserved for the specified period")
    public void handle(ResourceUnavailableException e) {
    }

    @ExceptionHandler
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "The specified reservation is not found")
    public void handle(DataRetrievalFailureException e) {
    }

    /**
     * Retrieves the reservation by ID from the underlying repository and returns it.
     * 
     * @param reservationId
     * @throws DataRetrievalFailureException
     *             if the specified reservation does not exist
     */
    private Reservation retrieveReservation(long reservationId) {
        Reservation r = repository.findOne(reservationId);
        if (r == null) {
            throw new DataRetrievalFailureException("reservation not found");
        }
        return r;
    }
}
