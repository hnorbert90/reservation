package org.training.reservations.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity(name = "Reservation")
@Table(indexes = { @Index(name = "IDX_DATES", columnList = "startDate,endDate") })
@NamedQueries({
        @NamedQuery(name = "Reservation.countNumberOfOverlapingReservationsOfPeriod", query = "SELECT Count(r.id) FROM Reservation r WHERE r.resourceId = :resourceId AND ("
                + "(r.startDate <= :from AND r.endDate >= :from AND r.endDate <= :to) OR "
                + "(r.startDate >= :from AND r.startDate <= :to AND r.endDate >= :to) OR "
                + "(r.startDate <= :from AND r.endDate >= :to) OR"
                + "(r.startDate >= :from AND r.endDate <= :to))"),

        @NamedQuery(name = "Reservation.findReservationsOfPeriod", query = "SELECT r FROM Reservation r WHERE "
                + "(r.startDate <= :from AND r.endDate >= :from AND r.endDate <= :to) OR "
                + "(r.startDate >= :from AND r.startDate <= :to AND r.endDate >= :to) OR "
                + "(r.startDate <= :from AND r.endDate >= :to) OR"
                + "(r.startDate >= :from AND r.endDate <= :to)"
                + "ORDER BY r.startDate, r.endDate"),
        
        @NamedQuery(name = "Reservation.findReservationsOfSpecificResourceId", query = "SELECT r FROM Reservation r WHERE r.resourceId = :resourceId "
                + "ORDER BY r.startDate, r.endDate"),
        
        @NamedQuery(name = "Reservation.findReservationsOfPeriodBySpecificResourceId", query = "SELECT r FROM Reservation r WHERE r.resourceId = :resourceId AND ("
                + "(r.startDate <= :from AND r.endDate >= :from AND r.endDate <= :to) OR "
                + "(r.startDate >= :from AND r.startDate <= :to AND r.endDate >= :to) OR "
                + "(r.startDate <= :from AND r.endDate >= :to) OR"
                + "(r.startDate >= :from AND r.endDate <= :to))"
                + "ORDER BY r.startDate, r.endDate")
        
})
public class Reservation implements Serializable {

    private static final long serialVersionUID = -6884992404110500421L;

    @Id
    @GeneratedValue
    // @JsonProperty("reservationId")
    private long id;

    @NotNull
    private Long resourceId;

    @Temporal(TemporalType.DATE)
    @Column(name = "startdate")
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "enddate")
    private Date endDate;

    @Basic
    @Column(length = 64, nullable = false)
    private String owner;

    public Long getResourceId() {
        return resourceId;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Reservation [id=" + id + ", resourceId=" + resourceId + ", startDate=" + startDate + ", endDate="
                + endDate + ", owner=" + owner + "]";
    }
}
