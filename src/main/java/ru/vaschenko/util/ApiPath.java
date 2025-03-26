package ru.vaschenko.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ApiPath {
    public static final String BASE_CLIENT = "/client";

    // Auth
    public static final String AUTH = "auth";
    public static final String CLIENT_LOGIN = "client/login";
    public static final String CLIENT_REGISTER = "client/register";

    // Parking Zones
    public static final String PARKING_ZONES = "/parking-zones";
    public static final String PARKING_ZONES_LIST = "/get/list";
    public static final String PARKING_ZONE_PARTIAL = "/get/{id}/partial";
    public static final String PARKING_ZONE_FULL = "get//{id}";

    // Bookings
    public static final String BOOKING = "/booking";
    public static final String BOOKING_INFO = "/get/{id}";
    public static final String BOOKING_CREATE = "/create";
    public static final String SUBSCRIPTION_INFO = "/subscription/{idParkingSpace}";
    public static final String SUBSCRIPTION_CREATE = "/subscription";
    public static final String CANCEL_BOOKING = "/booking/{bookingId}/cancel";
    public static final String MY_BOOKINGS = "/my-bookings";
    public static final String USER_SUBSCRIPTIONS = "/subscriptions/{userId}";
    public static final String CHANGE_STATE_BOOKING = "change/state/{bookingId}";

    // User
    public static final String USER = "user";
    public static final String USER_CARDS = "/get/cards/{userId}";
    public static final String CREATE_CARD = "/create/card";
    public static final String COMPLAINT = "/complaint";
    public static final String REVIEW = "/review";
    public static final String COMPLAINTS_AGAINST_USER = "/complaints/{userId}";
}
