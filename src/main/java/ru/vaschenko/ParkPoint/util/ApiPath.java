package ru.vaschenko.ParkPoint.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ApiPath {
    public static final String BASE_CLIENT = "/client";

    // Auth
    public static final String AUTH = "auth";
    public static final String CLIENT_LOGIN = "client/login";
    public static final String CLIENT_REGISTER = "client/register";
    public static final String OWNER_REGISTER = "owner/register";

    // Parking Zones
    public static final String PARKING_ZONES = "/parking-zones";
    public static final String PARKING_ZONES_LIST = "/get/list";
    public static final String PARKING_ZONE_PARTIAL = "/get/{id}/partial";
    public static final String PARKING_ZONE_FULL = "/get/{id}";
    public static final String PARKING_ZONE_PAG = "/get/all/pag";
    public static final String PARKING_ZONE_UPDATE_STATE = "/update/state/{id}";
    public static final String PARKING_ZONE_CREATE = "/create";

    // ParkingSpace
    public static final String PARKING_SPACES = "/parking-spaces";
    public static final String PARKING_SPACES_ZONE_LIST = "/get/list/{parkingZoneId}";
    public static final String PARKING_SPACES_ID= "/get/{id}";
    public static final String PARKING_SPACES_CREATE = "/create";
    public static final String PARKING_SPACES_USER = "get/user/{userId}";
    public static final String PARKING_SPACES_UPDATE = "/update";
    public static final String PARKING_SPACE_UPDATE_STATE = "/state/update";
    public static final String PARKING_SPACES_PAG = "/get/all/pag";

    // Bookings
    public static final String BOOKING = "/booking";
    public static final String BOOKING_INFO = "/get/{id}";
    public static final String USER_BOOKING = "/get/booking/{userId}";
    public static final String BOOKING_CREATE = "/create";
    public static final String SUBSCRIPTION_INFO = "/subscription/{idParkingSpace}";
//    public static final String SUBSCRIPTION_CREATE = "/subscription";
    public static final String CANCEL_BOOKING = "/booking/{bookingId}/cancel";
    public static final String MY_BOOKINGS = "/my-bookings";
    public static final String USER_SUBSCRIPTIONS = "/subscriptions/{userId}";
    public static final String CHANGE_STATE_BOOKING = "change/state/{bookingId}";
    public static final String BOOKING_PAG = "/{userId}/getAllWithPag";
    public static final String BOOKING_PAG_OWNER = "/owner/{userId}/getAllWithPag";

    // User
    public static final String USER = "user";
    public static final String USER_INFO = "info/{userId}";
    public static final String USER_CARDS = "/get/cards/{userId}";
    public static final String CREATE_CARD = "/create/card/";
    public static final String COMPLAINT = "/complaint";
    public static final String REVIEW = "/review";
    public static final String COMPLAINTS_AGAINST_USER = "/complaints/{userId}";
    public static final String REVIEW_AGAINST_USER = "/review/{userId}";
    public static final String ALL_USERS_PAG = "/get/all/pag";

    // Subscription
    public static final String SUBSCRIPTION = "subscription";
    public static final String SUBSCRIPTION_GET_USER = "/get/user/{userId}";
    public static final String SUBSCRIPTION_GET_ID= "/get/{id}";
    public static final String SUBSCRIPTION_GET_ALL = "/get";
    public static final String SUBSCRIPTION_CREATE = "/create";

    //Complaint
    public static final String BASE_COMPLAINT = "complaint";
    public static final String COMPLAINT_PAG = "get/all/pag";
    public static final String COMPLAINT_CREATE = "create";
    public static final String COMPLAINT_UPDATE_STATUS = "/update/status";

    //Stats
    public static final String STATS = "stats";
    public static final String ST_USER = "/user";
    public static final String ST_BOOKING = "/booking";
}
