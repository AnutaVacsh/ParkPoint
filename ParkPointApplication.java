package ru.vaschenko.ParkPoint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ru.vaschenko.ParkPoint.model.Admin;
import ru.vaschenko.ParkPoint.model.Password;
import ru.vaschenko.ParkPoint.model.User;
import ru.vaschenko.ParkPoint.type.Role;

@SpringBootApplication
public class ParkPointApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParkPointApplication.class, args);
//		Admin u = new Admin(1, "", new Password(1L, ""), Role.ADMIN);
//		Admin a = new Admin();
//		a.setId(1L);
		System.out.println("kkn");
	}

}
