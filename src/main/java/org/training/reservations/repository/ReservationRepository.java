package org.training.reservations.repository;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.training.reservations.model.Reservation;

/**
 * Repository interface to access reservations.
 * 
 * Note: the selections below are manifested as JPA Named Queries in the model class.
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query
    Long countNumberOfOverlapingReservationsOfPeriod(@Param("resourceId") long resourceId, @Param("from") Date from,
            @Param("to") Date to);

    @Query
    Page<Reservation> findReservationsOfPeriod(@Param("from") Date from, @Param("to") Date to, Pageable paging);
    
    @Query
    Page<Reservation> findReservationsOfSpecificResourceId(@Param("resourceId") long resourceId, Pageable paging);

    @Query
    Page<Reservation> findReservationsOfPeriodBySpecificResourceId(@Param("from") Date from, @Param("to") Date to,
            @Param("resourceId") long resourceId, Pageable paging);

}
